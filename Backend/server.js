import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';
import authRouter from './Routes/authRouter.js';
import './Models/db.js';
import quizRouter from './Routes/quizRouter.js';

dotenv.config();

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

app.use("/auth", authRouter);
app.use("/Quiz", quizRouter);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
