const express = require('express');
const app = express();
app.use(express.json());

const cors = require('cors');

app.use(cors());

const pg = require('pg');
let pool = new pg.Pool();

const port = process.env.PORT || 8000;

app.listen(port, function () {
  console.log('App listening on port: ' + port);
});

pool.query(`CREATE TABLE IF NOT EXISTS Exercises(
  exercises_id uuid DEFAULT gen_random_uuid(),
  exercise_name TEXT,
  note TEXT,
  PRIMARY KEY (exercises_id)
);`);

pool.query(`CREATE TABLE IF NOT EXISTS Records(
  record_id uuid DEFAULT gen_random_uuid(),
  exercise_id uuid,
  note TEXT,
  PRIMARY KEY (record_id),
  FOREIGN KEY (exercise_id) REFERENCES Exercises(exercises_id)
);`);

app.get('/health', function (request, response) {
  response.send(`
  <h1>OK</h1>`);
});

app.post('/createExercise', function (request, response) {
  const sql = `INSERT INTO Exercises(exercise_name, note) VALUES(($1), ($2));`;

  const sqlParameters = [request.body.exercise_name, request.body.note];

  pool.query(sql, sqlParameters, function (error) {
    if (error) {
      console.log(error);
      response.send(`error`);
    } else {
      response.send(`success`);
    }
  });
});

app.get('/exercises', function (request, response) {
  const sql = `SELECT * FROM Exercises;`;

  pool.query(sql, function (error, result) {
    if (error) {
      response.send(`error`);
    } else {
      response.send(result.rows);
    }
  });
});

// app.post('/createRecord', function (request, response) {
//   const sql = `INSERT INTO Exercises(exercise_name, note) VALUES(?,?)`;

//   const sqlParameters = [request.body.name, request.body.note];

//   pool.query(sql, sqlParameters, function (error) {
//     if (error) {
//       console.log(error);
//       response.send(`error`);
//     } else {
//       response.send(`success`);
//     }
//   });
// });

// app.get('/records', function (request, response) {
//   const sql = `SELECT * FROM Exercises`;

//   pool.query(sql, function (error, result) {
//     if (error) {
//       response.send(`error`);
//     } else {
//       response.send(result);
//     }
//   });
// });
