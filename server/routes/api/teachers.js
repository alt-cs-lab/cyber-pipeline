// Load Libraries
const express = require('express')
const router = express.Router()

// Load Middleware
const adminOnly = require('../../middlewares/admin-only')

// Load Models
const Teacher = require('../../models/teacher')

/* Get List of Teachers */
router.get('/', async function (req, res, next) {
  let teachers = await Teacher.query()
    .select(
      'teachers.id',
      'teachers.name',
      'teachers.email',
      'teachers.eid',
      'teachers.wid'
    )
    .withGraphJoined('districts')
    .modifyGraph('districts', (builder) => {
      builder.select('districts.id', 'districts.usd', 'districts.name')
    })
    res.json(teachers)
})

router.post('/:id', adminOnly, async function (req, res, next) {
  try {
    // strip out other data from districts
    const teachers = req.body.teacher.districts.map(({ id, ...next }) => {
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

/* Delete Single District */
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