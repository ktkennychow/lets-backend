import express from 'express';
import cors from 'cors';
import mountRoutes from './routes/index.js';

const app = express();
app.use(express.json());

app.use(cors());

mountRoutes(app);

const port = process.env.PORT || 8000;

app.listen(port, function () {
  console.log('App listening on port: ' + port);
});

const healthCheck = (request, response) => {
  response.send(`
  <h1>OK</h1>`);
};

// Health checking route
app.get('/health', healthCheck);

// app.get('/records', db.getRecords);

// app.post('/createRecord', db.createExercise);
