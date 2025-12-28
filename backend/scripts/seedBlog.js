// Seed blog articles, categories, and tags
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const Article = require('../src/models/Article');
const Category = require('../src/models/Category');
const Tag = require('../src/models/Tag');
const Comment = require('../src/models/Comment');
const User = require('../src/modules/auth/User');

const blogCategories = [
  { name: 'AI & Machine Learning', slug: 'ai-ml', icon: '🤖', color: '#8B5CF6', description: 'Articles about artificial intelligence, machine learning, and deep learning' },
  { name: 'Web Development', slug: 'web-dev', icon: '🌐', color: '#3B82F6', description: 'Frontend, backend, and full-stack web development tutorials' },
  { name: 'Cloud & DevOps', slug: 'cloud-devops', icon: '☁️', color: '#06B6D4', description: 'Cloud computing, DevOps practices, and infrastructure' },
  { name: 'Mobile Development', slug: 'mobile', icon: '📱', color: '#10B981', description: 'iOS, Android, and cross-platform mobile development' },
  { name: 'Cybersecurity', slug: 'security', icon: '🔒', color: '#EF4444', description: 'Security best practices, vulnerabilities, and protection' },
  { name: 'Data Science', slug: 'data-science', icon: '📊', color: '#F59E0B', description: 'Data analysis, visualization, and statistical modeling' },
  { name: 'Backend & APIs', slug: 'backend', icon: '⚙️', color: '#6366F1', description: 'Server-side programming and API development' },
  { name: 'Career & Growth', slug: 'career', icon: '🚀', color: '#EC4899', description: 'Career advice, interview tips, and professional growth' },
];

const blogTags = [
  { name: 'Python', slug: 'python', color: '#3776AB' },
  { name: 'JavaScript', slug: 'javascript', color: '#F7DF1E' },
  { name: 'React', slug: 'react', color: '#61DAFB' },
  { name: 'Next.js', slug: 'nextjs', color: '#000000' },
  { name: 'Node.js', slug: 'nodejs', color: '#339933' },
  { name: 'TypeScript', slug: 'typescript', color: '#3178C6' },
  { name: 'AWS', slug: 'aws', color: '#FF9900' },
  { name: 'Docker', slug: 'docker', color: '#2496ED' },
  { name: 'Kubernetes', slug: 'kubernetes', color: '#326CE5' },
  { name: 'ChatGPT', slug: 'chatgpt', color: '#10A37F' },
  { name: 'LLM', slug: 'llm', color: '#8B5CF6' },
  { name: 'MongoDB', slug: 'mongodb', color: '#47A248' },
  { name: 'PostgreSQL', slug: 'postgresql', color: '#336791' },
  { name: 'GraphQL', slug: 'graphql', color: '#E10098' },
  { name: 'REST API', slug: 'rest-api', color: '#009688' },
];

