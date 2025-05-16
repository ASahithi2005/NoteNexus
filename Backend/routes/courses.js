// src/routes/courses.js
import express from 'express';
import Course from '../Models/Course.js';
import auth from '../middleware/auth.js';
import Mentor from '../Models/Mentor.js';
import Student from '../Models/student.js';

const router = express.Router();

// Create a course (mentor only)
router.post('/create', auth, async (req, res) => {
  try {
    if (req.user.role !== 'mentor') {
      return res.status(403).json({ msg: 'Unauthorized' });
    }

    const { title, description, color, colorName } = req.body;
    if (!title || !description || !color || !colorName) {
      return res.status(400).json({ msg: 'Missing required fields' });
    }

    // Fetch Mentor to get their name
    const mentor = await Mentor.findById(req.user.id);
    if (!mentor) {
      return res.status(404).json({ msg: 'Mentor not found' });
    }

    // Create course with mentorName and color info
    const course = new Course({
      title,
      description,
      createdBy: req.user.id,
      mentorName: mentor.name,
      color,
      colorName
    });

    await course.save();

    // Add course reference to mentor
    await Mentor.findByIdAndUpdate(req.user.id, {
      $push: { createdCourses: course._id }
    });

    // Return the full course object
    return res.status(201).json(course);
  } catch (err) {
    console.error('Create Course Error:', err);
    return res.status(500).json({ error: err.message });
  }
});

// Join a course (student only)
router.post('/join/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({ msg: 'Unauthorized' });
    }

    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ msg: 'Course not found' });
    }

    // Avoid duplicate joins
    if (!course.studentsEnrolled.includes(req.user.id)) {
      course.studentsEnrolled.push(req.user.id);
      await course.save();
      await Student.findByIdAndUpdate(req.user.id, {
        $push: { joinedCourses: course._id }
      });
    }

    return res.json({ msg: 'Joined course successfully' });
  } catch (err) {
    console.error('Join Course Error:', err);
    return res.status(500).json({ error: err.message });
  }
});

// Get all available courses
router.get('/', async (req, res) => {
  try {
    // Return all courses including the stored mentorName, color, and colorName
    const courses = await Course.find().select(
      'title description mentorName color colorName studentsEnrolled createdBy'
    );
    return res.json(courses);
  } catch (err) {
    console.error('Fetch Courses Error:', err);
    return res.status(500).json({ error: err.message });
  }
});
router.get('/:id/students', auth, async (req, res) => {
  try {
    if (req.user.role !== 'mentor') {
      return res.status(403).json({ msg: 'Unauthorized' });
    }

    const course = await Course.findById(req.params.id).populate('studentsEnrolled', 'name email');
    if (!course) {
      return res.status(404).json({ msg: 'Course not found' });
    }

    if (course.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'You are not authorized to view this course students' });
    }

    return res.json({ students: course.studentsEnrolled });
  } catch (err) {
    console.error('Fetch Enrolled Students Error:', err);
    return res.status(500).json({ error: err.message });
  }
});

export default router;
