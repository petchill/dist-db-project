import { Router } from 'express';
import { rooms_model, users_model } from '../../models'
import Joi from '@hapi/joi';
import { Promise } from "bluebird";
import _ from 'lodash';
Joi.objectId = require('joi-objectid')(Joi)

const router = new Router();

const joi_option = { abortEarly: true };
const roomSchema = Joi.object().keys({
  owner_id: Joi.objectId().required(),
  owner_name: Joi.string().required(),
  room_topic: Joi.string().required(),
  room_describe: Joi.string(),
  room_tags: Joi.array().items(Joi.string())
});

// GET all data
router.get('/', async (req, res) => {
  try {
    const data = await rooms_model.find({}).sort({ createdAt: -1 });
    console.log(data);
    res.status(200);
    res.json({ ok: true, status: 200, data: data });
  } catch (error) {
    console.error('Error from mongoDB : ', error);
    res.status(400);
    res.json({ ok: false, status: 400, error: error });
  }
});

// GET BY query
router.post('/search', async (req, res) => {
  const req_body = req.body;
  console.log('///////this is req search: ', req_body)
  try {
    const data = await rooms_model.find(req_body);
    res.status(200);
    res.json({ ok: true, status: 200, data: data })
  } catch (error) {
    console.error(error);
    res.status(200);
    res.json({ ok: false, status: 400, error: error });
  }
})

// GET BY ID
router.get('/:id', async (req, res) => {
  try {
    const data = await rooms_model.findById(req.params.id);
    res.status(200);
    res.json({ ok: true, status: 200, data: data })
  } catch (error) {
    console.error(error);
    res.status(400);
    res.json({ ok: false, status: 400, error: error });
  }
});

POST ( createRoom )
router.post('/', async (req, res) => {
  const req_body = req.body;
  const { value: data, error: validated_error } = roomSchema.validate(req_body, joi_option);
  if (validated_error) {
    res.status(400);
    res.json({ ok: false, status: 400, error: validated_error });
  }
  try {
    const { room_tag: roomTags, ...payload_data } = data;
    let response = await rooms_model.create(payload_data);
    const roomId = response._id;
    const userUpdateRoom = await users_model.findByIdAndUpdate(payload_data.owner_id, {
      $push: {
        room_id: roomId
      }
    })
    res.status(200);
    res.json({ ok: true, status: 200, data: response });
  } catch (error) {
    console.error(error)
    res.status(400);
    res.json({ ok: false, status: 400, error: error });
  }
});

export default router;
