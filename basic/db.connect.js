let db;

try {
  // assumption: connectToDatabase func passes credentials required to get connected to some kind of db
  db = await connectToDatabase();
} catch (error) {
  // in here could make fancy logic to attempt reconnections within certain timeout and jiter
  console.log("failed to connect to db: ", error);
}
if (!db) throw new Error(`Couldn't establish connection!`);

module.exports = db;
