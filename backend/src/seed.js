const mongoose = require('mongoose');
const User = require('./modules/auth/User');
const Technology = require('./modules/technologies/Technology');
const Membership = require('./modules/memberships/Membership');

const seedData = async () => {
  try {
    // Create admin user
    const adminExists = await User.findOne({ role: 'admin' });
    if (!adminExists) {
      const admin = new User({
        email: 'admin@skillstenz.com',
        password: 'admin123',
        role: 'admin',
        userType: 'experienced'
      });
      await admin.save();
      console.log('Admin user created');
    }

    // Create AI-focused technologies with courses
    const technologies = [
      {
        name: 'Artificial Intelligence',
        slug: 'ai',
        description: 'Master the fundamentals of Artificial Intelligence, from theory to practical applications',
        icon: '🤖',
        color: '#8B5CF6',
        accessType: 'mixed',
        featured: true,
        order: 1,
        fresherAllowed: true,
        experiencedAllowed: true,
        courses: [
          {
            title: 'Introduction to Artificial Intelligence',
            slug: 'introduction-to-ai',
            description: 'Start your AI journey with fundamental concepts, history, and real-world applications of AI technology.',
            level: 'Beginner',
            duration: '10 hours',
            topics: 25,
            lessons: 30,
            featured: true,
            price: 'free',
            rating: 4.9,
            studentsCount: 5200,
            tags: ['AI', 'Machine Learning', 'Fundamentals', 'Career'],
            learningObjectives: [
              'Understand core AI concepts and terminology',
              'Learn the history and evolution of AI',
              'Explore different types of AI systems',
              'Understand AI ethics and responsible AI'
            ],
            prerequisites: ['Basic programming knowledge', 'High school mathematics']
          },
          {
            title: 'AI for Business Applications',
            slug: 'ai-for-business',
            description: 'Learn how to leverage AI to solve real business problems and drive innovation.',
            level: 'Intermediate',
            duration: '12 hours',
            topics: 20,
            lessons: 25,
            featured: false,
            price: 'paid',
            rating: 4.8,
            studentsCount: 1800,
            tags: ['AI', 'Business', 'Strategy', 'Innovation']
          }
        ]
      },
      {
        name: 'AI Agents',
        slug: 'ai-agents',
        description: 'Build autonomous AI agents that can reason, plan, and execute complex tasks',
        icon: '🦾',
        color: '#EC4899',
        accessType: 'paid',
        featured: true,
        order: 2,
        fresherAllowed: false,
        experiencedAllowed: true,
        courses: [
          {
            title: 'Building AI Agents with LangChain',
            slug: 'building-ai-agents-langchain',
            description: 'Create intelligent AI agents using LangChain framework, tool use, and autonomous reasoning.',
            level: 'Advanced',
            duration: '15 hours',
            topics: 35,
            lessons: 42,
            featured: true,
            price: 'paid',
            rating: 4.9,
            studentsCount: 2100,
            tags: ['AI Agents', 'LangChain', 'Autonomous AI', 'Tool Use'],
            learningObjectives: [
              'Design and build autonomous AI agents',
              'Implement tool use and function calling',
              'Create multi-agent systems',
              'Handle agent memory and state management'
            ],
            prerequisites: ['Python proficiency', 'Basic understanding of LLMs']
          },
          {
            title: 'AutoGen: Multi-Agent Conversations',
            slug: 'autogen-multi-agent',
            description: 'Master Microsoft AutoGen framework for building conversational AI agents.',
            level: 'Advanced',
            duration: '10 hours',
            topics: 22,
            lessons: 28,
            featured: false,
            price: 'paid',
            rating: 4.7,
            studentsCount: 890,
            tags: ['AutoGen', 'Multi-Agent', 'Microsoft', 'Conversations']
          }
        ]
      },
      {
        name: 'Machine Learning',
        slug: 'machine-learning',
        description: 'Learn machine learning algorithms, model training, and deployment strategies',
        icon: '🧠',
        color: '#10B981',
        accessType: 'mixed',
        featured: true,
        order: 3,
        fresherAllowed: true,
        experiencedAllowed: true,
        courses: [
          {
            title: 'Machine Learning Fundamentals',
            slug: 'ml-fundamentals',
            description: 'Comprehensive introduction to machine learning concepts, algorithms, and practical implementations.',
            level: 'Beginner',
            duration: '20 hours',
            topics: 45,
            lessons: 55,
            featured: true,
            price: 'free',
            rating: 4.8,
            studentsCount: 8500,
            tags: ['Machine Learning', 'Python', 'Scikit-learn', 'Data Science'],
            learningObjectives: [
              'Understand supervised and unsupervised learning',
              'Implement common ML algorithms from scratch',
              'Use scikit-learn for model building',
              'Evaluate and improve model performance'
            ],
            prerequisites: ['Python basics', 'Basic statistics']
          },
          {
            title: 'Deep Learning with PyTorch',
            slug: 'deep-learning-pytorch',
            description: 'Build neural networks and deep learning models using PyTorch framework.',
            level: 'Intermediate',
            duration: '25 hours',
            topics: 40,
            lessons: 50,
            featured: true,
            price: 'paid',
            rating: 4.9,
            studentsCount: 4200,
            tags: ['Deep Learning', 'PyTorch', 'Neural Networks', 'CNN', 'RNN']
          }
        ]
      },
      {
        name: 'LangChain',
        slug: 'langchain',
        description: 'Build powerful LLM applications with LangChain framework',
        icon: '🔗',
        color: '#F59E0B',
        accessType: 'paid',
        featured: true,
        order: 4,
        fresherAllowed: true,
        experiencedAllowed: true,
        courses: [
          {
            title: 'LangChain Complete Guide',
            slug: 'langchain-complete-guide',
            description: 'Master LangChain framework for building production-ready LLM applications.',
            level: 'Intermediate',
            duration: '18 hours',
            topics: 38,
            lessons: 45,
            featured: true,
            price: 'paid',
            rating: 4.9,
            studentsCount: 3800,
            tags: ['LangChain', 'LLM', 'RAG', 'Chains', 'Memory'],
            learningObjectives: [
              'Build chains and agents with LangChain',
              'Implement RAG applications',
              'Work with various LLM providers',
              'Deploy LangChain applications to production'
            ],
            prerequisites: ['Python proficiency', 'Understanding of LLMs']
          }
        ]
      },
      {
        name: 'Prompt Engineering',
        slug: 'prompt-engineering',
        description: 'Master the art and science of crafting effective prompts for AI models',
        icon: '✨',
        color: '#6366F1',
        accessType: 'free',
        featured: true,
        order: 5,
        fresherAllowed: true,
        experiencedAllowed: true,
        courses: [
          {
            title: 'Prompt Engineering Masterclass',
            slug: 'prompt-engineering-masterclass',
            description: 'Learn advanced prompting techniques for ChatGPT, Claude, and other LLMs.',
            level: 'Beginner',
            duration: '8 hours',
            topics: 20,
            lessons: 25,
            featured: true,
            price: 'free',
            rating: 4.9,
            studentsCount: 12000,
            tags: ['Prompt Engineering', 'ChatGPT', 'Claude', 'LLM', 'AI Writing'],
            learningObjectives: [
              'Master zero-shot and few-shot prompting',
              'Learn chain-of-thought prompting',
              'Create effective system prompts',
              'Avoid common prompting mistakes'
            ],
            prerequisites: ['No prerequisites required']
          }
        ]
      },
      {
        name: 'RAG Systems',
        slug: 'rag-systems',
        description: 'Build Retrieval-Augmented Generation systems for knowledge-intensive AI applications',
        icon: '📚',
        color: '#EF4444',
        accessType: 'paid',
        featured: false,
        order: 6,
        fresherAllowed: false,
        experiencedAllowed: true,
        courses: [
          {
            title: 'Building RAG Applications',
            slug: 'building-rag-applications',
            description: 'Create production-ready RAG systems with vector databases and LLMs.',
            level: 'Advanced',
            duration: '14 hours',
            topics: 30,
            lessons: 35,
            featured: true,
            price: 'paid',
            rating: 4.8,
            studentsCount: 2400,
            tags: ['RAG', 'Vector Database', 'Embeddings', 'Pinecone', 'Weaviate']
          }
        ]
      },
      {
        name: 'NLP',
        slug: 'nlp',
        description: 'Natural Language Processing for understanding and generating human language',
        icon: '💬',
        color: '#14B8A6',
        accessType: 'mixed',
        featured: false,
        order: 7,
        fresherAllowed: true,
        experiencedAllowed: true,
        courses: [
          {
            title: 'NLP with Transformers',
            slug: 'nlp-with-transformers',
            description: 'Master NLP using Hugging Face Transformers library.',
            level: 'Intermediate',
            duration: '16 hours',
            topics: 32,
            lessons: 40,
            featured: true,
            price: 'paid',
            rating: 4.8,
            studentsCount: 3100,
            tags: ['NLP', 'Transformers', 'Hugging Face', 'BERT', 'GPT']
          }
        ]
      },
      {
        name: 'Computer Vision',
        slug: 'computer-vision',
        description: 'Teach machines to see and understand visual information',
        icon: '👁️',
        color: '#F97316',
        accessType: 'paid',
        featured: false,
        order: 8,
        fresherAllowed: true,
        experiencedAllowed: true,
        courses: [
          {
            title: 'Computer Vision with OpenCV and PyTorch',
            slug: 'computer-vision-opencv-pytorch',
            description: 'Build image recognition, object detection, and visual AI applications.',
            level: 'Intermediate',
            duration: '20 hours',
            topics: 40,
            lessons: 48,
            featured: true,
            price: 'paid',
            rating: 4.7,
            studentsCount: 2800,
            tags: ['Computer Vision', 'OpenCV', 'PyTorch', 'Object Detection', 'CNN']
          }
        ]
      },
      {
        name: 'Python for AI',
        slug: 'python-for-ai',
        description: 'Master Python programming specifically for AI and data science applications',
        icon: '🐍',
        color: '#3B82F6',
        accessType: 'free',
        featured: true,
        order: 9,
        fresherAllowed: true,
        experiencedAllowed: true,
        courses: [
          {
            title: 'Python for AI Development',
            slug: 'python-for-ai-development',
            description: 'Learn Python with focus on AI libraries, data manipulation, and ML workflows.',
            level: 'Beginner',
            duration: '15 hours',
            topics: 35,
            lessons: 42,
            featured: true,
            price: 'free',
            rating: 4.9,
            studentsCount: 9500,
            tags: ['Python', 'NumPy', 'Pandas', 'Matplotlib', 'AI Development']
          }
        ]
      },
      {
        name: 'GenAI Applications',
        slug: 'genai-applications',
        description: 'Build generative AI applications using cutting-edge models and tools',
        icon: '🎨',
        color: '#A855F7',
        accessType: 'paid',
        featured: true,
        order: 10,
        fresherAllowed: true,
        experiencedAllowed: true,
        courses: [
          {
            title: 'Building GenAI Applications',
            slug: 'building-genai-applications',
            description: 'Create text, image, and multimodal generative AI applications.',
            level: 'Intermediate',
            duration: '12 hours',
            topics: 28,
            lessons: 34,
            featured: true,
            price: 'paid',
            rating: 4.8,
            studentsCount: 4500,
            tags: ['Generative AI', 'GPT', 'DALL-E', 'Stable Diffusion', 'Midjourney']
          }
        ]
      }
    ];

    for (const tech of technologies) {
      const existing = await Technology.findOne({
        $or: [{ slug: tech.slug }, { name: tech.name }]
      });

      // Only create if doesn't exist - don't overwrite existing data
      if (!existing) {
        await Technology.create(tech);
        console.log(`Technology ${tech.name} created (${tech.courses.length} courses)`);
      } else {
        console.log(`Technology ${tech.name} already exists - skipping`);
      }
    }

    console.log('Seeding completed');
  } catch (error) {
    console.error('Seeding error:', error);
  }
};

module.exports = seedData;