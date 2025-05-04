import express from 'express';
import multer from 'multer';
import auth from '../middleware/auth.js';
import path from 'path';
import fs from 'fs';

const router = express.Router();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = 'uploads/';
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

let notes = [];

router.post('/upload', auth, upload.single('file'), (req, res) => {
  if (req.user.role !== 'mentor') return res.status(403).json({ msg: 'Unauthorized' });

  const { courseId, title } = req.body;
  const file = req.file;

  const note = {
    id: Date.now(),
    title,
    filePath: `/uploads/${file.filename}`,
    courseId
  };
  notes.push(note);

  res.status(201).json(note);
});

router.get('/:courseId', auth, (req, res) => {
  const courseNotes = notes.filter(n => n.courseId === req.params.courseId);
  res.json(courseNotes);
});

export default router;
