import { Router } from 'express';
import homeRouter from './home';
import roomRouter from './room';
import userRouter from './user';
import commentRouter from './comment';
import replyRouter from './reply';
import middleware from "../../middleware"
import tagRouter from './tag'

const serviceRouter = new Router();

serviceRouter.use(middleware);

serviceRouter.use('/', homeRouter);
serviceRouter.use('/room', roomRouter);
serviceRouter.use('/user', userRouter);
serviceRouter.use('/comment', commentRouter);
serviceRouter.use('/reply', replyRouter);
serviceRouter.use('/tag', tagRouter);

export default serviceRouter;
