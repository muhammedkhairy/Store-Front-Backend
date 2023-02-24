import { Router } from 'express';
import userRoutes from './api/userRoutes';

const router: Router = Router();

router.use('/users', userRoutes);

export default router;
