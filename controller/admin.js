import TryCatch from "../middleware/TryCatch.js";
import { Courses } from "../models/courses.js";
import { Lecture } from "../models/Lecture.js";
import fs from "fs";
import { promisify } from "util";
import {User} from "../models/User.js";

export const createCourse = async (req, res) => {
    try {
        const { title, description, category, createdBy, duration, price } = req.body;

        if (!req.file) {
            return res.status(400).json({ message: "Image file is required" });
        }

        // Save the relative path of the uploaded file
        const filePath = `uploads/${req.file.filename}`;

        await Courses.create({
            title,
            description,
            category,
            createdBy,
            image: filePath,
            duration,
            price,
        });

        res.status(201).json({ message: "Course created successfully" });
    } catch (error) {
        console.error("Error creating course:", error.message);
        res.status(500).json({ message: "Server error" });
    }
};

export const addLectures = TryCatch(async(req,res)=>{
    const course =await Courses.findById(req.params.id);

    if(!course)
        return res.status(404).json({
          message:"No course with this id"    
        });

    const {title,description} = req.body

    const file = req.file

    const lecture = await Lecture.create({
        title,
        description,
        video: file?.path,
        course: course._id,
    });

    res.status(201).json({
        message:"Lecture Added",
        lecture,
    });
});

export const deleteLecture =TryCatch(async (req,res) => {
    const lecture = await Lecture.findById(req.params.id);
    if (!lecture) {
        return res.status(404).json({ message: "Lecture not found" });
    }
    if (lecture.video) {
        fs.rm(lecture.video, (err) => {
            if (err) {
                console.error("Error deleting video:", err.message);
                return res.status(500).json({ message: "Error deleting video file" });
            }
            console.log("Video deleted");
        });
    }
    await lecture.deleteOne();

    res.json({message:"Lecture Deleted"});
});

const unlinkAsync = promisify(fs.unlink)


export const deleteCourse = TryCatch(async (req,res) => {
    const course =await Courses.findById(req.params.id);

    const lectures =await Lecture.find({course: course._id})

    await Promise.all(
        lectures.map(async(lecture)=>{
          await unlinkAsync(lecture.video);
          console.log("video deleted");
        })
    );
    fs.rm(course.image, (err) => {
        if (err) {
            console.error("Error deleting video:", err.message);
            return res.status(500).json({ message: "Error deleting video file" });
        }
        console.log("image deleted");
    });

    await Lecture.find({course: req.params.id}).deleteMany()

    await course.deleteOne()

    await User.updateMany({},{$pull:{subscription:req.params.id}});

    res.json({
        message:"Course Deleted",
    });
});

export const getAllStats = TryCatch(async (req,res) => {
    const totalCoures =(await Courses.find()).length;
    const totalLectures =(await Lecture.find()).length;
    const totalUsers =(await User.find()).length;

    const stats={
        totalCoures,
        totalLectures,
        totalUsers,
    };
    res.json({
        stats,
    });
});