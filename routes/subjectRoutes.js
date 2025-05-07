const express = require('express');
const { getSubjects, createSubject, addChapter, deleteChapter, deleteSubject } = require('../controllers/subjectController');
const { protect, adminOnly } = require('../middlewares/auth');

const router = express.Router();

router.route('/')
  .get(getSubjects)
  .post(protect, adminOnly, createSubject);

router.route('/:subjectId/chapters')
  .post(protect, adminOnly, addChapter);

router.route('/:subjectId/chapters/:chapterId')
  .delete(protect, adminOnly, deleteChapter);

router.route('/:subjectId')
  .delete(protect, adminOnly, deleteSubject);

module.exports = router;
