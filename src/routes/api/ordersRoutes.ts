import { Router } from 'express';
import ordersControllers from '../../controllers/ordersControllers';
import verifyToken from '../../middleware/authMiddleware';

const routes: Router = Router();

routes.post('/', verifyToken, ordersControllers.addOrder);
routes.get('/users/:id', verifyToken, ordersControllers.getOrdersByUser);
routes.get('/products/:id', verifyToken, ordersControllers.getOrdersByProduct);
routes.patch('/:id', verifyToken, ordersControllers.updateOrder);
routes.delete('/:id', verifyToken, ordersControllers.deleteOrder);

export default routes;