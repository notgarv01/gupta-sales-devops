import express from 'express';
const router = express.Router();
import userController from '../controllers/userController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

router.get('/profile', authMiddleware, userController.getUserProfile);
router.get('/products', userController.getAllProducts);
router.get('/orders', authMiddleware, userController.getUserOrders);
router.post('/cart', authMiddleware, userController.addToCart);
router.get('/cart', authMiddleware, userController.getCart);
router.put('/cart', authMiddleware, userController.updateCart);
router.delete('/cart/:productId', authMiddleware, userController.removeFromCart);
router.post('/address', authMiddleware, userController.addAddress);
router.put('/address', authMiddleware, userController.updateAddress);
router.post('/order', authMiddleware, userController.createOrder);
router.delete('/delete-account', authMiddleware, userController.deleteAccount);
router.put('/orders/:orderId/cancel', authMiddleware, userController.cancelOrder);

export default router;