const blogArticles = [
  {
    title: 'Building AI-Powered Applications with OpenAI GPT-4 and LangChain',
    slug: 'building-ai-applications-openai-gpt4-langchain',
    excerpt: 'Learn how to integrate GPT-4 into your applications using LangChain for advanced AI capabilities.',
    content: `<p class="lead">Large Language Models (LLMs) like GPT-4 have revolutionized how we build AI applications. In this comprehensive guide, we'll explore how to leverage LangChain to create powerful AI-powered applications.</p>

<h2>🚀 Getting Started with LangChain</h2>
<p>LangChain is a framework designed to simplify the creation of applications using large language models. It provides tools for prompt management, chains, agents, and memory systems.</p>

<h3>Installation</h3>
<pre><code class="language-bash">pip install langchain openai python-dotenv
pip install chromadb tiktoken</code></pre>

<h3>Basic Setup</h3>
<pre><code class="language-python">import os
from dotenv import load_dotenv
from langchain.chat_models import ChatOpenAI
from langchain.prompts import ChatPromptTemplate
from langchain.chains import LLMChain

load_dotenv()

llm = ChatOpenAI(
    model_name="gpt-4",
    temperature=0.7,
    openai_api_key=os.getenv("OPENAI_API_KEY")
)

prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a helpful AI assistant specialized in {topic}."),
    ("human", "{question}")
])

chain = LLMChain(llm=llm, prompt=prompt)
response = chain.run(topic="Python programming", question="How do I implement a binary search tree?")
print(response)</code></pre>

<h2>📚 Building a RAG System</h2>
<p>Retrieval-Augmented Generation (RAG) combines the power of LLMs with external knowledge bases.</p>

<h2>🎯 Best Practices</h2>
<ul>
<li><strong>Use streaming</strong> for better UX with long responses</li>
<li><strong>Implement rate limiting</strong> to manage API costs</li>
<li><strong>Cache responses</strong> for frequently asked questions</li>
<li><strong>Monitor token usage</strong> to optimize costs</li>
</ul>`,
    featuredImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200',
    categorySlug: 'ai-ml',
    tagSlugs: ['python', 'chatgpt', 'llm'],
    readTime: 12,
    isFeatured: true
  },
  {
    title: 'Next.js 15 Server Components: Complete Guide to Modern React',
    slug: 'nextjs-15-server-components-complete-guide',
    excerpt: 'Master Next.js 15 Server Components, understand the new rendering patterns, and build lightning-fast web applications.',
    content: `<p class="lead">Next.js 15 introduces powerful new features for building modern web applications. This guide covers Server Components, the new rendering model, and best practices for optimal performance.</p>

<h2>🎯 Understanding Server Components</h2>
<p>Server Components are React components that render exclusively on the server. They reduce JavaScript bundle size and improve initial page load performance.</p>

<h3>Key Benefits</h3>
<ul>
<li>Zero client-side JavaScript for server components</li>
<li>Direct database access without API routes</li>
<li>Automatic code splitting</li>
<li>Improved SEO with server-rendered content</li>
</ul>

<h2>📁 Project Structure</h2>
<pre><code class="language-bash">app/
├── layout.tsx          # Root layout (Server Component)
├── page.tsx            # Home page (Server Component)
├── loading.tsx         # Loading UI
├── error.tsx           # Error boundary
└── api/
    └── route.ts</code></pre>

<h2>🚀 Data Fetching</h2>
<pre><code class="language-typescript">async function getData() {
  const res = await fetch('https://api.example.com/data', {
    cache: 'force-cache' // or 'no-store'
  });
  return res.json();
}

export default async function Page() {
  const data = await getData();
  return &lt;div&gt;{data.title}&lt;/div&gt;;
}</code></pre>`,
    featuredImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200',
    categorySlug: 'web-dev',
    tagSlugs: ['react', 'nextjs', 'typescript'],
    readTime: 15,
    isFeatured: true
  },
  {
    title: 'Docker and Kubernetes: A Complete DevOps Guide',
    slug: 'docker-kubernetes-complete-devops-guide',
    excerpt: 'Master containerization with Docker and orchestration with Kubernetes for modern cloud-native applications.',
    content: `<p class="lead">Containerization has become the standard for deploying modern applications. Learn Docker and Kubernetes from scratch.</p>

<h2>🐳 Docker Fundamentals</h2>
<pre><code class="language-dockerfile">FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]</code></pre>

<h2>☸️ Kubernetes Basics</h2>
<p>Kubernetes (K8s) is an open-source container orchestration platform that automates deployment, scaling, and management.</p>

<pre><code class="language-yaml">apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: my-app
  template:
    metadata:
      labels:
        app: my-app
    spec:
      containers:
      - name: my-app
        image: my-app:latest
        ports:
        - containerPort: 3000</code></pre>`,
    featuredImage: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=1200',
    categorySlug: 'cloud-devops',
    tagSlugs: ['docker', 'kubernetes', 'aws'],
    readTime: 18,
    isFeatured: true
  },
  {
    title: 'Building RESTful APIs with Node.js and Express',
    slug: 'building-restful-apis-nodejs-express',
    excerpt: 'Create robust and scalable REST APIs using Node.js, Express, and MongoDB with best practices.',
    content: `<p class="lead">Learn how to build production-ready REST APIs with Node.js and Express.</p>

<h2>🚀 Project Setup</h2>
<pre><code class="language-bash">npm init -y
npm install express mongoose dotenv cors helmet</code></pre>

<h2>📁 API Structure</h2>
<pre><code class="language-javascript">const express = require('express');
const router = express.Router();

// GET all items
router.get('/', async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST new item
router.post('/', async (req, res) => {
  const item = new Item(req.body);
  try {
    const newItem = await item.save();
    res.status(201).json(newItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;</code></pre>`,
    featuredImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200',
    categorySlug: 'backend',
    tagSlugs: ['nodejs', 'javascript', 'mongodb', 'rest-api'],
    readTime: 14,
    isFeatured: false
  },
  {
    title: 'React Native: Build Cross-Platform Mobile Apps',
    slug: 'react-native-cross-platform-mobile-apps',
    excerpt: 'Create native mobile applications for iOS and Android using React Native and Expo.',
    content: `<p class="lead">Build beautiful, native mobile apps using your existing JavaScript and React knowledge.</p>

<h2>📱 Getting Started with Expo</h2>
<pre><code class="language-bash">npx create-expo-app my-app
cd my-app
npx expo start</code></pre>

<h2>🎨 Building Components</h2>
<pre><code class="language-jsx">import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function HomeScreen() {
  return (
    &lt;View style={styles.container}&gt;
      &lt;Text style={styles.title}&gt;Welcome to React Native!&lt;/Text&gt;
      &lt;TouchableOpacity style={styles.button}&gt;
        &lt;Text style={styles.buttonText}&gt;Get Started&lt;/Text&gt;
      &lt;/TouchableOpacity&gt;
    &lt;/View&gt;
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold' },
  button: { backgroundColor: '#007AFF', padding: 15, borderRadius: 10 },
  buttonText: { color: 'white', fontWeight: 'bold' }
});</code></pre>`,
    featuredImage: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1200',
    categorySlug: 'mobile',
    tagSlugs: ['react', 'javascript', 'typescript'],
    readTime: 16,
    isFeatured: false
  },
  {
    title: 'Data Visualization with Python: Matplotlib and Plotly',
    slug: 'data-visualization-python-matplotlib-plotly',
    excerpt: 'Create stunning data visualizations using Python with Matplotlib, Seaborn, and Plotly.',
    content: `<p class="lead">Master the art of data visualization in Python to tell compelling stories with data.</p>

<h2>📊 Matplotlib Basics</h2>
<pre><code class="language-python">import matplotlib.pyplot as plt
import numpy as np

x = np.linspace(0, 10, 100)
y = np.sin(x)

plt.figure(figsize=(10, 6))
plt.plot(x, y, 'b-', linewidth=2)
plt.title('Sine Wave')
plt.xlabel('X')
plt.ylabel('Y')
plt.grid(True)
plt.show()</code></pre>

<h2>🎨 Interactive Charts with Plotly</h2>
<pre><code class="language-python">import plotly.express as px
import pandas as pd

df = pd.DataFrame({
    'x': [1, 2, 3, 4, 5],
    'y': [10, 11, 12, 13, 14],
    'category': ['A', 'B', 'A', 'B', 'A']
})

fig = px.scatter(df, x='x', y='y', color='category', size='y')
fig.show()</code></pre>`,
    featuredImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200',
    categorySlug: 'data-science',
    tagSlugs: ['python'],
    readTime: 13,
    isFeatured: false
  },
  {
    title: 'Securing Your Web Applications: OWASP Top 10',
    slug: 'securing-web-applications-owasp-top-10',
    excerpt: 'Learn about the OWASP Top 10 security risks and how to protect your applications.',
    content: `<p class="lead">Security is crucial for any web application. Learn the most critical security risks and how to mitigate them.</p>

<h2>🔒 OWASP Top 10 Overview</h2>
<ul>
<li><strong>A01 Broken Access Control</strong> - Enforce proper authorization</li>
<li><strong>A02 Cryptographic Failures</strong> - Protect sensitive data</li>
<li><strong>A03 Injection</strong> - Prevent SQL, NoSQL, and command injection</li>
<li><strong>A04 Insecure Design</strong> - Build security into design</li>
<li><strong>A05 Security Misconfiguration</strong> - Secure your configs</li>
</ul>

<h2>🛡️ Prevention Example - SQL Injection</h2>
<pre><code class="language-javascript">// BAD - Vulnerable to SQL Injection
const query = \`SELECT * FROM users WHERE id = \${userId}\`;

// GOOD - Use parameterized queries
const query = 'SELECT * FROM users WHERE id = ?';
db.query(query, [userId]);</code></pre>`,
    featuredImage: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=1200',
    categorySlug: 'security',
    tagSlugs: ['nodejs', 'javascript'],
    readTime: 11,
    isFeatured: false
  },
  {
    title: 'Landing Your First Developer Job: Complete Guide',
    slug: 'landing-first-developer-job-complete-guide',
    excerpt: 'A comprehensive guide to getting your first software developer job, from portfolio to interview.',
    content: `<p class="lead">Breaking into tech can be challenging. Here's everything you need to know to land your first developer job.</p>

<h2>📝 Building Your Portfolio</h2>
<ul>
<li>Create 3-5 quality projects</li>
<li>Host your code on GitHub</li>
<li>Deploy your projects online</li>
<li>Write documentation</li>
</ul>

<h2>💼 Resume Tips</h2>
<ul>
<li>Keep it to one page</li>
<li>Highlight relevant skills</li>
<li>Include project links</li>
<li>Use action verbs</li>
</ul>

<h2>🎯 Interview Preparation</h2>
<ul>
<li>Practice coding problems on LeetCode</li>
<li>Prepare behavioral answers using STAR method</li>
<li>Research the company</li>
<li>Prepare thoughtful questions</li>
</ul>`,
    featuredImage: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200',
    categorySlug: 'career',
    tagSlugs: ['javascript', 'react'],
    readTime: 10,
    isFeatured: false
  }
];

