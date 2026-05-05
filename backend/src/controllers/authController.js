import UserModel from '../models/UserModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// user controller
const registerUser = async (req,res)=>{
    try {
        const existingUser = await UserModel.find({ email: req.body.email });
        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        // Build user data with optional address
        const userData = {
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        };

        // Add phone if provided
        if (req.body.phone) {
            userData.phone = req.body.phone;
        }

        // If address provided during registration, add to addresses array
        if (req.body.address && req.body.pincode) {
            userData.addresses = [{
                address: req.body.address,
                pincode: req.body.pincode
            }];
        }

        const user = new UserModel(userData);
        await user.save();
        const token = jwt.sign(
            { _id: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );
        res.cookie('token', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            path: '/',
            maxAge: 604800000 // 7 days
        });
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            addresses: user.addresses || []
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const loginUser = async (req,res)=>{
    try {
        const user = await UserModel.findOne({ email: req.body.email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        
        let isPasswordValid;
        try {
            isPasswordValid = await bcrypt.compare(req.body.password, user.password);
        } catch (error) {
            // Fallback for plain text passwords (existing users before bcrypt)
            isPasswordValid = req.body.password === user.password;
        }
        
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        
        const token = jwt.sign(
            { _id: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );
        
        res.cookie('token', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            path: '/',
            maxAge: 604800000 // 7 days
        });
        
        res.status(200).json({
            message: 'Login successful',
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const logoutUser = (req,res)=>{
    res.clearCookie('token');
    res.status(200).json({ message: 'Logout successful' });
}

// admin controller
const registerAdmin = async (req,res)=>{
    try {
        const { adminSecret } = req.body;
        
        if (adminSecret !== process.env.ADMIN_SECRET) {
            return res.status(403).json({ message: 'Invalid admin secret key' });
        }
        
        const existingUser = await UserModel.find({ email: req.body.email });
        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }
        
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = new UserModel({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
            role: 'admin'
        });
        
        await user.save();
        
        const token = jwt.sign(
            { _id: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );
        
        res.cookie('token', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            path: '/',
            maxAge: 604800000
        });
        
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const loginAdmin = async (req,res)=>{
    try {
        const { adminSecret } = req.body;
        
        if (adminSecret !== process.env.ADMIN_SECRET) {
            return res.status(403).json({ message: 'Invalid admin secret key' });
        }
        
        const user = await UserModel.findOne({ email: req.body.email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        
        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        
        const token = jwt.sign(
            { _id: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );
        
        res.cookie('token', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            path: '/',
            maxAge: 604800000
        });
        
        res.status(200).json({
            message: 'Login successful',
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const logoutAdmin = (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ message: 'Logout successful' });
}




export default {
    registerUser,
    loginUser,
    logoutUser,
    registerAdmin,
    loginAdmin,
    logoutAdmin
}