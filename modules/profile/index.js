// MEMBER 5: GET-based CSRF. Independent from Member 1's login exercise.
const { Router } = require('express');
const { randomBytes, timingSafeEqual } = require('node:crypto');
module.exports = function profileModule(db, config) {
  const router = Router();
  const page = (req, res, error = null, status = 200) => {
    res.status(status).render('profile', {
      loggedIn: Boolean(req.session.profileUser),
      profile: db.prepare('SELECT display_name FROM profile WHERE id = 1').get(),
      token: req.session.csrfToken || '', protectedAction: config.csrf, error,
    });
  };
  router.get('/', (req, res) => page(req, res));
  router.post('/session', (req, res) => {
    req.startDemoSession();
    req.session.profileUser = 1;
    req.session.csrfToken = randomBytes(32).toString('hex');
    res.redirect('/profile');
  });
  router.post('/logout', (req, res) => {
    req.endDemoSession();
    res.redirect('/profile');
  });
  router.all('/update', (req, res) => {
    if (!req.session.profileUser) return page(req, res, 'Start your demo session first.', 401);
    if (config.csrf) {
      // FIX: refuse GET writes and verify the session-bound token on POST.
      if (req.method !== 'POST') {
        res.set('Allow', 'POST');
        return page(req, res, 'Profile changes require POST and a valid CSRF token.', 405);
      }
      const supplied = Buffer.from(String(req.body._csrf || ''));
      const expected = Buffer.from(req.session.csrfToken || '');
      if (!expected.length || supplied.length !== expected.length || !timingSafeEqual(supplied, expected)) {
        return page(req, res, 'Request blocked: missing or invalid CSRF token.', 403);
      }
    } else if (req.method !== 'GET') {
      return page(req, res, 'This demo currently uses GET for profile changes.', 405);
    }
    // VULNERABLE mode reaches here for ANY authenticated GET, including a
    // navigation initiated by another website. Cookies are sent by the browser.
    const input = config.csrf ? req.body : req.query;
    const name = String(input.displayName || '').trim().slice(0, 60);
    if (!name) return page(req, res, 'Please provide a display name.', 400);
    db.prepare('UPDATE profile SET display_name = ? WHERE id = 1').run(name);
    res.redirect('/profile');
  });
  return router;
};
