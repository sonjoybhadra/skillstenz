const AILog = require('./AILog');
const User = require('../auth/User');
const axios = require('axios');

class AIService {
  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY;
    this.baseURL = 'https://api.openai.com/v1';
  }

  async processQuery(userId, query, userType) {
    const startTime = Date.now();
    
    try {
      // Get user membership
      const user = await User.findById(userId).populate('membershipId');
      const membership = user.membershipId;
      
      let aiMode = 'basic';
      let canUseAI = false;
      
      if (membership && membership.status === 'active' && new Date() <= membership.expiryDate) {
        if (['silver', 'gold'].includes(membership.planType)) {
          aiMode = 'advanced';
          canUseAI = true;
        }
      } else {
        // Free plan - check usage limit
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const usageCount = await AILog.countDocuments({
          userId,
          createdAt: { $gte: today }
        });
        
        if (usageCount < 10) { // 10 queries per day for free
          canUseAI = true;
        }
      }

      if (!canUseAI) {
        throw new Error('AI usage limit exceeded. Upgrade to continue.');
      }

      // Build context
      const context = await this.buildContext(userId, userType);
      
      // Generate prompt
      const prompt = this.buildPrompt(query, context, aiMode, userType);
      
      // Call OpenAI API
      const response = await axios.post(`${this.baseURL}/chat/completions`, {
        model: aiMode === 'advanced' ? 'gpt-4' : 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: aiMode === 'advanced' ? 2000 : 1000,
        temperature: 0.7
      }, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      const aiResponse = response.data.choices[0].message.content;
      const tokensUsed = response.data.usage.total_tokens;
      const processingTime = Date.now() - startTime;

      // Log the interaction
      await AILog.create({
        userId,
        query,
        response: aiResponse,
        aiMode,
        tokensUsed,
        processingTime
      });

      // Update membership usage count
      if (membership && membership.aiUsageLimit > 0) {
        membership.aiUsageCount += 1;
        await membership.save();
      }

      return {
        response: aiResponse,
        aiMode,
        tokensUsed,
        processingTime
      };

    } catch (error) {
      console.error('AI Service Error:', error);
      throw error;
    }
  }

  async buildContext(userId, userType) {
    const user = await User.findById(userId).populate('membershipId');
    const profile = await require('../profiles/Profile').findOne({ userId });
    
    return {
      userType,
      membership: user.membershipId?.planType || 'free',
      profile: profile ? {
        skills: profile.skills,
        experience: profile.experience?.length || 0,
        education: profile.education?.length || 0
      } : null
    };
  }

  buildPrompt(query, context, aiMode, userType) {
    const systemPrompt = `You are an AI assistant for TechTooTalk, an education and career platform. 
You are helping a ${userType} user with ${aiMode} AI capabilities.
User membership: ${context.membership}

Guidelines:
- Be helpful, professional, and encouraging
- Tailor advice to ${userType} level
- For basic AI: Keep responses concise and focused
- For advanced AI: Provide detailed, comprehensive responses
- Always promote learning and career growth
- Suggest relevant platform features when appropriate

User Profile Summary:
${context.profile ? `- Skills: ${context.profile.skills?.join(', ')}
- Experience: ${context.profile.experience} years
- Education: ${context.profile.education} degrees` : 'No profile information available'}

Query: ${query}

Provide a helpful response:`;

    return systemPrompt;
  }

  async getUsageStats(userId, days = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const stats = await AILog.aggregate([
      { $match: { userId: mongoose.Types.ObjectId(userId), createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: null,
          totalQueries: { $sum: 1 },
          totalTokens: { $sum: '$tokensUsed' },
          avgProcessingTime: { $avg: '$processingTime' }
        }
      }
    ]);

    return stats[0] || { totalQueries: 0, totalTokens: 0, avgProcessingTime: 0 };
  }
}

module.exports = new AIService();