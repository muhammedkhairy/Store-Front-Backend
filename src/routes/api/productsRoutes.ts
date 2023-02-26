import { Router } from 'express';
import productControllers from '../../controllers/productsControllers';
import verifyToken from '../../middleware/authMiddleware';

const routes: Router = Router();

routes.post('/', verifyToken, productControllers.create);
routes.get('/', productControllers.index);
routes.get('/:id', productControllers.show);
routes.patch('/:id', verifyToken, productControllers.update);
routes.delete('/:id', verifyToken, productControllers.deleteProduct);

export default routes;
