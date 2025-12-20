const aiService = require('./aiService');
const AILog = require('./AILog');

exports.processQuery = async (req, res) => {
  try {
    const { query } = req.body;
    
    if (!query || query.trim().length === 0) {
      return res.status(400).json({ message: 'Query is required' });
    }

    const result = await aiService.processQuery(req.userId, query, req.user.userType);
    
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || 'AI service error' });
  }
};

exports.getUsageStats = async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const stats = await aiService.getUsageStats(req.userId, parseInt(days));
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getQueryHistory = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const logs = await AILog.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('query aiMode tokensUsed processingTime createdAt');

    const total = await AILog.countDocuments({ userId: req.userId });

    res.json({
      logs,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAdminStats = async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const stats = await AILog.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: '$aiMode',
          count: { $sum: 1 },
          totalTokens: { $sum: '$tokensUsed' }
        }
      }
    ]);

    const totalQueries = await AILog.countDocuments({ createdAt: { $gte: startDate } });
    const uniqueUsers = await AILog.distinct('userId', { createdAt: { $gte: startDate } });

    res.json({
      totalQueries,
      uniqueUsers: uniqueUsers.length,
      modeStats: stats
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};