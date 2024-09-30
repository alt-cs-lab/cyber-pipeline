/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication API
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   responses:
 *     UnauthorizedError:
 *       description: JWT is missing or invalid
 */

// Load Libraries
//const express = require('express')
//const router = express.Router()
//const jwt = require('jsonwebtoken')
import express from 'express'
const router = express.Router()
import jwt from 'jsonwebtoken'

// Load Configurations
//var cas = require('../configs/cas')
//const requestLogger = require('../middlewares/request-logger')
import cas from '../configs/cas.js'
import requestLogger from '../middlewares/request-logger.js'

// Load Models
//const User = require('../models/user')
import User from '../models/user.js'

// Configure Logging
router.use(requestLogger)

/**
 * @swagger
 * /auth/login:
 *   get:
 *     summary: login
 *     description: log in the current user by redirecting to CAS or using force authentication if enabled
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       301:
 *         description: user is logged in, redirect to homepage
 */
router.get('/login', async function (req, res, next) {
  if (!req.session.user_id) {
    let eid = ''
    if (req.query.eid && process.env.FORCE_AUTH === 'true') {
      // force authentication enabled, use eID from query
      eid = req.query.eid
    } else {
      // use CAS authentication
      if (req.session[cas.session_name] === undefined) {
        // CAS is not authenticated, so redirect
        // Hack to fix redirects
        req.url = req.originalUrl
        cas.bounce_redirect(req, res, next)
        return
      } else {
        // CAS is authenticated, get eID from session
        eid = req.session[cas.session_name]
      }
    }
    if (eid && eid.length != 0) {
      // Find or Create User for eID
      let user = await User.findOrCreate(eid)
      // Store User ID in session
      req.session.user_id = user.id
      req.session.user_eid = eid
    }
  }
  // Redirect to Homepage
  res.redirect('/')
})

/**
 * @swagger
 * /auth/token:
 *   get:
 *     summary: get JWT
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: JWT for user
 *         content:
 *           application/json:
 *             schema:
 *               token:
 *                 type: string
 *                 format: JWT
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get('/token', async function (req, res, next) {
  if (req.session.user_id) {
    const token = await User.getToken(req.session.user_id)
    res.json({
      token: token,
    })
  } else {
    res.status(401)
    res.json({ error: 'No Session Established, Please Login' })
  }
})

/**
 * @swagger
 * /auth/token:
 *   post:
 *     summary: use refresh token to get new JWT
 *     tags: [Auth]
 *     requestBody:
 *       description: refresh token
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refresh_token:
 *                 type: string
 *                 format: JWT
 *     responses:
 *       200:
 *         description: JWT for user
 *         content:
 *           application/json:
 *             schema:
 *               token:
 *                 type: string
 *                 format: JWT
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.post('/token', async function (req, res, next) {
  if (req.body.refresh_token) {
    jwt.verify(
      req.body.refresh_token,
      process.env.TOKEN_SECRET,
      async (err, data) => {
        // console.log('Debugging old refresh tokens')
        // console.log(err)
        // console.log(data)
        if (err) {
          res.status(401)
          res.json({ error: 'Error Parsing Token' })
          return
        }
        if (data && data.refresh_token) {
          // If we receive a verified token, see if it is valid in the database
          const user = await User.findByRefreshToken(data.refresh_token)
          if (user != null) {
            // If it is valid, generate a new token and send
            const token = await User.getToken(user.id)
            res.json({
              token: token,
            })
          } else {
            res.status(401)
            res.json({
              error:
                'Refresh Token Not Found in Database, Session Expired, Please Login',
            })
          }
        } else {
          res.status(401)
          res.json({ error: 'Token Data Invalid, Please Login' })
        }
      }
    )
  } else {
    res.status(401)
    res.json({ error: 'Refresh Token Not Found in Request Body' })
  }
})

/**
 * @swagger
 * /auth/logout:
 *   get:
 *     summary: logout
 *     description: log out the current user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       301:
 *         description: user is logged out, redirect to home page
 */
router.get('/logout', async function (req, res, next) {
  if (req.session.user_id) {
    await User.clearRefreshToken(req.session.user_id)
  }
  if (req.session[cas.session_name]) {
    cas.logout(req, res, next)
  } else {
    req.session.destroy()
    res.redirect('/')
  }
})

export default router
//module.exports = router
