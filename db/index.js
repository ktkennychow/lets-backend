import pkg from 'pg';
const { Pool } = pkg;
const pool = new Pool();

async function createTables() {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Create Users table
    await client.query(`
      CREATE EXTENSION IF NOT EXISTS "pgcrypto";
      CREATE TABLE IF NOT EXISTS users (
        id uuid DEFAULT gen_random_uuid(),
        firebase_uid TEXT NOT NULL UNIQUE,
        email TEXT,
        username TEXT,
        PRIMARY KEY (id)
      );
    `);

    console.log('Users table created successfully');

    // Create Exercises table
    await client.query(`
      CREATE TABLE IF NOT EXISTS exercises(
        id uuid DEFAULT gen_random_uuid(),
        name TEXT NOT NULL UNIQUE,
        note TEXT,
        PRIMARY KEY (id)
      );
    `);

    console.log('Exercises table created successfully');

    // Create Records table
    // Store dateTime in unix timestamp
    await client.query(`
      CREATE TABLE IF NOT EXISTS records(
        id uuid DEFAULT gen_random_uuid(),
        user_id uuid NOT NULL,
        exercise_id uuid NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL,
        sets INT NOT NULL,
        reps INT NOT NULL,
        weight INT NOT NULL,
        PRIMARY KEY (id),
        FOREIGN KEY (exercise_id) REFERENCES exercises(id),
        FOREIGN KEY (user_id) REFERENCES users(id)
      );
    `);

    console.log('Records table created successfully');

    await client.query('COMMIT');
  } catch (error) {
    console.error('Error creating tables:', error.message);
    await client.query('ROLLBACK');
  } finally {
    client.release();
  }
}

createTables();

export const query = async (text, params) => {
  // middleware logger
  const start = Date.now();
  const response = await pool.query(text, params);
  const end = Date.now();
  const duration = end - start;
  console.log('executed query', { text, duration, rowsCount: response.rowCount });
  return response;
};

export const getClient = () => {
  return pool.connect();
};
