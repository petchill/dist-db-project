import { Router } from 'express';
import { replies_model } from '../../models'
import Joi from '@hapi/joi';
Joi.objectId = require('joi-objectid')(Joi);

const router = new Router();

const joi_option = { abortEarly: true };
const roomSchema = Joi.object().keys({
  owner_id: Joi.objectId().required(),
  comment_id: Joi.objectId().required(),
  reply_describe: Joi.string()
});

router.get('/', (req, res) => {
  try {
    const data = replies_model.find({});
    console.log(data);
  } catch (error) {
    console.error('Error from mongoDB : ', error);
    res.status(400);
    res.json({ ok: false, status: 400, error: error });
  }
  res.status(200);
  res.json({ ok: true, status: 200, data: data });
});

router.post('/', async (req, res) => {
  const req_body = req.body;
  const { value: data, error: validated_error } = roomSchema.validate( req_body, joi_option);
  if( validated_error ){
    res.status(400);
    res.json( { ok: false, status: 400, error: validated_error });
  }
  try {
    const response = await replies_model.create(data);
    res.status(200);
    res.json({ ok: true, status: 200, data: response });
  } catch(error) {
    console.error(error)
    res.status(400);
    res.json( { ok: false, status: 400, error: error });
  }
});

export default router;
