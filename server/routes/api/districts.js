// Load Libraries
const express = require('express')
const router = express.Router()

// Load Middleware
const adminOnly = require('../../middlewares/admin-only')

// Load Models
const District = require('../../models/district')

/* Get List of Districts */
router.get('/', async function (req, res, next) {
  let districts = await District.query()
    .select('districts.id', 'districts.name', 'districts.usd', 'districts.url')
    .withGraphJoined('teachers')
    .modifyGraph('teachers', (builder) => {
      builder.select('teachers.id', 'teachers.name')
    })
  res.json(districts)
})

/* New District */
router.post('/', adminOnly, async function (req, res, next) {
  try {
    // strip out other data from teachers
    const teachers = req.body.district.teachers.map(({ id, ...next }) => {
      return {
        id: id,
      }
    })
    await District.query().upsertGraph(
      {
        name: req.body.district.name,
        url: req.body.district.url,
        usd: req.body.district.usd,
        teachers: teachers,
      },
      {
        relate: true,
        unrelate: true,
      }
    )
    res.status(200)
    res.json({ message: 'District Saved' })
  } catch (error) {
    res.status(422)
    res.json(error)
  }
})

router.post('/:id', adminOnly, async function (req, res, next) {
  try {
    // strip out other data from teachers
    const teachers = req.body.district.teachers.map(({ id, ...next }) => {
      return {
        id: id,
      }
    })
    await District.query().upsertGraph(
      {
        id: req.params.id,
        name: req.body.district.name,
        url: req.body.district.url,
        usd: req.body.district.usd,
        teachers: teachers,
      },
      {
        relate: true,
        unrelate: true,
      }
    )
    res.status(200)
    res.json({ message: 'District Saved' })
  } catch (error) {
    res.status(422)
    res.json(error)
  }
})

/* Delete Single District */
router.delete('/:id', adminOnly, async function (req, res, next) {
  try {
    var deleted = await District.query().deleteById(req.params.id)
    if (deleted === 1) {
      res.status(200)
      res.json({ message: 'District Deleted' })
    } else {
      res.status(422)
      res.json({ error: 'District Not Found' })
    }
  } catch (error) {
    res.status(422)
    res.json(error)
  }
})

module.exports = router
