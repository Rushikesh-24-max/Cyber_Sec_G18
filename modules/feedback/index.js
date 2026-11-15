// MEMBER 4: stored XSS. Storage uses parameters in BOTH modes to isolate XSS.
const { Router } = require('express');
module.exports = function feedbackModule(db, config) {
  const router = Router();
  router.get('/', (req, res) => {
    res.render('feedback', { comments: db.prepare('SELECT * FROM comments ORDER BY id DESC').all(), protectedOutput: config.storedXss });
  });
  router.post('/', (req, res) => {
    const author = String(req.body.author || 'Student').trim().slice(0, 60) || 'Student';
    const body = String(req.body.body || '').trim().slice(0, 1000);
    if (body) db.prepare('INSERT INTO comments (author, body) VALUES (?, ?)').run(author, body);
    res.redirect('/feedback');
  });
  router.post('/clear', (req, res) => {
    db.exec('DELETE FROM comments');
    res.redirect('/feedback');
  });
  return router;
};
