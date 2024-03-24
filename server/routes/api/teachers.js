/**
 * @swagger
 * tags:
 *   name: Teachers
 *   description: Teachers API
 */

// Load Libraries
const express = require('express')
const router = express.Router()

// Load Middleware
const adminOnly = require('../../middlewares/admin-only')

// Load Models
const Teacher = require('../../models/teacher')

/**
 * @swagger
 * /api/v1/teachers:
 *   get:
 *     summary: <admin> list all the teachers
 *     tags: [Teachers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: the list of teachers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Teacher'
 */
router.get('/', async function (req, res, next) {
  let teachers = await Teacher.query()
    .select(
      'teachers.id',
      'teachers.name',
      'teachers.email',
      'teachers.eid',
      'teachers.wid',
      'teachers.district_id',
      'teachers.status',
      'teachers.pd_status',
      'teachers.cert_status',
      'teachers.ms_status'
    )
    .withGraphJoined('districts')
    .modifyGraph('districts', (builder) => {
      builder.select('districts.id', 'districts.usd', 'districts.name')
    })
  res.json(teachers)
})

/**
 * @swagger
 * /api/v1/teachers:
 *   put:
 *     summary: <admin> create teacher
 *     tags: [Teachers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: teacher
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 255
 *                 description: the teacher's name
 *               email:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 255
 *                 format: email
 *                 description: the teacher's email address
 *               eid:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 20
 *                 description: K-State eID of the teacher
 *               wid:
 *                 type: string
 *                 minLength: 9
 *                 maxLength: 9
 *                 description: the K-State Wildcat ID of the teacher
 *               district_id:
 *                 type: integer
 *                 description: id of primary district for the teacher
 *               districts:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: autogenerated id
 *             example:
 *               name: Test Teacher
 *               email: test@distrct.com
 *               eid: test-teacher
 *               wid: "000000000"
 *               district_id: 1
 *               districts:
 *                 - id: 1
 *     responses:
 *       200:
 *         $ref: '#/components/responses/Success'
 *       422:
 *         $ref: '#/components/responses/UpdateError'
 */
router.put('/', adminOnly, async function (req, res, next) {
  try {
    // strip out other data from districts
    const districts = req.body.teacher.districts.map(({ id, ...next }) => {
      return {
        id: id,
      }
    })
    await Teacher.query().upsertGraph(
      {
        name: req.body.teacher.name,
        email: req.body.teacher.email,
        eid: req.body.teacher.eid,
        wid: req.body.teacher.wid,
        district_id: req.body.teacher.district_id,
        districts: districts,
      },
      {
        relate: true,
        unrelate: true,
      }
    )
    res.status(200)
    res.json({ message: 'Teacher Saved' })
  } catch (error) {
    res.status(422)
    res.json(error)
  }
})

/**
 * @swagger
 * /api/v1/teachers/{id}:
 *   post:
 *     summary: <admin> update teacher
 *     tags: [Teachers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: teacher ID
 *     requestBody:
 *       description: teacher
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 description: autogenerated id
 *               name:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 255
 *                 description: the teacher's name
 *               email:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 255
 *                 format: email
 *                 description: the teacher's email address
 *               eid:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 20
 *                 description: K-State eID of the teacher
 *               wid:
 *                 type: string
 *                 minLength: 9
 *                 maxLength: 9
 *                 description: the K-State Wildcat ID of the teacher
 *               district_id:
 *                 type: integer
 *                 description: id of primary district for the teacher
 *               districts:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: autogenerated id
 *             example:
 *               id: 1
 *               name: Test Teacher
 *               email: test@distrct.com
 *               eid: test-teacher
 *               wid: "000000000"
 *               district_id: 1
 *               districts:
 *                 - id: 1
 *     responses:
 *       200:
 *         $ref: '#/components/responses/Success'
 *       422:
 *         $ref: '#/components/responses/UpdateError'
 */
router.post('/:id', adminOnly, async function (req, res, next) {
  try {
    // strip out other data from districts
    const districts = req.body.teacher.districts.map(({ id, ...next }) => {
      return {
        id: id,
      }
    })
    await Teacher.query().upsertGraph(
      {
        id: req.params.id,
        name: req.body.teacher.name,
        email: req.body.teacher.email,
        eid: req.body.teacher.eid,
        wid: req.body.teacher.wid,
        district_id: req.body.teacher.district_id,
        districts: districts,
      },
      {
        relate: true,
        unrelate: true,
      }
    )
    res.status(200)
    res.json({ message: 'Teacher Saved' })
  } catch (error) {
    res.status(422)
    res.json(error)
  }
})

/**
 * @swagger
 * /api/v1/teachers/{id}:
 *   delete:
 *     summary: <admin> delete teacher
 *     tags: [Teachers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: teacher ID
 *     responses:
 *       200:
 *         $ref: '#/components/responses/Success'
 *       422:
 *         $ref: '#/components/responses/UpdateError'
 */
router.delete('/:id', adminOnly, async function (req, res, next) {
  try {
    var deleted = await Teacher.query().deleteById(req.params.id)
    if (deleted === 1) {
      res.status(200)
      res.json({ message: 'Teacher Deleted' })
    } else {
      res.status(422)
      res.json({ error: 'Teacher Not Found' })
    }
  } catch (error) {
    res.status(422)
    res.json(error)
  }
})

module.exports = router
