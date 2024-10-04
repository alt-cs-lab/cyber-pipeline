// Load Libraries
import express from 'express';
const router = express.Router();

// Load Models
import User from '../models/user.js'; // Adjust path accordingly

// Configure Logging
// router.use(requestLogger);

/* GET home page. */
router.get('/', async (req, res, next) => {
  let data = {};
  
  if (req.session.user_id) {
    const user = await User.query().findById(req.session.user_id);

    if (!user) {
      req.session.destroy();
    } else {
      // Check if admin
      const roles = await User.relatedQuery('roles')
        .for(req.session.user_id)
        .select('name');

      data = {
        id: req.session.user_id,
        eid: user.eid,
        name: user.name,
        admin: roles.some((r) => r.name === 'admin'),
      };
    }
  }
  
  res.render('index', { data });
});

export default router;
