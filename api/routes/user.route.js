import express from 'express';
import { test, updateUserInfo, deleteUser, getUserListing, getLandlordUser } from '../controllers/user.controller.js'
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.get('/test', test);
router.post('/update/:id', verifyToken, updateUserInfo);
router.delete('/delete/:id', verifyToken, deleteUser);
router.get('/listings/:id', verifyToken, getUserListing);
router.get('/contact/:id', verifyToken, getLandlordUser);
export default router; 