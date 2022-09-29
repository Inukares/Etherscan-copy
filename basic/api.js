const db = require("db.connect");

// this is hypothetical file with all the APIs that reuse db connection instead of db connection being passed into functions ad-hoc as paremeter

const getUser = db.query(/*some quey to fetch user with settings */);
const setAdminRole = db.query();
const notifyUser = () => {};
const notifyAdmins = () => {};

module.exports = { getUser, setAdminRole, notifyUser, notifyAdmins };
