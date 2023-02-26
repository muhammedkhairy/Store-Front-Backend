import { Router } from 'express';
import adminRoute from './api/adminRoute';
import userRoutes from './api/userRoutes';
import productRoutes from './api/productsRoutes';
import ordersRoutes from './api/ordersRoutes';

const router: Router = Router();


router.use('/admin', adminRoute);
router.use('/users', userRoutes);
router.use('/products', productRoutes);
router.use('/orders', ordersRoutes);
export default router;
