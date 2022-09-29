const db = require("db.connect");

const getUserSettings = db.query(/*some quey to fetch user with settings */);

// in this file all the functions that use db connection could lnad
module.exports = { getUserSettings };
