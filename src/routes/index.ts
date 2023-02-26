import { Router } from 'express';
import userRoutes from './api/userRoutes';
import adminRoute from './api/adminRoute';

const router: Router = Router();

router.use('/users', userRoutes);
router.use('/admin', adminRoute);
export default router;
