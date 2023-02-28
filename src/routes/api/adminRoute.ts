import { Router, Request, Response } from 'express';
import createAdminUser from '../../controllers/adminController';
import { authAdmin } from '../../utils/authenticateAdmin';

const routes: Router = Router();

routes.post('/', createAdminUser);
routes.post('/login', authAdmin);

export default routes;
