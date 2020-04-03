import { Router } from 'express';
import { users_model } from '../../models'
import Joi from '@hapi/joi';
Joi.objectId = require('joi-objectid')(Joi)

const router = new Router();

const joi_option = { abortEarly: true };
const createUserSchema = Joi.object().keys({
  username: Joi.string().required(),
  password: Joi.string().required()
})

async function isDupicateUsername(username) {
  try {
    const foundUser = await users_model.findOne({ username: username });
    if (foundUser){ 
      return true;}
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
router.post('/', async (req, res) => {
  const req_body = req.body;
  console.log('////// this is req Body : ', req_body);
  const { value: data, error: validated_error } = createUserSchema.validate(req_body, joi_option);
  console.log('this is data : ', data);
  if (validated_error) {
    console.error(error);
    res.status(400);
    res.json({ ok: false, status: 400, error: validated_error });
  }
  if (await isDupicateUsername(data.username)) {
    res.status(400);
    res.json({ ok: false, status: 400, error: 'User name has been already used!' })
  } else {
    try {
      const response = await users_model.create(data);
      res.status(200);
      res.json({ ok: true, status: 200, data: response });
    } catch (error) {
      console.error(error);
      res.status(400);
      res.json({ ok: false, status: 400, error: error });
    }
  }
  
});

export default router;
