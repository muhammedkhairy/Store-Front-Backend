import { Router } from 'express';
import productControllers from '../../controllers/productsControllers';
import verifyToken from '../../middleware/authMiddleware';

const routes: Router = Router();

routes.post('/', verifyToken, productControllers.create);
routes.get('/', productControllers.index);
routes.get('/:id', productControllers.show);
routes.patch('/:id', productControllers.update);
routes.delete('/:id', productControllers.deleteProduct);

export default routes;
