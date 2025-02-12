import express from 'express';
import { getAllCourses, getSingleCourse, fetchLectures, fetchLecture } from '../controller/course.js';
import { isAuth } from '../middleware/isAuth.js';

const router = express.Router();

router.get('/course/all', getAllCourses);
router.get('/course/:id', getSingleCourse);
router.get('/lectures/:id',isAuth,fetchLectures);
router.get('/lecture/:id',isAuth,fetchLecture);


export default router;