import express from 'express';
import cors from 'cors';
import serviceRouter from './services';
import mongoose from 'mongoose';

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

const port = process.env.PORT || 3200;
app.listen(port, () => {
  console.log('app is listen on port: ', port);
})
