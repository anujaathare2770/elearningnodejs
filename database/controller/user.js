import { User } from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import sendMail from "../middleware/sendMail.js";
import TryCatch from '../middleware/TryCatch.js';

export const register = TryCatch(async (req,res) => {
    const { email, name, password } = req.body;

    let user = await User.findOne({ email });
    if (user) {
        return res.status(400).json({ message: "User already exists" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    user = new User({ name, email, password: hashPassword });
    await user.save();

    const otp = Math.floor(Math.random() * 1000000);

    const activationToken = jwt.sign(
        { id: user._id, otp },
        process.env.Activation_Secret,
        { expiresIn: "5m" }
    );

    const data = { name, otp };

    await sendMail(email, "E-learning", data);

    res.status(200).json({
        message: "otp sent to your email",
        activationToken,
    });
});



export const verifyUser = TryCatch(async(req, res)=>{
    const {otp, activationToken}= req.body;
    const verify = jwt.verify(activationToken, process.env.Activation_Secret)

    if(!verify)
        return res.status(400).json({
          message:"otp Expired",
    
        });
    if(verify.otp !== otp) 
        return res.status(400).json({
            message:"Wrong otp",
          });
    await User.create({
        name: verify.user.name,
        email: verify.user.email,
        password: verify.user.password
        });
    res.json({
        message:"User Register"
    })
});