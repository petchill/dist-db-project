import express from 'express';
import cors from 'cors';
import serviceRouter from './services';
import mongoose from 'mongoose';
require('dotenv').config()

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use("/", serviceRouter);

mongoose.connect(process.env.MONGODB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});

console.log('this is port : ', process.env.PORT);
const port = process.env.PORT || 3300;
app.listen(port, () => {
  console.log('app is listen on port: ', port);
})
