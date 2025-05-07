const mongoose = require('mongoose');
const Question = require('../models/Question');
const Subject = require('../models/Subject'); // Import Subject model
const cloudinary = require('cloudinary').v2; // Import Cloudinary
const ErrorResponse = require('../utils/errorHandler');

// @desc    Get all questions
// @route   GET /api/questions
// @access  Private
const getQuestions = async (req, res, next) => {
  try {
    const reqQuery = { ...req.query };
    const removeFields = ['select', 'sort', 'status', 'limit']; // Include 'limit' in fields to remove
    removeFields.forEach(param => delete reqQuery[param]);

    // Store the limit parameter separately
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : 25; // Default to 25
    if (isNaN(limit) || limit <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid limit parameter. It must be a positive number.',
      });
    }
    console.log('Stored Limit:', limit); // Debugging log

    // Fetch all questions from the database
    let questions = await Question.find(reqQuery);

    // Handle status filtering
    if (req.query.status) {
      const answers = await StudentAnswer.find({ studentId: req.user.id });

      if (req.query.status === 'wrong') {
        const wrongAnswers = answers.filter(answer => !answer.isCorrect);
        const wrongQuestionIds = new Set(wrongAnswers.map(answer => answer.questionId.toString()));
        questions = questions.filter(question => wrongQuestionIds.has(question._id.toString()));
      } else if (req.query.status === 'not answered') {
        const answeredQuestionIds = new Set(answers.map(answer => answer.questionId.toString()));
        questions = questions.filter(question => !answeredQuestionIds.has(question._id.toString()));
      }
    }

    // Apply the stored limit manually
    const limitedQuestions = questions.slice(0, limit);

    res.status(200).json({
      success: true,
      count: limitedQuestions.length,
      data: limitedQuestions
    });
  } catch (err) {
    console.error('Error in getQuestions:', err); // Debugging log
    next(err);
  }
};

// @desc    Get single question
// @route   GET /api/questions/:id
// @access  Private
const getQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid question ID format'
      });
    }

    const question = await Question.findById(id);

    if (!question) {
      return res.status(404).json({
        success: false,
        error: `Question not found with id of ${id}`
      });
    }

    // Don't send correct answer to student
    if (req.user.role !== 'admin') {
      question.correctAnswer = undefined;
      question.modelAnswer = undefined;
    }

    res.status(200).json({
      success: true,
      data: question
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message || 'Server Error'
    });
  }
};

// @desc    Create new question with image
// @route   POST /api/questions
// @access  Private/Admin
const createQuestion = async (req, res, next) => {
  try {
    const { questionText, type, options, correctAnswer, modelAnswer, points, chapter, subjectId, level } = req.body;

    // Validate required fields
    if (!subjectId) {
      return res.status(400).json({
        success: false,
        error: 'Subject ID is required',
      });
    }

    if (!level) {
      return res.status(400).json({
        success: false,
        error: 'Difficulty level is required',
      });
    }

    // Validate that the chapter belongs to the subject
    const subject = await Subject.findById(subjectId);
    if (!subject) {
      return res.status(404).json({
        success: false,
        error: 'Subject not found',
      });
    }

    const chapterExists = await mongoose.model('Chapter').findOne({ name: chapter, subjectId });
    if (!chapterExists) {
      return res.status(400).json({
        success: false,
        error: `Chapter "${chapter}" does not belong to the subject "${subject.name}"`,
      });
    }

    const questionData = {
      questionText,
      type,
      options,
      correctAnswer,
      modelAnswer,
      points,
      chapter,
      subjectId,
      level,
    };

    // Upload image to Cloudinary if provided
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'questions',
        resource_type: 'image',
      });
      questionData.image = result.secure_url; // Save the Cloudinary URL
    }

    const question = await Question.create(questionData);

    res.status(201).json({
      success: true,
      data: question,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete question
// @route   DELETE /api/questions/:id
// @access  Private/Admin
const deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({
        success: false,
        error: `Question not found with id of ${req.params.id}`
      });
    }

    await Question.deleteOne({ _id: req.params.id }); // Use deleteOne instead of remove

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message || 'Server Error'
    });
  }
};

module.exports = {
  getQuestions,
  getQuestion,
  createQuestion,
  deleteQuestion,
};
