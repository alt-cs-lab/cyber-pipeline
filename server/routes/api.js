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

// Load Libraries
const express = require('express')
const router = express.Router()

// Load Middleware
var token = require('../middlewares/token')
var { dbAudit } = require('../middlewares/db-audit')
const requestLogger = require('../middlewares/request-logger')

// Load Routers
const usersRouter = require('./api/users')
const profileRouter = require('./api/profile')
const roleRouter = require('./api/roles')
const districtRouter = require('./api/districts')
const teacherRouter = require('./api/teachers')
const cohortRouter = require('./api/cohorts')
const courseRouter = require('./api/courses')
const dashboardRouter = require('./api/dashboard')

// Load Token Middleware
router.use(token)

// Load DB Audit Middleware
router.use(dbAudit)

// Configure Logging (after token)
router.use(requestLogger)

router.use('/users', usersRouter)
router.use('/profile', profileRouter)
router.use('/roles', roleRouter)
router.use('/districts', districtRouter)
router.use('/teachers', teacherRouter)
router.use('/cohorts', cohortRouter)
router.use('/courses', courseRouter)
router.use('/dashboard', dashboardRouter)

/**
 * @swagger
 * /api/v1/:
 *   get:
 *     summary: list API version and user info
 *     tags: [API]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: API version and user info
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 version:
 *                   type: number
 *                   format: float
 *                 user_id:
 *                   type: integer
 *                 is_admin:
 *                   type: integer
 *             example:
 *               version: 1.0
 *               user_id: 1
 *               is_admin: 1
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get('/', function (req, res, next) {
  res.json({
    version: 1.0,
    user_id: req.user_id,
    is_admin: req.is_admin ? 1 : 0,
  })
})

export default router
//module.exports = router
