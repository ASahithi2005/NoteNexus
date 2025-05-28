import express from 'express';
import auth from '../middleware/auth.js';
import Course from '../Models/Course.js';
import multer from 'multer';
import fs from 'fs';

const router = express.Router();

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let dest = 'uploads/';
    const section = req.params.section;

    if (section === 'assignments') {
      dest += req.user.role === 'mentor' ? 'assignments/questions' : 'assignments/answers';
    } else if (section === 'notes') {
      dest += 'notes';
    } else if (section === 'syllabus') {
      dest += 'syllabus';
    } else {
      dest += 'others';
    }

    fs.mkdirSync(dest, { recursive: true });
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const safeName = file.originalname.replace(/\s+/g, '-');
    cb(null, `${timestamp}-${safeName}`);
  },
});
const upload = multer({ storage });

/**
 * GET /api/courseDetail/:id
 * Get course details with populated uploader names
 */
router.get('/:id', auth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('syllabus.uploadedBy', 'name')
      .populate('notes.uploadedBy', 'name')
      .populate('assignments.uploadedBy', 'name');

    if (!course) return res.status(404).json({ msg: 'Course not found' });

    const isMentor = req.user.role === 'mentor' && course.createdBy.toString() === req.user.id;
    const isStudent = req.user.role === 'student' && course.studentsEnrolled.some(s => s.toString() === req.user.id);

    if (!isMentor && !isStudent) return res.status(403).json({ msg: 'Access denied' });

    return res.status(200).json(course);
  } catch (err) {
    console.error('Get Course Detail Error:', err);
    return res.status(500).json({ error: 'Server error. Please try again.' });
  }
});

/**
 * POST /api/courseDetail/:id/:section
 * Upload files for syllabus, notes, assignments
 */
router.post('/:id/:section', auth, upload.single('file'), async (req, res) => {
  try {
    const { id, section } = req.params;

    if (!['syllabus', 'notes', 'assignments'].includes(section)) {
      return res.status(400).json({ msg: 'Invalid section. Must be syllabus, notes, or assignments.' });
    }

    const course = await Course.findById(id);
    if (!course) return res.status(404).json({ msg: 'Course not found' });

    const isMentor = req.user.role === 'mentor' && course.createdBy.toString() === req.user.id;
    const isStudent = req.user.role === 'student' && course.studentsEnrolled.some(s => s.toString() === req.user.id);

    if ((section === 'syllabus' || section === 'notes') && !isMentor) {
      return res.status(403).json({ msg: 'Only mentors can upload syllabus or notes.' });
    }

    if (section === 'assignments' && !isMentor && !isStudent) {
      return res.status(403).json({ msg: 'Only enrolled students or mentor can upload assignments.' });
    }

    if (!req.file) {
      return res.status(400).json({ msg: 'No file uploaded' });
    }

    // Assign file type for assignments
    const fileType = section === 'assignments' ? (isMentor ? 'question' : 'answer') : 'file';

    // Push new file entry to the course document array
    course[section] = course[section] || [];
    course[section].push({
      title: req.body.title || req.file.originalname,
      fileUrl: req.file.path.replace(/\\/g, '/'),
      uploadedBy: req.user.id,
      uploadedByModel: req.user.role === 'mentor' ? 'Mentor' : 'Student', // IMPORTANT: Must match schema enum
      role: req.user.role,
      type: fileType,
      uploadedAt: new Date(),
    });

    await course.save();

    // Return updated course with populated fields
    const updatedCourse = await Course.findById(id)
      .populate('syllabus.uploadedBy', 'name')
      .populate('notes.uploadedBy', 'name')
      .populate('assignments.uploadedBy', 'name');

    return res.status(200).json(updatedCourse);
  } catch (err) {
    console.error('File Upload Error:', err);
    return res.status(500).json({ error: 'Server error. Please try again.' });
  }
});

/**
 * PUT /api/courseDetail/:id/description
 * Mentor updates course description
 */
router.put('/:id/description', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { description } = req.body;

    if (!description) return res.status(400).json({ msg: 'Description is required' });

    const course = await Course.findById(id);
    if (!course) return res.status(404).json({ msg: 'Course not found' });

    if (!(req.user.role === 'mentor' && course.createdBy.toString() === req.user.id)) {
      return res.status(403).json({ msg: 'Only the mentor can update description' });
    }

    course.description = description;
    await course.save();

    return res.status(200).json(course);
  } catch (err) {
    console.error('Update Description Error:', err);
    return res.status(500).json({ error: 'Server error. Please try again.' });
  }
});

export default router;
