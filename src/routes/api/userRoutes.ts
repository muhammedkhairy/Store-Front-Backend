import { Router } from 'express';
import userControllers from '../../controllers/userControllers';
import { authUser } from '../../utils/authenticateUSers';
import verifyToken from '../../middleware/authMiddleware';

const routes: Router = Router();

routes.post('/', verifyToken, userControllers.create);
routes.get('/', verifyToken, userControllers.index);
routes.get('/:id', verifyToken, userControllers.show);
routes.patch('/:id', verifyToken, userControllers.update);
routes.delete('/:id', verifyToken, userControllers.deleteUser);
routes.post('/login', authUser);

export default routes;
