import { Router } from 'express';
import * as db from '../db/index.js';

const router = new Router();

// GET A USER
const getUserByFirebaseId = async (request, response) => {
  const firebase_uid = request.params.id;
  const sql = `SELECT firebase_uid, email, username FROM Users WHERE firebase_uid = $1;`;

  const result = await db.query(sql, [firebase_uid]).catch((error) => {
    console.log(error);
  });
  response.send(result.rows[0]);
};
router.get('/:id', getUserByFirebaseId);

// CREATE A USER
const createUser = async (request, response) => {
  const { firebase_uid, email, username } = request.body;
  const sql = `INSERT INTO Users (firebase_uid, email, username) VALUES($1, $2, $3) RETURNING firebase_uid;`;

  const result = await db.query(sql, [firebase_uid, email, username]).catch((error) => {
    console.log(error);
  });
  response.send(result.rows[0]);
};
router.post('/', createUser);

// UPDATE A USER
const updateUser = async (request, response) => {
  const { firebase_uid, email, username } = request.body;
  const sql = `UPDATE Users SET email = $2, username = $3 WHERE firebase_uid = $1 RETURNING firebase_uid;`;

  const result = await db.query(sql, [firebase_uid, email, username]).catch((error) => {
    console.log(error);
  });
  response.send(result.rows[0]);
};
router.put('/', updateUser);

// DELETE
const deleteUser = async (request, response) => {
  const { firebase_uid } = request.body;
  const sql = `DELETE FROM Users WHERE firebase_uid = $1 RETURNING username;`;

  const result = await db.query(sql, [firebase_uid]).catch((error) => {
    console.log(error);
  });
  response.send(result.rows[0]);
};
router.delete('/', deleteUser);

export default router;
