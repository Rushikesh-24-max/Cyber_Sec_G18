const express = require('express');
const demoSessions = require('./lib/demo-session');
const path = require('node:path');
const { openDatabase } = require('./database');
const defaults = require('./config');

// Factory makes meaningful HTTP tests possible without touching demo data.
function createApp({ config = defaults, db = openDatabase() } = {}) {
  const app = express();
  app.disable('x-powered-by');
  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, 'views'));
  app.use(express.urlencoded({ extended: false, limit: '16kb' }));
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(demoSessions());
  app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store');
    res.locals.currentPath = req.path;
    next();
  });
  app.get('/', (req, res) => res.redirect('/login'));
  app.use('/login', require('./modules/login')(db, config));
  app.use('/network', require('./modules/network')(config));
  app.use('/search', require('./modules/search')(config));
  app.use('/feedback', require('./modules/feedback')(db, config));
  app.use('/profile', require('./modules/profile')(db, config));
  app.use((req, res) => res.status(404).render('error', { message: 'That page could not be found.' }));
  app.use((error, req, res, next) => {
    console.error(error.message);
    if (res.headersSent) return next(error);
    res.status(500).render('error', { message: 'The request could not be completed. Check the server terminal.' });
  });
  return app;
}
if (require.main === module) {
  const port = Number(process.env.PORT || 3000);
  createApp().listen(port, '127.0.0.1', () => {
    console.log(`Student Portal: http://127.0.0.1:${port}`);
    console.log('Local assignment lab. Protection settings:', defaults);
    console.log('After a restart, start a fresh profile demo session.');
  });
}
module.exports = { createApp };
