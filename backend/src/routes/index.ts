import { Router } from 'express';
import authRoutes from './auth.routes';
import academicRoutes from './academic.routes';
import studentRoutes from './student.routes';
import swapRoutes from './swap.routes';
import facultyRoutes from './faculty.routes';
import adminRoutes from './admin.routes';
import notificationRoutes from './notification.routes';

const router = Router();

// Health Check Endpoint (Phase 0)
router.get('/health', (_req, res) => {
  return res.status(200).json({
    status: 'ok',
    service: 'ClassSwap API',
  });
});

// Primary route mounts (/api/...)
router.use('/auth', authRoutes);
router.use('/', academicRoutes);
router.use('/students', studentRoutes);
router.use('/swaps', swapRoutes);
router.use('/faculty', facultyRoutes);
router.use('/admin', adminRoutes);
router.use('/notifications', notificationRoutes);

export default router;
