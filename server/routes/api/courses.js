/**
 * @swagger
 * tags:
 *   name: Courses
 *   description: Courses API
 */

// Load Libraries
import express from 'express';
const router = express.Router();

// Load Middleware
import adminOnly from '../../middlewares/admin-only.js';

// Load Models
import Course from '../../models/course.js';

/**
 * @swagger
 * /api/v1/courses:
 *   get:
 *     summary: Retrieve a list of courses
 *     tags: [Districts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: the list of courses.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Course'
 */
router.get('/', async (req, res, next) => {
  try {
    const courses = await Course.query()
      .select('courses.id', 'courses.name', 'courses.notes')
      .withGraphFetched('teachers');
    res.json(courses);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/v1/courses:
 *   put:
 *     summary: <admin> create course
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: course
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Course'
 *           example:
 *             name: CC 710 S23
 *             notes: First offering under new CC 710 heading
 *             teachers:
 *             - id: 1
 *               name: Test Teacher
 *               notes: Teacher is doing well
 *               status: 0
 *     responses:
 *       200:
 *         $ref: '#/components/responses/Success'
 *       422:
 *         $ref: '#/components/responses/UpdateError'
 */
router.put('/', adminOnly, async (req, res) => {
  try {
    const teachers = req.body.course.teachers.map(({ id, notes, status }) => ({
      id,
      notes,
      status,
    }));
    
    await Course.query().upsertGraph(
      {
        name: req.body.course.name,
        notes: req.body.course.notes,
        teachers: teachers,
      },
      {
        relate: true,
        unrelate: true,
      }
    );
    res.status(200).json({ message: 'Course Saved' });
  } catch (error) {
    res.status(422).json(error);
  }
});

/**
 * @swagger
 * /api/v1/courses:
 *   post:
 *     summary: <admin> update course
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: course ID
 *     requestBody:
 *       description: course
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Course'
 *           example:
 *             id: 1
 *             name: CC 710 S23
 *             notes: First offering under new CC 710 heading
 *             teachers:
 *             - id: 1
 *               name: Test Teacher
 *               notes: Teacher is doing well
 *               status: 0
 *     responses:
 *       200:
 *         $ref: '#/components/responses/Success'
 *       422:
 *         $ref: '#/components/responses/UpdateError'
 */
router.post('/:id', adminOnly, async (req, res) => {
  try {
    const teachers = req.body.course.teachers.map(({ id, notes, status }) => ({
      id,
      notes,
      status,
    }));
    
    await Course.query().upsertGraph(
      {
        id: req.params.id,
        name: req.body.course.name,
        notes: req.body.course.notes,
        teachers: teachers,
      },
      {
        relate: true,
        unrelate: true,
      }
    );
    res.status(200).json({ message: 'Course Saved' });
  } catch (error) {
    res.status(422).json(error);
  }
});

/**
 * @swagger
 * /api/v1/courses/{id}:
 *   delete:
 *     summary: <admin> delete course
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: course ID
 *     responses:
 *       200:
 *         $ref: '#/components/responses/Success'
 *       422:
 *         $ref: '#/components/responses/UpdateError'
 */
router.delete('/:id', adminOnly, async (req, res) => {
  try {
    const deleted = await Course.query().deleteById(req.params.id);
    if (deleted === 1) {
      res.status(200).json({ message: 'Course Deleted' });
    } else {
      res.status(422).json({ error: 'Course Not Found' });
    }
  } catch (error) {
    res.status(422).json(error);
  }
});

export default router;
