import { Router } from 'express';
import homeRouter from './home'

const serviceRouter = new Router();

serviceRouter.use('/', homeRouter);

export default serviceRouter;
