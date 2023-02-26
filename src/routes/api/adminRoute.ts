import { Router } from 'express';
import createAdminUser from '../../controllers/adminController';
import { authAdmin } from '../../utiles/authenticateAdmin';

const routes: Router = Router();

routes.post('/', createAdminUser);
routes.post('/login', authAdmin);

export default routes;
