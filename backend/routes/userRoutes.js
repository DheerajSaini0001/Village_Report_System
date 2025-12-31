const express = require('express');
const router = express.Router();
const {
    registerUser,
    loginUser,
    getMe,
    sendLoginOtp,
    verifyLoginOtp,
    sendRegisterOtp,
    registerUserWithOtp
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', registerUser);
router.post('/register-otp', sendRegisterOtp);
router.post('/register-verify', registerUserWithOtp);
router.post('/login', loginUser);
router.post('/login-otp', sendLoginOtp);
router.post('/verify-otp', verifyLoginOtp);
router.get('/me', protect, getMe);

module.exports = router;
