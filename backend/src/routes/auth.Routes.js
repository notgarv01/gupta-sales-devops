import express from 'express';
const router = express.Router();
import authController from '../controllers/authController.js';

router.post('/user/register', authController.registerUser);
router.post('/user/login', authController.loginUser);
router.get('/user/logout', authController.logoutUser);

router.post('/admin/register', authController.registerAdmin);
router.post('/admin/login',authController.loginAdmin)
router.get('/admin/logout',authController.logoutAdmin)

export default router;