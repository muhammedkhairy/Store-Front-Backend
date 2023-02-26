import { Router } from 'express';
import orderProductController from '../../controllers/orderProductController';
import verifyToken from '../../middleware/authMiddleware';

const routes: Router = Router();

routes.post('/', verifyToken, orderProductController.postOrderProduct);
routes.get('/:id', verifyToken, orderProductController.getOrderProduct);
routes.patch('/:id', verifyToken, orderProductController.patchOrderProduct);
routes.delete('/:id', verifyToken, orderProductController.deleteOrderProductById);

export default routes;