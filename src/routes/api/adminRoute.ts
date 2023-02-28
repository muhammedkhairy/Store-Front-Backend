import { Router, Request, Response } from 'express';
import createAdminUser from '../../controllers/adminController';
import { authAdmin } from '../../utils/authenticateAdmin';

const routes: Router = Router();

routes.get('/', (_req: Request, res: Response) => {
  console.log('Received request on GET / route');
  res.status(200).send('Welcome to the admin page');
});
routes.post('/', createAdminUser);
routes.post('/login', authAdmin);

export default routes;
