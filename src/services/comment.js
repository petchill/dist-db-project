import { Router } from 'express';
import { comments_model, rooms_model } from '../../models'
import Joi from '@hapi/joi';
Joi.objectId = require('joi-objectid')(Joi);

const router = new Router();

const joi_option = { abortEarly: true };
const roomSchema = Joi.object().keys({
  owner_id: Joi.objectId().required(),
  owner_name: Joi.string().required(),
  room_id: Joi.objectId().required(),
  comment_describe: Joi.string().required()
});

router.get('/', async (req, res) => {
  try {
    const data = await comments_model.find({});
    console.log(data);
    res.status(200);
    res.json({ ok: true, status: 200, data: data });
  } catch (error) {
    console.error('Error from mongoDB : ', error);
    res.status(400);
    res.json({ ok: false, status: 400, error: error });
  }
});

// GET BY ID
router.get('/:id', async (req, res) => {
  try {
    const data = await comments_model.findById(req.params.id);
    res.status(200);
    res.json({ ok: true, status: 200, data: data})
  } catch (error) {
    console.error(error)
    res.status(400);
    res.json({ ok: false, status: 400, error: error });
  }
});

router.post('/', async (req, res) => {
  const req_body = req.body;
  const { value: data, error: validated_error } = roomSchema.validate( req_body, joi_option);
  if( validated_error ){
    res.status(400);
    res.json( { ok: false, status: 400, error: validated_error });
  }
  try {
    const response = await comments_model.create(data);
    const { _id: comment_id, room_id } =  response;
    const roomUpdateComment = await rooms_model.findByIdAndUpdate( room_id, {
      $push: {
        room_comments: comment_id
      }
    })
    console.log('this update comment : ', roomUpdateComment);
    res.status(200);
    res.json({ ok: true, status: 200, data: response });
  } catch(error) {
    console.error(error)
    res.status(400);
    res.json( { ok: false, status: 400, error: error });
  }
});

export default router;
