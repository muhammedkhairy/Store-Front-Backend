import { Router } from 'express';
import createAdminUser from '../../controllers/adminController';
import { authAdmin } from '../../services/authenticateAdmin';

const routes: Router = Router();

routes.post('/', createAdminUser);
routes.post('/login', authAdmin);

export default routes;
