import express from 'express';
import adminController from '../controllers/adminController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import adminMiddleware from '../middlewares/adminMiddleware.js';
const router = express.Router();

router.get('/home', authMiddleware, adminMiddleware, adminController.adminHome);
router.get('/dashboard-stats', authMiddleware, adminMiddleware, adminController.getDashboardStats);
router.get('/orders', authMiddleware, adminMiddleware, adminController.getAllOrders);
router.get('/orders/:orderId', authMiddleware, adminMiddleware, adminController.getSingleOrder);
router.get('/customers', authMiddleware, adminMiddleware, adminController.getAllCustomers);
router.get('/user-orders/:userId', authMiddleware, adminMiddleware, adminController.getUserOrders);
router.put('/orders/:orderId/status', authMiddleware, adminMiddleware, adminController.updateOrderStatus);
router.get('/products', authMiddleware, adminMiddleware, adminController.getAllProducts);
router.post('/products', authMiddleware, adminMiddleware, adminController.addProduct);

export default router;