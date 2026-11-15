const { test } = require('node:test');
const assert = require('node:assert/strict');
const { once } = require('node:events');
const { openDatabase } = require('../database');
const { createApp } = require('../server');

async function fixture(t, protectedMode) {
  const db = openDatabase(':memory:');
  const config = Object.fromEntries(['sqlInjection', 'commandInjection', 'reflectedXss', 'storedXss', 'csrf'].map(key => [key, protectedMode]));
  const server = createApp({ config, db }).listen(0, '127.0.0.1');
  await once(server, 'listening');
  t.after(async () => {
    await new Promise(resolve => { server.close(resolve); server.closeAllConnections(); });
    db.close();
  });
  const origin = `http://127.0.0.1:${server.address().port}`;
  const get = (url, options = {}) => fetch(origin + url, options);
  const post = (url, data, options = {}) => get(url, { method: 'POST', body: new URLSearchParams(data), ...options });
  return { db, get, post };
}

for (const protectedMode of [false, true]) {
  test(`${protectedMode ? 'Protected' : 'Vulnerable'}: all pages render and unknown routes return 404`, async t => {
    const { get } = await fixture(t, protectedMode);
    for (const path of ['/', '/login', '/network', '/search', '/feedback', '/profile']) {
      const response = await get(path);
      assert.equal(response.status, 200, path);
      assert.match(await response.text(), /Student Portal/);
    }
    assert.equal((await get('/missing')).status, 404);
  });

  test(`${protectedMode ? 'Protected' : 'Vulnerable'}: SQL login bypass and normal credentials`, async t => {
    const { post } = await fixture(t, protectedMode);
    assert.match(await (await post('/login', { username: 'student', password: 'campus123' })).text(), /Login successful/);
    assert.equal((await post('/login', { username: 'student', password: 'wrong' })).status, 401);
    const attack = await post('/login', { username: "student' -- ", password: 'wrong' });
    assert.equal(attack.status, protectedMode ? 401 : 200);
    assert.match(await attack.text(), protectedMode ? /Invalid username or password/ : /Login successful/);
  });

  test(`${protectedMode ? 'Protected' : 'Vulnerable'}: reflected XSS output context`, async t => {
    const { get } = await fixture(t, protectedMode);
    const payload = '<script>alert("REFLECTED_XSS")</script>';
    const html = await (await get('/search?q=' + encodeURIComponent(payload))).text();
    assert.equal(html.includes(payload), !protectedMode);
    if (protectedMode) assert.match(html, /&lt;script&gt;/);
    assert.match(await (await get('/search?q=library')).text(), /Library hours extended/);
  });

  test(`${protectedMode ? 'Protected' : 'Vulnerable'}: stored XSS persists and output is encoded after fix`, async t => {
    const { get, post, db } = await fixture(t, protectedMode);
    const payload = '<script>alert("STORED_XSS")</script>';
    await post('/feedback', { author: 'Student', body: payload });
    assert.equal(db.prepare('SELECT body FROM comments').get().body, payload);
    const html = await (await get('/feedback')).text();
    assert.equal(html.includes(payload), !protectedMode);
    if (protectedMode) assert.match(html, /&lt;script&gt;/);
    await post('/feedback/clear', {});
    assert.equal(db.prepare('SELECT COUNT(*) AS n FROM comments').get().n, 0);
  });

  test(`${protectedMode ? 'Protected' : 'Vulnerable'}: command injection marker and legitimate ping`, async t => {
    const { post } = await fixture(t, protectedMode);
    const normal = await (await post('/network', { host: '127.0.0.1' })).text();
    assert.match(normal, /(?:Reply from|bytes from|PING|Pinging|packets|Packets)/);
    const separator = process.platform === 'win32' ? '&' : ';';
    const attack = await post('/network', { host: `127.0.0.1 ${separator} echo COMMAND_INJECTION_WORKED` });
    const html = await attack.text();
    assert.equal(attack.status, protectedMode ? 400 : 200);
    // Inspect output area, not the escaped input reflected into the form.
    if (protectedMode) assert.doesNotMatch(html, /class="terminal"/);
    else assert.match(html, /class="terminal">[\s\S]*COMMAND_INJECTION_WORKED/);
  });

  test(`${protectedMode ? 'Protected' : 'Vulnerable'}: authenticated CSRF request and valid profile edit`, async t => {
    const { get, post, db } = await fixture(t, protectedMode);
    assert.equal((await get('/profile/update?displayName=Anonymous')).status, 401);
    const session = await post('/profile/session', {}, { redirect: 'manual' });
    const cookie = session.headers.get('set-cookie').split(';')[0];
    const headers = { Cookie: cookie };
    const attack = await get('/profile/update?displayName=Changed%20by%20CSRF', { headers, redirect: 'manual' });
    assert.equal(attack.status, protectedMode ? 405 : 302);
    assert.equal(db.prepare('SELECT display_name FROM profile').get().display_name, protectedMode ? 'Aarav Sharma' : 'Changed by CSRF');
    if (protectedMode) {
      assert.equal((await post('/profile/update', { displayName: 'Forged' }, { headers })).status, 403);
      assert.equal((await post('/profile/update', { displayName: 'Forged', _csrf: 'wrong' }, { headers })).status, 403);
      const html = await (await get('/profile', { headers })).text();
      const token = html.match(/name="_csrf" value="([a-f0-9]+)"/)[1];
      assert.equal((await post('/profile/update', { displayName: 'My New Name', _csrf: token }, { headers, redirect: 'manual' })).status, 302);
      assert.equal(db.prepare('SELECT display_name FROM profile').get().display_name, 'My New Name');
    } else {
      await get('/profile/update?displayName=My%20New%20Name', { headers });
      assert.equal(db.prepare('SELECT display_name FROM profile').get().display_name, 'My New Name');
    }
    await post('/profile/logout', {}, { headers });
    assert.equal((await get('/profile/update?displayName=LoggedOut', { headers })).status, 401);
  });
}
