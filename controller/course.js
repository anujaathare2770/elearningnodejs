import { instance } from "../index.js";
import TryCatch from "../middleware/TryCatch.js";
import { Courses } from "../models/courses.js";
import {Lecture} from "../models/Lecture.js";
import {User} from "../models/User.js";

export const getAllCourses = TryCatch(async(req,res)=>{
    const courses = await Courses.find()
    res.json({
        courses,
    });

});

export const getSingleCourse = TryCatch(async(req,res)=>{
    const course= await Courses.findById(req.params.id)

    res.json({
        course,
    });
});

export const fetchLectures = TryCatch(async (req, res) => {
    const lectures = await Lecture.find({ course: req.params.id });
    const user = await User.findById(req.user._id); // Ensure 'await' here.

    if (!user) {
        return res.status(404).json({ message: "User not found." });
    }

    if (user.role === "admin") {
        return res.json({ lectures });
    }

    // Check if subscription exists and includes the course ID
    if (!user.subscription || !Array.isArray(user.subscription) || !user.subscription.includes(req.params.id)) {
        return res.status(400).json({
            message: "You have not subscribed to this course",
        });
    }

    res.json({ lectures });
});

import mongoose from 'mongoose';

export const fetchLecture = TryCatch(async (req, res) => {
    const { id } = req.params;

    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid lecture ID" });
    }

    const lecture = await Lecture.findById(id);

    if (!lecture) {
        return res.status(404).json({ message: "Lecture not found" });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    if (user.role === "admin") {
        return res.json({ lecture });
    }

    if (!user.subscription || !Array.isArray(user.subscription) || !user.subscription.includes(id)) {
        return res.status(400).json({
            message: "You have not subscribed to this course",
        });
    }

    res.json({ lecture });
});

export const getMyCourses =TryCatch(async(req,res)=>{
    const courses =await Courses.find({_id: req.user.subscription})

    res.json({
        courses,
    });
});

export const checkout = TryCatch(async(req,res)=>{
    const user = await User.findById(req.user._id)

    const course = await Courses.findById(req.params.id)

    if(user.subscription.includes(course._id)){
        return res.status(400).json({
            message: "You already have this course",
        })
    }

    const options = {
        amount: Number(course.price * 100),
        currency: "INR",
    };

    const order = await instance.orders.create(options);

    res.status(201).json({
        order,
        course,
    });
});

export const paymentVerification = TryCatch(async(req,res)=>{
    const {}= req.body
})