import express, { Application, Request, Response } from 'express';
import * as dotenv from 'dotenv';
import routes from './routes/index';
import errorHandler from './middleware/errorHandler';
dotenv.config();

const app: Application = express();
const port = process.env.NODE_PORT || 3000;

app.use(express.json());

//test route
app.get('/', (req: Request, res: Response) => {
  //throw new Error();
  res.send(`<h1>Hello World!</h1>`);
});

app.use('/api', routes);

//Error handling middleware
app.use(errorHandler);

// Catch-all route handler for unknown routes
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    error: {
      code: 'NOT_FOUND',
      message: 'The requested page was not found ⚓',
    },
  });
});

//express server
app.listen(port, () => {
  console.log(`🚀 Server is listening on http://localhost:${port}`);
  //dbConnect();
});

export default app;
