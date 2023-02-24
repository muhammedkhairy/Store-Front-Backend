import { Router } from 'express';
import userControllers from '../../controllers/userControllers';

const routes: Router = Router();

routes.post('/', userControllers.create);
routes.get('/', userControllers.index);
routes.get('/:id', userControllers.show);
routes.patch('/:id', userControllers.update);
routes.delete('/:id', userControllers.deleteUser);

export default routes;
