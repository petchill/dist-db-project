import { Router } from 'express';
import jwt from 'jsonwebtoken';

const router = new Router();

router.use(async (req, res, next) => {
  const req_auth = req.headers['authorization'];
  console.log('//////////// this is auth : ', req_auth)
  if (!req_auth) {
    console.log("/////////////// auth is undefined");
    next();
  } else {
    try {
      const jwt_secret = process.env.JWT_SECRET
      const jwt_token = req_auth.split(' ')[1];
      const data_token = await jwt.verify(jwt_token, jwt_secret)
      req.user_token = data_token;
      next();
    } catch (err) {
      console.error('access token is error', err);
      next();
    }
  }
});

export default router;
