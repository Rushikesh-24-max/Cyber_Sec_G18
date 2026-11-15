// A second ORIGIN for the CSRF lesson. It never receives the portal cookie.
const express = require('express');
const path = require('node:path');
const app = express();
app.use(express.static(__dirname));
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.listen(4000, '127.0.0.1', () => console.log('CSRF demo page: http://127.0.0.1:4000 (portal must use port 3000)'));
