/**
 * @swagger
 * tags:
 *   name: Districts
 *   description: Districts API
 */

// Load Libraries
import express from 'express';
import adminOnly from '../../middlewares/admin-only.js'; // Ensure you include .js extension
import District from '../../models/district.js'; // Ensure you include .js extension

const router = express.Router();

/**
 * @swagger
 * /api/v1/districts:
 *   get:
 *     summary: <admin> list all the districts
 *     tags: [Districts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: the list of districts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/District'
 */
router.get('/', async (req, res, next) => {
  let districts = await District.query().select(
    'districts.id',
    'districts.name',
    'districts.usd',
    'districts.url',
    'districts.locale',
    'districts.notes',
    District.relatedQuery('teachers_raw').count().as('teachers')
  );
  res.json(districts);
});

/**
 * @swagger
 * /api/v1/districts:
 *   put:
 *     summary: <admin> create district
 *     tags: [Districts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: district
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Teacher'
 *           example:
 *             name: School District
 *             usd: 123
 *             url: https://www.usd123.local/
 *             locale: 13
 *             notes: This is a test district
 *     responses:
 *       200:
 *         $ref: '#/components/responses/Success'
 *       422:
 *         $ref: '#/components/responses/UpdateError'
 */
router.put('/', adminOnly, async (req, res, next) => {
  try {
    await District.query().upsertGraph({
      name: req.body.district.name,
      url: req.body.district.url,
      usd: req.body.district.usd,
      notes: req.body.district.notes,
      locale: req.body.district.locale,
    }, {
      relate: true,
      unrelate: true,
    });
    res.status(200).json({ message: 'District Saved' });
  } catch (error) {
    res.status(422).json(error);
  }
});

/**
 * @swagger
 * /api/v1/districts/{id}:
 *   post:
 *     summary: <admin> update district
 *     tags: [Districts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: district ID
 *     requestBody:
 *       description: district
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Teacher'
 *           example:
 *             id: 1
 *             name: School District
 *             usd: 123
 *             url: https://www.usd123.local/
 *             locale: 13
 *             notes: This is a test district
 *     responses:
 *       200:
 *         $ref: '#/components/responses/Success'
 *       422:
 *         $ref: '#/components/responses/UpdateError'
 */
router.post('/:id', adminOnly, async (req, res, next) => {
  try {
    await District.query().upsertGraph({
      id: req.params.id,
      name: req.body.district.name,
      url: req.body.district.url,
      usd: req.body.district.usd,
      locale: req.body.district.locale,
      notes: req.body.district.notes,
    }, {
      relate: true,
      unrelate: true,
    });
    res.status(200).json({ message: 'District Saved' });
  } catch (error) {
    res.status(422).json(error);
  }
});

/**
 * @swagger
 * /api/v1/districts/{id}:
 *   delete:
 *     summary: <admin> delete district
 *     tags: [Districts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: district ID
 *     responses:
 *       200:
 *         $ref: '#/components/responses/Success'
 *       422:
 *         $ref: '#/components/responses/UpdateError'
 */
router.delete('/:id', adminOnly, async (req, res, next) => {
  try {
    const deleted = await District.query().deleteById(req.params.id);
    if (deleted === 1) {
      res.status(200).json({ message: 'District Deleted' });
    } else {
      res.status(422).json({ error: 'District Not Found' });
    }
  } catch (error) {
    res.status(422).json(error);
  }
});

export default router;
