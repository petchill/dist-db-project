import { Router } from 'express';
import Joi from '@hapi/joi';
Joi.objectId = require('joi-objectid')(Joi);

const router = new Router();

// POST
router.post('/', (req, res) => {
  
})
