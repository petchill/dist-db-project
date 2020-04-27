import { Router } from 'express';
import { tags_model } from '../../models'

const router = new Router();

//GET
router.get('/', async (req, res) => {
  try {
    const data = await tags_model.find({});
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
    const data = await tags_model.findById(user_id);
    console.log(data);
    res.status(200);
    res.json({ ok: true, status: 200, data: data });
  } catch (error) {
    console.error('Error from mongoDB : ', error);
    res.status(400);
    res.json({ ok: false, status: 400, error: error });
  }
});

export default router;