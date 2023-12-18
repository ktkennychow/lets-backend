import exercises from './exercises.js';
import records from './records.js';
import users from './users.js';

const mountRoutes = (app) => {
  app.use('/exercises', exercises);
  app.use('/records', records);
  app.use('/users', users);
};

export default mountRoutes;
