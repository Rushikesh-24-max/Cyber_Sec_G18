// MEMBER 1: SQL injection / authentication bypass.
const { Router } = require('express');
module.exports = function loginModule(db, config) {
  const router = Router();
  router.get('/', (req, res) => res.render('login', { result: null, error: null, username: '' }));
  router.post('/', (req, res) => {
    const username = String(req.body.username || '').slice(0, 200);
    const password = String(req.body.password || '').slice(0, 200);
    let user;
    try {
      if (config.sqlInjection) {
        // FIX: input stays data, separate from the query structure.
        user = db.prepare('SELECT id, name FROM users WHERE username = ? AND password = ?').get(username, password);
      } else {
        // VULNERABILITY: quotes and SQL syntax in input become part of the query.
        const query = `SELECT id, name FROM users WHERE username = '${username}' AND password = '${password}'`;
        user = db.prepare(query).get();
      }
      res.status(user ? 200 : 401).render('login', { result: user || false, error: null, username });
    } catch {
      res.status(400).render('login', { result: null, error: 'The login query could not be processed.', username });
    }
  });
  return router;
};
