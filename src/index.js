import express from 'express';
import cors from 'cors';
import serviceRouter from './services'

const app = express();

app.use(cors());

app.use(express.urlencoded({extended: true}));

app.use("/", serviceRouter);

const port = process.env.PORT || 3200;
app.listen(port, () => {
  console.log('app is listen on port: ', port);
})
