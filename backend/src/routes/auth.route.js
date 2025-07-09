import express from 'express';
import { login, logout, signup, updateProfile ,checkAuth } from '../controllers/auth.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/signup',signup)   //? /api/auth/signup
router.post('/login',login)     //? /api/auth/login
router.post('/logout',logout)   //? /api/auth/logout

router.put('/update-profile',protectRoute,updateProfile);

router.get('/check',protectRoute,checkAuth); //? check if the user is authenticated or not means if the user is logged in or not
//? this is a protected route that will be used to check if the user is logged in or not

export default router;