async function seedBlog() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/techtootalk';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Get admin user for author
    let adminUser = await User.findOne({ role: 'admin' });
    if (!adminUser) {
      console.log('No admin user found, creating one...');
      adminUser = await User.create({
        name: 'Admin',
        email: 'admin@techtootalk.com',
        password: 'admin123',
        role: 'admin',
        userType: 'experienced'
      });
    }

    // Clear existing blog data
    console.log('Clearing existing blog data...');
    await Category.deleteMany({});
    await Tag.deleteMany({});
    await Article.deleteMany({});
    await Comment.deleteMany({});

    // Seed Categories
    console.log('Seeding categories...');
    const categoryMap = {};
    for (const cat of blogCategories) {
      const category = await Category.create({
        name: cat.name,
        slug: cat.slug,
        icon: cat.icon,
        color: cat.color,
        description: cat.description,
        isActive: true
      });
      categoryMap[cat.slug] = category._id;
    }
    console.log(`Created ${blogCategories.length} categories`);

    // Seed Tags
    console.log('Seeding tags...');
    const tagMap = {};
    for (const tag of blogTags) {
      const createdTag = await Tag.create({
        name: tag.name,
        slug: tag.slug,
        color: tag.color,
        isActive: true
      });
      tagMap[tag.slug] = createdTag._id;
    }
    console.log(`Created ${blogTags.length} tags`);

    // Seed Articles
    console.log('Seeding articles...');
    for (const art of blogArticles) {
      const tagIds = art.tagSlugs.map(slug => tagMap[slug]).filter(Boolean);
      const categoryId = categoryMap[art.categorySlug];
      
      if (!categoryId) {
        console.warn(`Category not found for article: ${art.title}`);
        continue;
      }

      await Article.create({
        title: art.title,
        slug: art.slug,
        excerpt: art.excerpt,
        content: art.content,
        featuredImage: art.featuredImage,
        author: adminUser._id,
        category: categoryId,
        tags: tagIds,
        readTime: art.readTime,
        views: Math.floor(Math.random() * 10000) + 1000,
        likes: Math.floor(Math.random() * 200) + 50,
        isPublished: true,
        isFeatured: art.isFeatured,
        publishedAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
        metaTitle: art.title.substring(0, 60),
        metaDescription: art.excerpt.substring(0, 160)
      });
    }
    console.log(`Created ${blogArticles.length} articles`);

    await mongoose.disconnect();
    console.log('\n✅ Blog seeding complete!');
    console.log(`Categories: ${blogCategories.length}`);
    console.log(`Tags: ${blogTags.length}`);
    console.log(`Articles: ${blogArticles.length}`);
  } catch (error) {
    console.error('Blog seeding failed:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

seedBlog();
