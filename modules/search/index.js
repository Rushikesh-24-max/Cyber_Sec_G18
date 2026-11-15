// MEMBER 3: reflected XSS. The EJS page contains the contrasting output sinks.
const { Router } = require('express');
const notices = [
  { title: 'Library hours extended', text: 'The reading room stays open until 10 PM during exams.', tag: 'Library' },
  { title: 'Semester project presentations', text: 'Bring your laptop and be ready to demonstrate your project.', tag: 'Academics' },
  { title: 'Football club registrations', text: 'Meet the sports coordinator on Friday afternoon.', tag: 'Student life' },
];
module.exports = function searchModule(config) {
  const router = Router();
  router.get('/', (req, res) => {
    const query = String(req.query.q || '').slice(0, 500);
    const results = notices.filter(n => `${n.title} ${n.text}`.toLowerCase().includes(query.toLowerCase()));
    res.render('search', { query, results, protectedOutput: config.reflectedXss });
  });
  return router;
};
