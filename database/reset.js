const { openDatabase, resetDatabase } = require('./index');
const db = openDatabase();
resetDatabase(db);
db.close();
console.log('Dummy profile restored and feedback cleared. Accounts and protection settings unchanged.');
