/**
 * @swagger
 * tags:
 *   name: API
 *   description: API
 * components:
 *   responses:
 *     UpdateError:
 *       description: error accepting submitted data
 *     Success:
 *       description: success
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 */

// Import required libraries
import express from 'express';

// Import middleware
import token from './middlewares/token.js';
import { dbAudit } from './middlewares/db-audit.js';
import requestLogger from './middlewares/request-logger.js';

// Import the main router
import apiRouter from './routes/index.js'; // Adjust path accordingly

// Create an instance of the Express application
const app = express();

app.use(express.json());
app.use(token);
app.use(dbAudit);
app.use(requestLogger);
app.use('/api/v1/users', apiRouter);
app.use('/api/v1/profile', apiRouter);
app.use('/api/v1/roles', apiRouter);
app.use('/api/v1/districts', apiRouter);
app.use('/api/v1/teachers', apiRouter);
app.use('/api/v1/cohorts', apiRouter);
app.use('/api/v1/courses', apiRouter);
app.use('/api/v1/dashboard', apiRouter);

// Define a route for API version and user info
app.get('/', (req, res) => {
  res.json({
    version: 1.0,
    user_id: req.user_id,
    is_admin: req.is_admin ? 1 : 0,
  });
});

// Export the app instance
export default app;
