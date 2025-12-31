const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const Otp = require('../models/otpModel');
const sendEmail = require('../utils/emailService');

// @desc    Register new user
// @route   POST /api/users
// @access  Public
// @desc    Send Registration OTP
// @route   POST /api/users/register-otp
// @access  Public
const sendRegisterOtp = async (req, res) => {
    const { email } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store OTP in OtpModel (Upsert: Update if exists, Insert if new)
    await Otp.findOneAndUpdate(
        { email },
        { otp },
        { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    try {
        await sendEmail({
            email,
            subject: 'Email Verification OTP',
            message: `Your verification OTP is: ${otp}. Valid for 5 minutes.`
        });
        res.status(200).json({ message: 'OTP sent to email' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Email could not be sent' });
    }
};

// @desc    Verify OTP & Create User
// @route   POST /api/users/register-verify
// @access  Public
const registerUserWithOtp = async (req, res) => {
    const { name, email, password, mobile, address, otp } = req.body;

    // Check OTP Record
    const otpRecord = await Otp.findOne({ email });

    if (!otpRecord) {
        return res.status(400).json({ message: 'OTP expired or invalid' });
    }

    if (otpRecord.otp === otp) {
        // OTP Connected: NOW Create the User
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            mobile,
            address,
            role: 'villager'
        });

        // Delete OTP record
        await Otp.deleteOne({ email });

        // Send Welcome Email
        try {
            await sendEmail({
                email: user.email,
                subject: 'Welcome to Village Grievance Reporting System',
                message: `Hi ${user.name},\n\nThank you for registering. You can now report issues.`
            });
        } catch (error) { }

        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id)
        });
    } else {
        res.status(400).json({ message: 'Invalid OTP' });
    }
};

// @desc    Register new user (Old Implementation - kept for fallback if needed, or removed)
// Keeping it but we will use the OTP one primarily if user asks.
const registerUser = async (req, res) => {
    // ... (existing logic)
    // We will effectively ignore this if the frontend uses the OTP flow, 
    // but let's keep it compatible.
    const { name, email, password, mobile, role, address } = req.body;

    if (!name || !email || !password || !mobile) {
        return res.status(400).json({ message: 'Please add all fields' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        mobile,
        role: role || 'villager',
        address
    });

    if (user) {
        try {
            await sendEmail({
                email: user.email,
                subject: 'Welcome',
                message: `Hi ${user.name}, Welcome!`
            });
        } catch (error) { }

        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id)
        });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
};

// @desc    Send Login OTP
// @route   POST /api/users/login-otp
// @access  Public
const sendLoginOtp = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Store raw OTP for simplicity in this prototype. In prod, hash it.
    // user.otp = await bcrypt.hash(otp, 10);
    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    try {
        await sendEmail({
            email: user.email,
            subject: 'Your Login OTP',
            message: `Your OTP for login is: ${otp}. It is valid for 10 minutes.`
        });
        res.status(200).json({ message: 'OTP sent to email' });
    } catch (error) {
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();
        res.status(500).json({ message: 'Email could not be sent' });
    }
};

// @desc    Verify OTP and Login
// @route   POST /api/users/verify-otp
// @access  Public
const verifyLoginOtp = async (req, res) => {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    if (user.otp === otp && user.otpExpires > Date.now()) {
        // Clear OTP
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id)
        });
    } else {
        res.status(400).json({ message: 'Invalid or expired OTP' });
    }
};

// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    // Check for user email
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id)
        });
    } else {
        res.status(400).json({ message: 'Invalid credentials' });
    }
};

// @desc    Get user data
// @route   GET /api/users/me
// @access  Private
const getMe = async (req, res) => {
    res.status(200).json(req.user);
};

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', {
        expiresIn: '30d',
    });
};

module.exports = {
    registerUser,
    registerUserWithOtp,
    sendRegisterOtp,
    loginUser,
    getMe,
    sendLoginOtp,
    verifyLoginOtp,
};
