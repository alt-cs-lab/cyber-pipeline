/**
 * @swagger
 * tags:
 *   name: Roles
 *   description: Roles API
 */

// Load Libraries
const express = require('express')
const router = express.Router()

// Load Middleware
const adminOnly = require('../../middlewares/admin-only')

// Load Models
const Role = require('../../models/role')

// Require Admin Role on All Routes
router.use(adminOnly)

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
router.get('/', async function (req, res, next) {
  let roles = await Role.query().select('id', 'name')
  res.json(roles)
})

module.exports = router
