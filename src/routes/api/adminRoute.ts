import { Router } from 'express';
import createAdminUser from '../../controllers/adminController';

const routes: Router = Router();

routes.post('/', createAdminUser);

export default routes;
