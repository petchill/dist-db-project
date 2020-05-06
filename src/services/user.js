import { Router } from 'express';
import { users_model } from '../../models'
import Joi from '@hapi/joi';
import jwt from 'jsonwebtoken';
require('dotenv').config()
Joi.objectId = require('joi-objectid')(Joi);

const router = new Router();

const joi_option = { abortEarly: true };
const createUserSchema = Joi.object().keys({
  username: Joi.string().required(),
  password: Joi.string().required()
})

async function isDupicateUsername(username) {
  try {
    const foundUser = await users_model.findOne({ username: username });
    if (foundUser) {
      return true;
    }
    else return false;
  } catch (error) {
    throw new Error('check dupicate user Error!');
  }
}

//GET
router.get('/', async (req, res) => {
  try {
    const data = await users_model.find({});
    console.log(data);
    res.status(200);
    res.json({ ok: true, status: 200, data: data });
  } catch (error) {
    console.error('Error from mongoDB : ', error);
    res.status(400);
    res.json({ ok: false, status: 400, error: error });
  }
});

//GET BY ID
router.get('/:id', async (req, res) => {
  const user_id = req.params.id;
  try {
    const data = await users_model.findById(user_id);
    console.log(data);
    res.status(200);
    res.json({ ok: true, status: 200, data: data });
  } catch (error) {
    console.error('Error from mongoDB : ', error);
    res.status(400);
    res.json({ ok: false, status: 400, error: error });
  }
});

//POST
router.post('/register', async (req, res) => {
  const req_body = req.body;
  console.log('////// this is req Body : ', req_body);
  const { value: data, error: validated_error } = createUserSchema.validate(req_body, joi_option);
  console.log('this is data : ', data);
  if (validated_error) {
    console.error(error);
    res.status(400);
    res.json({ ok: false, status: 400, error: validated_error });
  }
  // if (await isDupicateUsername(data.username)) {
  //   res.status(400);
  //   res.json({ ok: false, status: 400, error: 'User name has been already used!' })
  // } else {
    try {
      const response = await users_model.create(data);
      res.status(200);
      res.json({ ok: true, status: 200, data: response });
    } catch (error) {
      console.error(error.code);
      res.json({ ok: false, status: 400, error: error });
      res.status(400);
    }
  // }
});

//POST LOGIN
router.post('/login', async (req, res) => {
  const user_token = req.user_token;
  console.log('////////////db ', process.env.MONGODB)
  console.log('////////////// this is user_token : ', user_token);
  if (user_token) {
    res.status(400);
    res.json({ ok: false, status: 400, error: 'user has been already login' });
    throw new Error('users has been already login');
  }
  const req_body = req.body;
  const { value: data, error: validated_error } = createUserSchema.validate(req_body, joi_option);
  if (validated_error) {
    console.error(validated_error);
    res.status(400);
    res.json({ ok: false, status: 400, error: validated_error });
    throw new Error('users validated error');
  }
  // check have user in DB
  const { username, password } = data;
  try {
    const user_data = await users_model.findOne({ username: username });
    if (user_data.password === password) {
      //gen token
      console.log('//////this is user data', user_data);
      const user_id = user_data._id
      const token_secret = process.env.JWT_SECRET;
      console.log('///////// this is secret', token_secret, process.env.JWT_ALGORITHM);
      const token_payload = { username: username };
      const token_options = { expiresIn: "1h" };
      const access_token = await jwt.sign(token_payload, token_secret, token_options);
      console.log('this is access token : ', access_token);
      res.status(200)
      res.json({ ok: true, status: 200, data: { user_id, username: username, access_token: access_token } });
    }
    else {
      res.status(400);
      res.json({ ok: false, status: 200, error: 'Your username or password is wrong' });
      throw new Error('Your username or password is wrong');
    }
  } catch (err) {
    console.error(err);
    res.status(400);
    res.json({ ok: false, status: 200, error: 'login error', err });
  }
});

export default router;
