import { Router } from 'express';
import { rooms_model, tags_model, comments_model } from '../../models'
import Joi from '@hapi/joi';
import {Promise} from "bluebird";
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

async function addTag(room_id, tagName) {
  try {
    const response = await tags_model.findOneAndUpdate(
      { tag_name: tagName },
      {
        $push: {
          room_id: room_id
        }
      }
    );
    if (!response) {
      const response = await tags_model.create({
        tag_name: tagName,
        room_id: [room_id]
      });
      return response._id;
    }
    return response._id;
  } catch (error) {
    console.error('add tag Error!', error);
  }
}

// GET
router.get('/', async (req, res) => {
  try {
    const data = await rooms_model.find({}).sort({createdAt:-1});
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
    const data = await rooms_model.findById(req.params.id);
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
  const { value: data, error: validated_error } = roomSchema.validate(req_body, joi_option);
  if (validated_error) {
    res.status(400);
    res.json({ ok: false, status: 400, error: validated_error });
  }
  try {
    const { room_tag: roomTags, ...payload_data } = data;
    let response = await rooms_model.create(payload_data);
    const roomId = response._id;
    if (roomTags) {
      const tagList = await Promise.map(roomTags, async (curr_tag) => {
        const curr_tag_id = await addTag(roomId, curr_tag);
        console.log('/////////////this is curr_tag_id', curr_tag_id);
        return curr_tag_id;
      })
      console.log('///////tagList : ', tagList);
      response = await rooms_model.findOneAndUpdate(
        { '_id': roomId },
        {
          $push: {
            room_tag_id: tagList
          }
        }
      );
    }
    res.status(200);
    res.json({ ok: true, status: 200, data: response });
  } catch (error) {
    console.error(error)
    res.status(400);
    res.json({ ok: false, status: 400, error: error });
  }
});

export default router;
