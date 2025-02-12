import { User } from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import sendMail from "../middleware/sendMail.js";
import TryCatch from '../middleware/TryCatch.js';

export const register = TryCatch(async (req, res) => {
    const { email, name, password } = req.body;

    let user = await User.findOne({ email });
    if (user) {
        return res.status(400).json({ message: "User already exists" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    user = new User({ name, email, password: hashPassword });
    try {
        await user.save();
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: "User with this email already exists" });
        }
        throw error;
    }

    const otp = Math.floor(100000 + Math.random() * 900000); // Generates a 6-digit OTP

    const activationToken = jwt.sign(
        { user, otp },
        process.env.Activation_Secret,
        { expiresIn: "5m" }
    );

    const data = { name, otp };

    await sendMail(email, "E-learning", data);

    res.status(200).json({
        message: "OTP sent to your email",
        activationToken,
    });
});

export const verifyUser = TryCatch(async (req, res) => {
    const { otp, activationToken } = req.body;

    // Verify the activation token
    let verify;
    try {
        verify = jwt.verify(activationToken, process.env.Activation_Secret);
    } catch (error) {
        return res.status(400).json({
            message: "OTP expired or invalid",
        });
    }

    // Check if the OTP matches
    if (verify.otp !== otp) {
        return res.status(400).json({
            message: "Wrong OTP",
        });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email: verify.user.email });
    if (existingUser) {
        return res.status(200).json({
            message: "User already registered",
        });
    }

    // Create a new user if not exists
    await User.create({
        name: verify.user.name,
        email: verify.user.email,
        password: verify.user.password,
    });

    res.status(201).json({
        message: "User registered successfully",
    });
});

export const loginUser = TryCatch(async(req,res) =>{
    const {email, password} =req.body;

    const user= await User.findOne({email});

    if(!user)
        return res.status(400).json({
          message:"No user with this email",
        });

    const mathPassword = await bcrypt.compare(password,user.password);

    if(!mathPassword)
        return res.status(400).json({
           message:"wrong password",
        });

    const token = jwt.sign({_id: user._id}, process.env.Jwt_Sec,{
        expiresIn: "15d",
    });

    res.json({
        message:`Welcome back ${user.name}`,
        token,
        user,
    });
});

export const myProfile =TryCatch(async(req, res)=>{
    const user = await User.findById(req.user._id)

    res.json({user});
})