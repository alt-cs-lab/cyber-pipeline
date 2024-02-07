// Load Libraries
const express = require('express')
const router = express.Router()

// Load Middleware
var token = require('../middlewares/token')
const requestLogger = require('../middlewares/request-logger')

// Load Routers
const usersRouter = require('./api/users')
const profileRouter = require('./api/profile')
const roleRouter = require('./api/roles')
const districtRouter = require('./api/districts')
const teacherRouter = require('./api/teachers')

// Load Token Middleware
router.use(token)

// Configure Logging (after token)
router.use(requestLogger)

router.use('/users', usersRouter)
router.use('/profile', profileRouter)
router.use('/roles', roleRouter)
router.use('/districts', districtRouter)
router.use('/teachers', teacherRouter)

/* GET API Version and User Details */
router.get('/', function (req, res, next) {
  res.json({
    version: 1.0,
    user_id: req.user_id,
    is_admin: req.is_admin ? 1 : 0,
  })
})

module.exports = router
