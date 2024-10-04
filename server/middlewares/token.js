// https://www.digitalocean.com/community/tutorials/nodejs-jwt-expressjs

import jwt from 'jsonwebtoken';

// Load Logger
import logger from '../configs/logger.js';

async function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.TOKEN_SECRET, async (err, user) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.sendStatus(401);
      } else {
        logger.warn('API Token Parse Error - ' + err);
        return res.sendStatus(403);
      }
    }

    req.user_id = user.user_id;
    req.user_eid = user.eid;
    req.roles = user.roles;

    next();
  });
}

export default authenticateToken;
