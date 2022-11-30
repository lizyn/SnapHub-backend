const webapp = require('./server');
// const db = require('./dbConnection');

const port = 3200;

webapp.listen(port, async () => {
  console.log(`Server running on port: ${port}`);
});

// webapp.connect();

// console.log('??');

// const main = async () => {
//   const conn = db.connect();
// db.addStudent({ name: 'Rachel', major: 'history', email: 'rara@upenn.edu' });
// db.addStudent({ name: 'Micky', major: 'music', email: 'Mik@upenn.edu' });
// await db.findStudentWithMajor("music");
// await db.getResidentsUsingMed("Pennsylvania", "12-17", "med4");
// await db.getAllStudents();
// await db.getAStudent(conn, '635ad18f799a7c5d0c89d320');
// await db.updateStudent('637483116a1c65c75def9fcd', 'sports');
// await db.updateStudent('637483116a1c65c75def9fcc', 'history');
// await db.deleteStudent(conn, '635ad18f799a7c5d0c89d320');
// };
// main();
