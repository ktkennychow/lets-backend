import { Router } from 'express';
import * as db from '../db/index.js';

const router = new Router();

// READ ALL
const getAllExercises = async (request, response) => {
  const sql = `SELECT * FROM Exercises;`;

  const result = await db.query(sql).catch((error) => {
    console.log(error);
  });
  response.send(result.rows);
};
router.get('/', getAllExercises);

// READ
const getExercise = async (request, response) => {
  const { id } = request.params;
  const sql = `SELECT * FROM Exercises WHERE id = $1;`;

  const result = await db.query(sql, [id]).catch((error) => {
    console.log(error);
  });
  response.send(result.rows[0]);
};
router.get('/:id', getExercise);

// CREATE
const createExercise = async (request, response) => {
  const { name, note } = request.body;
  const sql = `INSERT INTO Exercises (name, note) VALUES($1, $2) RETURNING id;`;

  const result = await db.query(sql, [name, note]).catch((error) => {
    console.log(error);
  });
  response.send(result.rows[0]);
};
router.post('/', createExercise);

// UPDATE
const updateExercise = async (request, response) => {
  const { id } = request.params;
  const { name, note } = request.body;
  const sql = `UPDATE Exercises SET name = $1, note = $2 WHERE id = $3 RETURNING id;`;

  const result = await db.query(sql, [name, note, id]).catch((error) => {
    console.log(error);
  });
  response.send(result.rows[0]);
};
router.put('/:id', updateExercise);

// DELETE
const deleteExercise = async (request, response) => {
  const { id } = request.params;
  const sql = `DELETE FROM Exercises WHERE id = $1 RETURNING name;`;

  const result = await db.query(sql, [id]).catch((error) => {
    console.log(error);
  });
  response.send(result.rows[0]);
};
router.delete('/:id', deleteExercise);

export default router;
