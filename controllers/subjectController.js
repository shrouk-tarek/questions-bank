const Subject = require('../models/Subject');
const ErrorResponse = require('../utils/errorHandler');
const Chapter = require('../models/Chapter');

// @desc    Get all subjects
// @route   GET /api/subjects
// @access  Public
exports.getSubjects = async (req, res, next) => {
  try {
    const subjects = await Subject.find();

    res.status(200).json({
      success: true,
      count: subjects.length,
      data: subjects
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create subject
// @route   POST /api/subjects
// @access  Private/Admin
exports.createSubject = async (req, res, next) => {
  try {
    const subject = await Subject.create(req.body);

    res.status(201).json({
      success: true,
      data: subject
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Add chapter to a subject
// @route   POST /api/subjects/:subjectId/chapters
// @access  Private/Admin
exports.addChapter = async (req, res, next) => {
  try {
    const { subjectId } = req.params;
    const { name } = req.body;

    const chapter = await Chapter.create({ name, subjectId });

    res.status(201).json({
      success: true,
      data: chapter,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete chapter from a subject
// @route   DELETE /api/subjects/:subjectId/chapters/:chapterId
// @access  Private/Admin
exports.deleteChapter = async (req, res, next) => {
  try {
    const { chapterId } = req.params;

    const chapter = await Chapter.findByIdAndDelete(chapterId);

    if (!chapter) {
      return res.status(404).json({
        success: false,
        error: 'Chapter not found',
      });
    }

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete a subject
// @route   DELETE /api/subjects/:subjectId
// @access  Private/Admin
exports.deleteSubject = async (req, res, next) => {
  try {
    const { subjectId } = req.params;

    const subject = await Subject.findByIdAndDelete(subjectId);

    if (!subject) {
      return res.status(404).json({
        success: false,
        error: 'Subject not found',
      });
    }

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all chapters related to a subject
// @route   GET /api/subjects/:subjectId/chapters
// @access  Public
exports.getChaptersBySubject = async (req, res, next) => {
  try {
    const { subjectId } = req.params;

    const chapters = await Chapter.find({ subjectId });

    if (!chapters || chapters.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'No chapters found for this subject',
      });
    }

    res.status(200).json({
      success: true,
      count: chapters.length,
      data: chapters,
    });
  } catch (err) {
    next(err);
  }
};
