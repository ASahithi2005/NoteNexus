import express from 'express';
import auth from '../middleware/auth.js';
import Course from '../Models/Course.js';
import multer from 'multer';
import fs from 'fs';
import path from 'path';

const router = express.Router();

// Multer storage config (unchanged)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let dest = 'uploads/';
    const section = req.params.section;

    if (section === 'assignments') {
      dest += req.user.role === 'mentor'
        ? 'assignments/questions'
        : 'assignments/answers';
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

    const isMentor = req.user.role === 'mentor'
      && course.createdBy.toString() === req.user.id;
    const isStudent = req.user.role === 'student'
      && course.studentsEnrolled.some(s => s.toString() === req.user.id);

    if (!isMentor && !isStudent) {
      return res.status(403).json({ msg: 'Access denied' });
    }

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
      return res.status(400).json({
        msg: 'Invalid section. Must be syllabus, notes, or assignments.',
      });
    }

    const course = await Course.findById(id);
    if (!course) return res.status(404).json({ msg: 'Course not found' });

    const isMentor = req.user.role === 'mentor'
      && course.createdBy.toString() === req.user.id;
    const isStudent = req.user.role === 'student'
      && course.studentsEnrolled.some(s => s.toString() === req.user.id);

    if ((section === 'syllabus' || section === 'notes') && !isMentor) {
      return res.status(403).json({
        msg: 'Only mentors can upload syllabus or notes.',
      });
    }
    if (section === 'assignments' && !isMentor && !isStudent) {
      return res.status(403).json({
        msg: 'Only enrolled students or mentor can upload assignments.',
      });
    }
    if (!req.file) {
      return res.status(400).json({ msg: 'No file uploaded' });
    }

    const fileType = section === 'assignments'
      ? (isMentor ? 'question' : 'answer')
      : 'file';

    course[section] = course[section] || [];
    course[section].push({
      title: req.body.title || req.file.originalname,
      fileUrl: req.file.path.replace(/\\/g, '/'),
      uploadedBy: req.user.id,
      uploadedByModel: req.user.role === 'mentor' ? 'Mentor' : 'Student',
      role: req.user.role,
      type: fileType,
      uploadedAt: new Date(),
    });

    await course.save();

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

    if (!description) {
      return res.status(400).json({ msg: 'Description is required' });
    }

    const course = await Course.findById(id);
    if (!course) return res.status(404).json({ msg: 'Course not found' });

    if (!(req.user.role === 'mentor'
      && course.createdBy.toString() === req.user.id)) {
      return res.status(403).json({
        msg: 'Only the mentor can update description',
      });
    }

    course.description = description;
    await course.save();

    return res.status(200).json(course);
  } catch (err) {
    console.error('Update Description Error:', err);
    return res.status(500).json({ error: 'Server error. Please try again.' });
  }
});

/**
 * DELETE /api/courseDetail/:id/:section/:index
 * Mentor deletes a file entry from syllabus, notes, or assignments
 */
router.delete('/:id/:section/:index', auth, async (req, res) => {
  try {
    const { id, section, index } = req.params;
    if (!['syllabus', 'notes', 'assignments'].includes(section)) {
      return res.status(400).json({ msg: 'Invalid section.' });
    }

    const course = await Course.findById(id);
    if (!course) return res.status(404).json({ msg: 'Course not found' });

    const idx = parseInt(index, 10);
    if (isNaN(idx) || idx < 0 || idx >= course[section].length) {
      return res.status(400).json({ msg: 'Invalid index.' });
    }

    const fileEntry = course[section][idx];

    // Check access permissions
    const isMentor = req.user.role === 'mentor' && course.createdBy.toString() === req.user.id;
    const isStudentOwner = req.user.role === 'student' && fileEntry.uploadedBy.toString() === req.user.id;

    // Only mentor can delete syllabus and notes
    if ((section === 'syllabus' || section === 'notes') && !isMentor) {
      return res.status(403).json({ msg: 'Only mentors can delete syllabus or notes.' });
    }

    // For assignments, mentor or student (who uploaded it) can delete
    if (section === 'assignments' && !isMentor && !isStudentOwner) {
      return res.status(403).json({ msg: 'Only mentors or the student who uploaded can delete this assignment.' });
    }

    // Attempt to delete the physical file
    if (fileEntry && fileEntry.fileUrl) {
      const fsPath = path.resolve(fileEntry.fileUrl);
      fs.unlink(fsPath, err => {
        if (err) console.warn('Could not delete file:', fsPath, err);
      });
    }

    // Remove entry from course
    course[section].splice(idx, 1);
    await course.save();

    const updatedCourse = await Course.findById(id)
      .populate('syllabus.uploadedBy', 'name')
      .populate('notes.uploadedBy', 'name')
      .populate('assignments.uploadedBy', 'name');

    return res.status(200).json(updatedCourse);
  } catch (err) {
    console.error('Delete File Error:', err);
    return res.status(500).json({ error: 'Server error. Please try again.' });
  }
});


export default router;
