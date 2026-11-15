// Minimal LOCAL LAB sessions. Random opaque IDs live only on the server.
// This is intentionally not a production session/authentication framework.
const { randomBytes } = require('node:crypto');

module.exports = function demoSessions() {
  const sessions = new Map();
  const lifetime = 2 * 60 * 60 * 1000;
  return (req, res, next) => {
    const now = Date.now();
    for (const [key, value] of sessions) if (value.expires <= now) sessions.delete(key);
    const cookie = (req.headers.cookie || '').split(';').map(x => x.trim()).find(x => x.startsWith('portal.sid='));
    let id = cookie ? cookie.slice('portal.sid='.length) : null;
    const entry = id && /^[a-f0-9]{64}$/.test(id) ? sessions.get(id) : null;
    req.session = entry ? entry.data : {};
    req.startDemoSession = () => {
      if (id) sessions.delete(id); // rotate the identifier on sign-in
      id = randomBytes(32).toString('hex');
      req.session = {};
      sessions.set(id, { data: req.session, expires: now + lifetime });
      res.append('Set-Cookie', `portal.sid=${id}; Path=/; HttpOnly; SameSite=Lax; Max-Age=7200`);
    };
    req.endDemoSession = () => {
      if (id) sessions.delete(id);
      req.session = {};
      res.append('Set-Cookie', 'portal.sid=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0');
    };
    next();
  };
};
