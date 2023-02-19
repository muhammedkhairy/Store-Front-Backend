import express from 'express';
import * as dotenv from 'dotenv';
import dbConnect from './database';
dotenv.config();

const app: express.Application = express();
const port = process.env.NODE_PORT || 3000;

//test route
app.get('/', (req: express.Request, res: express.Response) => {
  res.send(`<h1>Hello World!</h1>`);
});

//express server
app.listen(port, () => {
  console.log(`🚀 Server is listening on http://localhost:${port}`);
  dbConnect();
});

export default app;
