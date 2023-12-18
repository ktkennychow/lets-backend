import { Router } from 'express';
import * as db from '../db/index.js';

const router = new Router();

// READ ALL FROM A USER
const getAllRecordsByUserId = async (request, response) => {
  const { firebase_uid } = request.body;
  const sql = `SELECT * FROM Records WHERE user_id = (SELECT id FROM Users WHERE firebase_uid = $1);`;

  const result = await db.query(sql, [firebase_uid]).catch((error) => {
    console.log(error);
  });
  response.send(result.rows[0]);
};
router.get('/', getAllRecordsByUserId);

// CREATE BY A USER FOR AN EXERCISE
const createRecord = async (request, response) => {
  const { firebase_uid, exercise_id, created_at, sets, reps, weight } = request.body;
  const sql = `INSERT INTO Records (user_id, exercise_id, created_at, sets, reps, weight) SELECT id, $2, $3, $4, $5, $6
          FROM Users
          WHERE firebase_uid = $1
          RETURNING id;`;

  const result = await db.query(sql, [firebase_uid, exercise_id, created_at, sets, reps, weight]).catch((error) => {
    console.log(error);
  });
  response.send(result.rows[0]);
};
router.post('/', createRecord);

// UPDATE RECORD BY ID
const updateRecord = async (request, response) => {
  const { record_id, sets, reps, weight } = request.body;
  const sql = `UPDATE Records SET sets = $2, reps = $3, weight = $4 WHERE id = $1 RETURNING id;`;

  const result = await db.query(sql, [record_id, sets, reps, weight]).catch((error) => {
    console.log(error);
  });
  response.send(result.rows[0]);
};
router.put('/', updateRecord);

// DELETE RECORD BY ID
const deleteRecord = async (request, response) => {
  const { record_id } = request.body;
  const sql = `DELETE FROM Records WHERE id = $1 RETURNING created_at;`;

  const result = await db.query(sql, [record_id]).catch((error) => {
    console.log(error);
  });
  response.send(result.rows[0]);
};
router.delete('/', deleteRecord);

export default router;
