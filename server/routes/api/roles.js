/**
 * @swagger
 * tags:
 *   name: Roles
 *   description: Roles API
 */

// Load Libraries
import express from 'express';
import adminOnly from '../../middlewares/admin-only.js'; // Ensure you include .js extension
import Role from '../../models/role.js'; // Ensure you include .js extension

const router = express.Router();

// Require Admin Role on All Routes
router.use(adminOnly);

/**
 * @swagger
 * /api/v1/roles:
 *   get:
 *     summary: <admin> list all the roles
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: the list of roles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Role'
 */
router.get('/', async (req, res, next) => {
  let roles = await Role.query().select('id', 'name');
  res.json(roles);
});

export default router;
