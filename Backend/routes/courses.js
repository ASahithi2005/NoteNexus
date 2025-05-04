import express from 'express';
import Course from '../Models/Course.js';
import auth from '../middleware/auth.js';
import Mentor from '../Models/Mentor.js';
import Student from '../Models/student.js';

const router = express.Router();

// Create a course (mentor only)
router.post('/create', auth, async (req, res) => {
  try {
    if (req.user.role !== 'mentor') return res.status(403).json({ msg: 'Unauthorized' });

    const { title, description } = req.body;
    const course = new Course({
      title,
      description,
      createdBy: req.user.id
    });

    await course.save();

    // Add course to mentor's createdCourses
    await Mentor.findByIdAndUpdate(req.user.id, { $push: { createdCourses: course._id } });

    res.status(201).json(course);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Join a course (student only)
router.post('/join/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'student') return res.status(403).json({ msg: 'Unauthorized' });

    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ msg: 'Course not found' });

    course.studentsEnrolled.push(req.user.id);
    await course.save();

    await Student.findByIdAndUpdate(req.user.id, { $push: { joinedCourses: course._id } });

    res.json({ msg: 'Joined course successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all available courses
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find().populate('createdBy', 'name email');
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
