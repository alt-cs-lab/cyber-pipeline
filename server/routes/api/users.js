/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Users API
 */

// Load Libraries
import express from 'express';
import adminOnly from '../../middlewares/admin-only.js'; // Ensure you include .js extension
import User from '../../models/user.js'; // Ensure you include .js extension

const router = express.Router();

// Require Admin Role on All Routes
router.use(adminOnly);

/**
 * @swagger
 * /api/v1/users:
 *   get:
 *     summary: <admin> list all the users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: the list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
router.get('/', async (req, res, next) => {
  let users = await User.query()
    .select('users.id', 'users.eid', 'users.name')
    .withGraphFetched('roles');
  res.json(users);
});

/**
 * @swagger
 * /api/v1/users/{id}:
 *   post:
 *     summary: <admin> update user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: user ID
 *     requestBody:
 *       description: user
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *           example:
 *             name: Test Administrator
 *             roles:
 *               - id: 1
 *     responses:
 *       200:
 *         $ref: '#/components/responses/Success'
 *       422:
 *         $ref: '#/components/responses/UpdateError'
 */
router.post('/:id', async (req, res, next) => {
  try {
    // strip out other data from roles
    const roles = req.body.user.roles.map(({ id, ...next }) => {
      return {
        id: id,
      };
    });
    await User.query().upsertGraph(
      {
        id: req.params.id,
        name: req.body.user.name,
        roles: roles,
      },
      {
        relate: true,
        unrelate: true,
      }
    );
    res.status(200).json({ message: 'User Saved' });
  } catch (error) {
    res.status(422).json(error);
  }
});

/**
 * @swagger
 * /api/v1/users:
 *   put:
 *     summary: <admin> create user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: user
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *           example:
 *             eid: test-admin
 *             name: Test Administrator
 *             roles:
 *               - id: 1
 *     responses:
 *       201:
 *         description: success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       422:
 *         $ref: '#/components/responses/UpdateError'
 */
router.put('/', async (req, res, next) => {
  try {
    // strip out other data from roles
    const roles = req.body.user.roles.map(({ id, ...next }) => {
      return {
        id: id,
      };
    });
    await User.query().upsertGraph(
      {
        eid: req.body.user.eid,
        name: req.body.user.name,
        roles: roles,
      },
      {
        relate: true,
        unrelate: true,
      }
    );
    res.status(200).json({ message: 'User Saved' });
  } catch (error) {
    res.status(422).json(error);
  }
});

/**
 * @swagger
 * /api/v1/users/{id}:
 *   delete:
 *     summary: <admin> delete user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: user ID
 *     responses:
 *       200:
 *         $ref: '#/components/responses/Success'
 *       422:
 *         $ref: '#/components/responses/UpdateError'
 */
router.delete('/:id', async (req, res, next) => {
  if (req.params.id == req.user_id) {
    res.status(422).json({ error: 'Cannot Delete Yourself' });
  } else {
    try {
      const deleted = await User.query().deleteById(req.params.id);
      if (deleted === 1) {
        res.status(200).json({ message: 'User Deleted' });
      } else {
        res.status(422).json({ error: 'User Not Found' });
      }
    } catch (error) {
      res.status(422).json(error);
    }
  }
});

export default router;
