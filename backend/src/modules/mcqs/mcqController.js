const MCQ = require('./MCQ');
const UserMCQAttempt = require('./UserMCQAttempt');
const Certificate = require('../certificates/Certificate');
const User = require('../auth/User');
const Course = require('../courses/Course');

// Get MCQs by category with filters
exports.getMCQs = async (req, res) => {
  try {
    const { 
      category, 
      difficulty, 
      skill, 
      course, 
      topic,
      interviewLevel,
      codeLevel,
      limit = 20,
      page = 1
    } = req.query;

    const filter = { isActive: true };
    
    if (category) filter.category = category;
    if (difficulty) filter.difficulty = difficulty;
    if (skill) filter.skill = { $regex: skill, $options: 'i' };
    if (course) filter.course = course;
    if (topic) filter.topic = topic;
    if (interviewLevel) filter.interviewLevel = interviewLevel;
    if (codeLevel) filter.codeLevel = codeLevel;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const mcqs = await MCQ.find(filter)
      .select('-correctAnswer -options.isCorrect -options.explanation -explanation')
      .populate('course', 'title slug')
      .populate('topic', 'title slug')
      .populate('technology', 'name slug')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await MCQ.countDocuments(filter);

    res.json({
      mcqs,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / parseInt(limit)),
        count: total
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch MCQs', error: error.message });
  }
};

// Get single MCQ for attempt
exports.getMCQ = async (req, res) => {
  try {
    const mcq = await MCQ.findById(req.params.id)
      .select('-correctAnswer -options.isCorrect -options.explanation')
      .populate('course', 'title slug')
      .populate('topic', 'title slug');

    if (!mcq) {
      return res.status(404).json({ message: 'MCQ not found' });
    }

    res.json(mcq);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch MCQ', error: error.message });
  }
};

// Submit MCQ answer
exports.submitAnswer = async (req, res) => {
  try {
    const { selectedOption, timeTaken } = req.body;
    const mcqId = req.params.id;
      const userId = req.user.id;

    const mcq = await MCQ.findById(mcqId);
    if (!mcq) {
      return res.status(404).json({ message: 'MCQ not found' });
    }

    const isCorrect = selectedOption === mcq.correctAnswer;
    const pointsEarned = isCorrect ? mcq.points : 0;

    // Get attempt count for this user-mcq
    const attemptCount = await UserMCQAttempt.countDocuments({ user: userId, mcq: mcqId });

    // Create attempt record
    const attempt = await UserMCQAttempt.create({
      user: userId,
      mcq: mcqId,
      selectedOption,
      isCorrect,
      timeTaken: timeTaken || 0,
      pointsEarned,
      attemptNumber: attemptCount + 1
    });

    // Update MCQ stats
    await MCQ.findByIdAndUpdate(mcqId, {
      $inc: {
        timesAttempted: 1,
        timesCorrect: isCorrect ? 1 : 0
      }
    });

    // Update user points if correct and first attempt
    if (isCorrect && attemptCount === 0) {
      const User = require('../auth/User');
      await User.findByIdAndUpdate(userId, {
        $inc: { totalPoints: pointsEarned }
      });
    }

    res.json({
      isCorrect,
      correctAnswer: mcq.correctAnswer,
      explanation: mcq.explanation,
      optionExplanations: mcq.options.map(o => o.explanation),
      pointsEarned: attemptCount === 0 ? pointsEarned : 0,
      attemptNumber: attemptCount + 1
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to submit answer', error: error.message });
  }
};

// Get interview MCQs by level
exports.getInterviewMCQs = async (req, res) => {
  try {
    const { level, codeLevel, company, round, limit = 20 } = req.query;

    const filter = { 
      isActive: true, 
      category: 'interview' 
    };
    
    if (level) filter.interviewLevel = level;
    if (codeLevel) filter.codeLevel = codeLevel;
    if (company) filter.company = { $regex: company, $options: 'i' };
    if (round) filter.interviewRound = round;

    const mcqs = await MCQ.find(filter)
      .select('-correctAnswer -options.isCorrect -options.explanation -explanation')
      .populate('technology', 'name slug')
      .sort({ difficulty: 1, createdAt: -1 })
      .limit(parseInt(limit));

    res.json(mcqs);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch interview MCQs', error: error.message });
  }
};

// Get skill-based MCQs
exports.getSkillMCQs = async (req, res) => {
  try {
    const { skill } = req.params;
    const { difficulty, limit = 20 } = req.query;

    const filter = { 
      isActive: true,
      $or: [
        { skill: { $regex: skill, $options: 'i' } },
        { tags: { $regex: skill, $options: 'i' } }
      ]
    };
    
    if (difficulty) filter.difficulty = difficulty;

    const mcqs = await MCQ.find(filter)
      .select('-correctAnswer -options.isCorrect -options.explanation -explanation')
      .sort({ difficulty: 1 })
      .limit(parseInt(limit));

    res.json(mcqs);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch skill MCQs', error: error.message });
  }
};

// Get user's MCQ history/progress
exports.getUserProgress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { category, skill } = req.query;

    const matchFilter = { user: userId };
    
    const attempts = await UserMCQAttempt.find(matchFilter)
      .populate({
        path: 'mcq',
        select: 'question category skill difficulty'
      })
      .sort({ createdAt: -1 })
      .limit(100);

    // Calculate stats
    const totalAttempts = attempts.length;
    const correctAttempts = attempts.filter(a => a.isCorrect).length;
    const totalPoints = attempts.reduce((sum, a) => sum + a.pointsEarned, 0);

    // Group by category
    const byCategory = {};
    attempts.forEach(a => {
      if (a.mcq) {
        const cat = a.mcq.category;
        if (!byCategory[cat]) {
          byCategory[cat] = { total: 0, correct: 0 };
        }
        byCategory[cat].total++;
        if (a.isCorrect) byCategory[cat].correct++;
      }
    });

    res.json({
      stats: {
        totalAttempts,
        correctAttempts,
        accuracy: totalAttempts > 0 ? Math.round((correctAttempts / totalAttempts) * 100) : 0,
        totalPoints
      },
      byCategory,
      recentAttempts: attempts.slice(0, 20)
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch progress', error: error.message });
  }
};

// Admin: Create MCQ
exports.createMCQ = async (req, res) => {
  try {
    const mcqData = {
      ...req.body,
      createdBy: req.user.id
    };

    const mcq = await MCQ.create(mcqData);
    res.status(201).json(mcq);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create MCQ', error: error.message });
  }
};

// Admin: Update MCQ
exports.updateMCQ = async (req, res) => {
  try {
    const updateData = { ...req.body };
    
    // Convert empty strings to null for ObjectId fields
    if (updateData.technology === '') updateData.technology = null;
    if (updateData.course === '') updateData.course = null;
    if (updateData.topic === '') updateData.topic = null;
    
    // Ensure options have isCorrect set properly based on correctAnswer
    if (updateData.options && typeof updateData.correctAnswer === 'number') {
      updateData.options = updateData.options.map((opt, idx) => ({
        ...opt,
        isCorrect: idx === updateData.correctAnswer
      }));
    }

    console.log('Updating MCQ:', req.params.id);
    console.log('Update data:', JSON.stringify(updateData, null, 2));

    const mcq = await MCQ.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!mcq) {
      return res.status(404).json({ message: 'MCQ not found' });
    }

    console.log('MCQ updated successfully:', mcq._id);
    res.json(mcq);
  } catch (error) {
    console.error('MCQ update error:', error);
    res.status(500).json({ message: 'Failed to update MCQ', error: error.message });
  }
};

// Admin: Delete MCQ
exports.deleteMCQ = async (req, res) => {
  try {
    const mcq = await MCQ.findByIdAndDelete(req.params.id);
    
    if (!mcq) {
      return res.status(404).json({ message: 'MCQ not found' });
    }

    // Delete related attempts
    await UserMCQAttempt.deleteMany({ mcq: req.params.id });

    res.json({ message: 'MCQ deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete MCQ', error: error.message });
  }
};

// Admin: Get all MCQs
exports.getAllMCQs = async (req, res) => {
  try {
    const { page = 1, limit = 20, category, difficulty } = req.query;
    const filter = {};
    
    if (category) filter.category = category;
    if (difficulty) filter.difficulty = difficulty;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const mcqs = await MCQ.find(filter)
      .populate('course', 'title')
      .populate('topic', 'title')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await MCQ.countDocuments(filter);

    res.json({
      mcqs,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / parseInt(limit)),
        count: total
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch MCQs', error: error.message });
  }
};

// Complete MCQ test and generate certificate
exports.completeTest = async (req, res) => {
  try {
    const { courseId, technologyId, testId, answers } = req.body;
    const userId = req.user.id;

    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({ message: 'Answers are required' });
    }

    // Calculate results
    let correctAnswers = 0;
    let totalQuestions = answers.length;
    const results = [];

    for (const answer of answers) {
      const mcq = await MCQ.findById(answer.mcqId);
      if (!mcq) continue;

      const isCorrect = answer.selectedOption === mcq.correctAnswer;
      if (isCorrect) correctAnswers++;

      results.push({
        mcqId: answer.mcqId,
        question: mcq.question,
        selectedOption: answer.selectedOption,
        correctAnswer: mcq.correctAnswer,
        isCorrect,
        explanation: mcq.explanation
      });

      // Record attempt
      const attemptCount = await UserMCQAttempt.countDocuments({ 
        user: userId, 
        mcq: answer.mcqId 
      });

      await UserMCQAttempt.create({
        user: userId,
        mcq: answer.mcqId,
        selectedOption: answer.selectedOption,
        isCorrect,
        timeTaken: answer.timeTaken || 0,
        pointsEarned: isCorrect ? mcq.points : 0,
        attemptNumber: attemptCount + 1
      });
    }

    const score = Math.round((correctAnswers / totalQuestions) * 100);
    const passingScore = 70; // Minimum 70% to pass

    // Generate certificate if passed
    let certificate = null;
    if (score >= passingScore) {
      // Determine certificate title and type
      let certificateTitle = '';
      let certificateType = 'test';
      let description = '';

      if (courseId) {
        const course = await Course.findById(courseId);
        if (course) {
          certificateTitle = `${course.title} - Course Completion`;
          certificateType = 'course';
          description = `Successfully completed the ${course.title} course with a score of ${score}%`;
        }
      } else if (technologyId) {
        certificateTitle = 'Technology Assessment';
        certificateType = 'technology';
        description = `Successfully completed technology assessment with a score of ${score}%`;
      } else {
        certificateTitle = 'MCQ Test Completion';
        certificateType = 'test';
        description = `Successfully completed MCQ test with a score of ${score}%`;
      }

      // Check if certificate already exists
      const existingCert = await Certificate.findOne({
        user: userId,
        course: courseId,
        technology: technologyId,
        testId,
        status: 'active'
      });

      if (!existingCert) {
        certificate = await Certificate.create({
          user: userId,
          certificateType,
          course: courseId,
          technology: technologyId,
          testId,
          title: certificateTitle,
          description,
          score,
          totalQuestions,
          correctAnswers,
          tags: ['mcq', 'test', certificateType]
        });

        // Add certificate to user
        const user = await User.findById(userId);
        if (!user.certificates) user.certificates = [];
        user.certificates.push(certificate._id);
        user.totalPoints += Math.round(score);
        await user.save();

        // Populate certificate
        await certificate.populate([
          { path: 'course', select: 'title slug thumbnail' },
          { path: 'technology', select: 'name slug icon' }
        ]);
      } else {
        certificate = existingCert;
      }
    }

    res.json({
      score,
      passed: score >= passingScore,
      correctAnswers,
      totalQuestions,
      results,
      certificate,
      message: score >= passingScore 
        ? '🎉 Congratulations! You passed the test!' 
        : 'Keep practicing! You need 70% to pass.'
    });
  } catch (error) {
    console.error('Complete test error:', error);
    res.status(500).json({ message: 'Failed to complete test', error: error.message });
  }
};
