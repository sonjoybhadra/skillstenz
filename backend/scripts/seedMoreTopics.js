const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/techtootalk')
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

const Technology = require('../src/modules/technologies/Technology');
const Course = require('../src/modules/courses/Course');
const Topic = require('../src/modules/courses/Topic');

// Additional topics for more courses
const additionalTopicsData = {
  'nodejs': {
    'nodejs-backend-development': [
      {
        title: 'Introduction to Node.js',
        description: 'Learn what Node.js is and how it works',
        content: `# Introduction to Node.js

## What is Node.js?

Node.js is a JavaScript runtime built on Chrome's V8 engine that allows you to run JavaScript on the server.

## Key Features

- **Non-blocking I/O**: Handles multiple requests efficiently
- **Single-threaded**: Uses event loop for concurrency
- **NPM**: World's largest package ecosystem
- **Cross-platform**: Runs on Windows, Mac, Linux

## Installing Node.js

\`\`\`bash
# Download from nodejs.org or use nvm
nvm install 20
nvm use 20
node --version
\`\`\`

## Your First Node.js Program

\`\`\`javascript
// hello.js
console.log('Hello from Node.js!');

// Run it
// node hello.js
\`\`\`

## Built-in Modules

\`\`\`javascript
const fs = require('fs');
const path = require('path');
const http = require('http');
const os = require('os');

console.log('Platform:', os.platform());
console.log('Home Dir:', os.homedir());
\`\`\``,
        duration: 20,
        difficulty: 'beginner',
        type: 'lesson',
        isFree: true,
        tags: ['nodejs', 'backend', 'introduction']
      },
      {
        title: 'Node.js Modules System',
        description: 'Understanding CommonJS and ES Modules',
        content: `# Node.js Module System

## CommonJS (Default)

\`\`\`javascript
// math.js - Exporting
const add = (a, b) => a + b;
const subtract = (a, b) => a - b;

module.exports = { add, subtract };

// app.js - Importing
const math = require('./math');
console.log(math.add(2, 3)); // 5
\`\`\`

## ES Modules

\`\`\`javascript
// math.mjs
export const add = (a, b) => a + b;
export const subtract = (a, b) => a - b;
export default { add, subtract };

// app.mjs
import { add } from './math.mjs';
import math from './math.mjs';
\`\`\`

## Built-in Modules

\`\`\`javascript
const fs = require('fs');
const path = require('path');
const http = require('http');
const crypto = require('crypto');
const events = require('events');
\`\`\`

## Third-party Modules

\`\`\`bash
npm install express lodash axios
\`\`\`

\`\`\`javascript
const express = require('express');
const _ = require('lodash');
const axios = require('axios');
\`\`\``,
        duration: 25,
        difficulty: 'beginner',
        type: 'lesson',
        isFree: true,
        tags: ['nodejs', 'modules', 'commonjs', 'esm']
      },
      {
        title: 'File System Operations',
        description: 'Reading and writing files with Node.js',
        content: `# File System Operations

## The fs Module

\`\`\`javascript
const fs = require('fs');
const fsPromises = require('fs').promises;
\`\`\`

## Reading Files

\`\`\`javascript
// Synchronous
const data = fs.readFileSync('file.txt', 'utf8');

// Asynchronous (callback)
fs.readFile('file.txt', 'utf8', (err, data) => {
  if (err) throw err;
  console.log(data);
});

// Promise-based (recommended)
const data = await fsPromises.readFile('file.txt', 'utf8');
\`\`\`

## Writing Files

\`\`\`javascript
// Write (overwrites)
await fsPromises.writeFile('output.txt', 'Hello!');

// Append
await fsPromises.appendFile('log.txt', 'New log entry\\n');
\`\`\`

## Working with Directories

\`\`\`javascript
// Create directory
await fsPromises.mkdir('new-folder', { recursive: true });

// Read directory
const files = await fsPromises.readdir('./');

// Delete
await fsPromises.unlink('file.txt'); // file
await fsPromises.rmdir('folder');    // empty dir
\`\`\`

## Checking Files

\`\`\`javascript
const stats = await fsPromises.stat('file.txt');
console.log(stats.isFile());      // true/false
console.log(stats.isDirectory()); // true/false
console.log(stats.size);          // bytes
\`\`\``,
        duration: 30,
        difficulty: 'beginner',
        type: 'lesson',
        isFree: true,
        tags: ['nodejs', 'filesystem', 'fs']
      },
      {
        title: 'Building HTTP Server',
        description: 'Create web servers with Node.js http module',
        content: `# Building HTTP Server

## Basic HTTP Server

\`\`\`javascript
const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello, World!');
});

server.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
\`\`\`

## Handling Routes

\`\`\`javascript
const server = http.createServer((req, res) => {
  const { url, method } = req;

  if (url === '/' && method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('<h1>Home Page</h1>');
  } else if (url === '/api/users' && method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify([{ id: 1, name: 'John' }]));
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});
\`\`\`

## Handling POST Data

\`\`\`javascript
if (method === 'POST') {
  let body = '';
  
  req.on('data', chunk => {
    body += chunk.toString();
  });
  
  req.on('end', () => {
    const data = JSON.parse(body);
    res.writeHead(201, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ received: data }));
  });
}
\`\`\``,
        duration: 30,
        difficulty: 'intermediate',
        type: 'lesson',
        isFree: false,
        tags: ['nodejs', 'http', 'server', 'api']
      },
      {
        title: 'Express.js Basics',
        description: 'Build web applications with Express framework',
        content: `# Express.js Basics

## Setting Up Express

\`\`\`bash
npm init -y
npm install express
\`\`\`

\`\`\`javascript
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello, Express!');
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
\`\`\`

## Middleware

\`\`\`javascript
// Built-in middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Custom middleware
app.use((req, res, next) => {
  console.log(\`\${req.method} \${req.url}\`);
  next();
});
\`\`\`

## Routes

\`\`\`javascript
// GET
app.get('/users', (req, res) => {
  res.json([{ id: 1, name: 'John' }]);
});

// POST
app.post('/users', (req, res) => {
  const user = req.body;
  res.status(201).json(user);
});

// Route parameters
app.get('/users/:id', (req, res) => {
  const { id } = req.params;
  res.json({ id, name: 'User ' + id });
});

// Query parameters
app.get('/search', (req, res) => {
  const { q, page } = req.query;
  res.json({ query: q, page });
});
\`\`\`

## Router

\`\`\`javascript
// routes/users.js
const router = express.Router();

router.get('/', getUsers);
router.post('/', createUser);
router.get('/:id', getUser);

module.exports = router;

// app.js
app.use('/api/users', require('./routes/users'));
\`\`\``,
        duration: 35,
        difficulty: 'intermediate',
        type: 'lesson',
        isFree: false,
        tags: ['nodejs', 'express', 'api', 'web']
      }
    ]
  },

  'docker': {
    'docker-for-developers': [
      {
        title: 'Introduction to Docker',
        description: 'Understanding containers and Docker basics',
        content: `# Introduction to Docker

## What is Docker?

Docker is a platform for developing, shipping, and running applications in containers.

## Containers vs VMs

| Containers | Virtual Machines |
|------------|------------------|
| Share OS kernel | Full OS each |
| Lightweight | Heavy |
| Start in seconds | Start in minutes |
| Less isolation | Full isolation |

## Key Concepts

- **Image**: Blueprint for containers
- **Container**: Running instance of an image
- **Dockerfile**: Instructions to build an image
- **Registry**: Storage for images (Docker Hub)

## Installing Docker

\`\`\`bash
# Check installation
docker --version
docker-compose --version
\`\`\`

## First Docker Commands

\`\`\`bash
# Run a container
docker run hello-world

# List containers
docker ps       # running
docker ps -a    # all

# List images
docker images
\`\`\``,
        duration: 20,
        difficulty: 'beginner',
        type: 'lesson',
        isFree: true,
        tags: ['docker', 'containers', 'devops']
      },
      {
        title: 'Docker Images and Containers',
        description: 'Working with Docker images and managing containers',
        content: `# Docker Images and Containers

## Pulling Images

\`\`\`bash
docker pull nginx
docker pull node:20
docker pull python:3.11
\`\`\`

## Running Containers

\`\`\`bash
# Basic run
docker run nginx

# Detached mode
docker run -d nginx

# With name
docker run -d --name my-nginx nginx

# Port mapping
docker run -d -p 8080:80 nginx

# Environment variables
docker run -d -e DB_HOST=localhost mysql
\`\`\`

## Managing Containers

\`\`\`bash
# Stop
docker stop my-nginx

# Start
docker start my-nginx

# Restart
docker restart my-nginx

# Remove
docker rm my-nginx

# Remove running
docker rm -f my-nginx
\`\`\`

## Executing Commands

\`\`\`bash
# Run command in container
docker exec my-nginx ls /etc/nginx

# Interactive shell
docker exec -it my-nginx bash
\`\`\`

## Viewing Logs

\`\`\`bash
docker logs my-nginx
docker logs -f my-nginx  # follow
docker logs --tail 100 my-nginx
\`\`\``,
        duration: 25,
        difficulty: 'beginner',
        type: 'lesson',
        isFree: true,
        tags: ['docker', 'images', 'containers']
      },
      {
        title: 'Creating Dockerfiles',
        description: 'Build custom Docker images with Dockerfile',
        content: `# Creating Dockerfiles

## Basic Dockerfile

\`\`\`dockerfile
# Base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose port
EXPOSE 3000

# Start command
CMD ["npm", "start"]
\`\`\`

## Building Images

\`\`\`bash
# Build with tag
docker build -t my-app:1.0 .

# Build with different Dockerfile
docker build -f Dockerfile.dev -t my-app:dev .
\`\`\`

## Multi-stage Builds

\`\`\`dockerfile
# Build stage
FROM node:20 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 3000
CMD ["node", "dist/index.js"]
\`\`\`

## Best Practices

1. Use specific base image tags
2. Minimize layers
3. Use .dockerignore
4. Don't run as root
5. Use multi-stage builds`,
        duration: 30,
        difficulty: 'intermediate',
        type: 'lesson',
        isFree: false,
        tags: ['docker', 'dockerfile', 'build']
      },
      {
        title: 'Docker Compose',
        description: 'Orchestrate multi-container applications',
        content: `# Docker Compose

## What is Docker Compose?

Docker Compose is a tool for defining and running multi-container applications.

## Basic docker-compose.yml

\`\`\`yaml
version: '3.8'

services:
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
    volumes:
      - .:/app
    depends_on:
      - db

  db:
    image: mongo:6
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db

volumes:
  mongodb_data:
\`\`\`

## Commands

\`\`\`bash
# Start services
docker-compose up
docker-compose up -d  # detached

# Stop services
docker-compose down

# View logs
docker-compose logs
docker-compose logs -f web

# Rebuild
docker-compose up --build

# Scale
docker-compose up --scale web=3
\`\`\`

## Full Stack Example

\`\`\`yaml
version: '3.8'

services:
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    depends_on:
      - backend

  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - MONGODB_URI=mongodb://db:27017/app
    depends_on:
      - db

  db:
    image: mongo:6
    volumes:
      - mongo_data:/data/db

volumes:
  mongo_data:
\`\`\``,
        duration: 35,
        difficulty: 'intermediate',
        type: 'lesson',
        isFree: false,
        tags: ['docker', 'compose', 'orchestration']
      }
    ]
  },

  'git': {
    'git-github-essentials': [
      {
        title: 'Git Fundamentals',
        description: 'Understanding version control with Git',
        content: `# Git Fundamentals

## What is Git?

Git is a distributed version control system for tracking changes in code.

## Initial Setup

\`\`\`bash
git config --global user.name "Your Name"
git config --global user.email "you@email.com"
\`\`\`

## Creating a Repository

\`\`\`bash
# New repository
git init

# Clone existing
git clone https://github.com/user/repo.git
\`\`\`

## Basic Workflow

\`\`\`bash
# Check status
git status

# Stage changes
git add filename.js
git add .  # all files

# Commit changes
git commit -m "Add new feature"

# View history
git log
git log --oneline
\`\`\`

## Working with Files

\`\`\`bash
# Discard changes
git checkout -- filename.js

# Unstage file
git reset HEAD filename.js

# Remove file
git rm filename.js
\`\`\``,
        duration: 20,
        difficulty: 'beginner',
        type: 'lesson',
        isFree: true,
        tags: ['git', 'version-control', 'basics']
      },
      {
        title: 'Git Branching',
        description: 'Master branching strategies in Git',
        content: `# Git Branching

## Branch Basics

\`\`\`bash
# List branches
git branch

# Create branch
git branch feature-login

# Switch branch
git checkout feature-login
# or
git switch feature-login

# Create and switch
git checkout -b feature-signup
\`\`\`

## Merging

\`\`\`bash
# Merge feature into main
git checkout main
git merge feature-login
\`\`\`

## Handling Conflicts

\`\`\`bash
# After merge conflict
# 1. Edit conflicted files
# 2. Stage resolved files
git add resolved-file.js
# 3. Complete merge
git commit
\`\`\`

## Branching Strategies

### Git Flow
- main: production
- develop: integration
- feature/*: new features
- hotfix/*: urgent fixes

### Trunk-Based
- main: always deployable
- Short-lived feature branches`,
        duration: 25,
        difficulty: 'beginner',
        type: 'lesson',
        isFree: true,
        tags: ['git', 'branching', 'merge']
      },
      {
        title: 'Working with GitHub',
        description: 'Collaborate using GitHub features',
        content: `# Working with GitHub

## Remote Repositories

\`\`\`bash
# Add remote
git remote add origin https://github.com/user/repo.git

# View remotes
git remote -v

# Push to remote
git push -u origin main

# Pull changes
git pull origin main
\`\`\`

## Pull Requests

1. Fork repository (on GitHub)
2. Clone your fork
3. Create feature branch
4. Make changes and commit
5. Push to your fork
6. Create Pull Request on GitHub

## Common Workflow

\`\`\`bash
# Start new feature
git checkout -b feature/new-button

# Make changes and commit
git add .
git commit -m "Add new button component"

# Push feature branch
git push -u origin feature/new-button

# Create PR on GitHub
# After merge, clean up
git checkout main
git pull
git branch -d feature/new-button
\`\`\`

## Syncing Fork

\`\`\`bash
git remote add upstream https://github.com/original/repo.git
git fetch upstream
git merge upstream/main
\`\`\``,
        duration: 25,
        difficulty: 'beginner',
        type: 'lesson',
        isFree: true,
        tags: ['git', 'github', 'collaboration']
      }
    ]
  },

  'machine-learning': {
    'machine-learning-python': [
      {
        title: 'Introduction to Machine Learning',
        description: 'Understanding ML concepts and algorithms',
        content: `# Introduction to Machine Learning

## What is Machine Learning?

Machine Learning is a subset of AI that enables computers to learn from data without being explicitly programmed.

## Types of Machine Learning

### Supervised Learning
- Has labeled training data
- Examples: Classification, Regression
- Algorithms: Linear Regression, Decision Trees, SVM

### Unsupervised Learning
- No labeled data
- Examples: Clustering, Dimensionality Reduction
- Algorithms: K-Means, PCA, DBSCAN

### Reinforcement Learning
- Learns through rewards/penalties
- Examples: Game playing, Robotics
- Algorithms: Q-Learning, Policy Gradient

## ML Workflow

1. **Data Collection**: Gather relevant data
2. **Data Preprocessing**: Clean and prepare data
3. **Feature Engineering**: Select/create features
4. **Model Selection**: Choose algorithm
5. **Training**: Fit model to data
6. **Evaluation**: Test model performance
7. **Deployment**: Put model in production

## Python ML Stack

\`\`\`python
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
\`\`\``,
        duration: 25,
        difficulty: 'beginner',
        type: 'lesson',
        isFree: true,
        tags: ['machine-learning', 'ai', 'python']
      },
      {
        title: 'Data Preprocessing',
        description: 'Prepare data for machine learning models',
        content: `# Data Preprocessing

## Loading Data

\`\`\`python
import pandas as pd

# Load CSV
df = pd.read_csv('data.csv')

# Basic exploration
print(df.head())
print(df.info())
print(df.describe())
\`\`\`

## Handling Missing Values

\`\`\`python
# Check missing
print(df.isnull().sum())

# Drop rows with missing
df.dropna(inplace=True)

# Fill with mean/median
df['age'].fillna(df['age'].mean(), inplace=True)

# Fill with mode (categorical)
df['city'].fillna(df['city'].mode()[0], inplace=True)
\`\`\`

## Feature Scaling

\`\`\`python
from sklearn.preprocessing import StandardScaler, MinMaxScaler

# Standardization (mean=0, std=1)
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Normalization (0-1 range)
normalizer = MinMaxScaler()
X_normalized = normalizer.fit_transform(X)
\`\`\`

## Encoding Categorical Data

\`\`\`python
from sklearn.preprocessing import LabelEncoder, OneHotEncoder

# Label Encoding
le = LabelEncoder()
df['category'] = le.fit_transform(df['category'])

# One-Hot Encoding
df_encoded = pd.get_dummies(df, columns=['color'])
\`\`\`

## Train-Test Split

\`\`\`python
from sklearn.model_selection import train_test_split

X = df.drop('target', axis=1)
y = df['target']

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)
\`\`\``,
        duration: 30,
        difficulty: 'beginner',
        type: 'lesson',
        isFree: true,
        tags: ['machine-learning', 'preprocessing', 'pandas']
      },
      {
        title: 'Linear Regression',
        description: 'Build regression models with scikit-learn',
        content: `# Linear Regression

## Simple Linear Regression

\`\`\`python
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, r2_score

# Create model
model = LinearRegression()

# Train
model.fit(X_train, y_train)

# Predict
y_pred = model.predict(X_test)

# Evaluate
mse = mean_squared_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)
print(f'MSE: {mse:.4f}')
print(f'R²: {r2:.4f}')
\`\`\`

## Model Coefficients

\`\`\`python
# Intercept
print(f'Intercept: {model.intercept_}')

# Coefficients
for feature, coef in zip(X.columns, model.coef_):
    print(f'{feature}: {coef:.4f}')
\`\`\`

## Visualization

\`\`\`python
import matplotlib.pyplot as plt

# Actual vs Predicted
plt.scatter(y_test, y_pred, alpha=0.5)
plt.plot([y.min(), y.max()], [y.min(), y.max()], 'r--')
plt.xlabel('Actual')
plt.ylabel('Predicted')
plt.title('Linear Regression Results')
plt.show()
\`\`\`

## Polynomial Regression

\`\`\`python
from sklearn.preprocessing import PolynomialFeatures

# Create polynomial features
poly = PolynomialFeatures(degree=2)
X_poly = poly.fit_transform(X)

# Fit model
model = LinearRegression()
model.fit(X_poly, y)
\`\`\``,
        duration: 30,
        difficulty: 'intermediate',
        type: 'lesson',
        isFree: false,
        tags: ['machine-learning', 'regression', 'sklearn']
      }
    ]
  }
};

// Generate slug from title
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

async function seedMoreTopics() {
  try {
    console.log('\n📚 Seeding Additional Topics and Lessons...\n');

    let totalTopics = 0;

    // Get technologies and courses
    const technologies = await Technology.find({});
    const techMap = {};
    technologies.forEach(t => {
      techMap[t.slug] = t._id;
    });

    const courses = await Course.find({});
    const courseMap = {};
    courses.forEach(c => {
      courseMap[c.slug] = c;
    });

    // Process each technology
    for (const [techSlug, courseTopics] of Object.entries(additionalTopicsData)) {
      const techId = techMap[techSlug];
      
      if (!techId) {
        console.log(`  ⚠️ Technology not found: ${techSlug}`);
        continue;
      }

      console.log(`\n🔧 Processing ${techSlug}...`);

      // Process each course
      for (const [courseSlug, topics] of Object.entries(courseTopics)) {
        const course = courseMap[courseSlug];
        
        if (!course) {
          console.log(`  ⚠️ Course not found: ${courseSlug}`);
          continue;
        }

        console.log(`  📖 Course: ${course.title}`);

        // Get existing topic count for ordering
        const existingTopicCount = await Topic.countDocuments({ course: course._id });

        // Create topics for this course
        for (let i = 0; i < topics.length; i++) {
          const topicData = topics[i];
          const slug = generateSlug(topicData.title);

          // Check if topic exists
          let topic = await Topic.findOne({ slug, course: course._id });
          
          if (topic) {
            console.log(`    ✓ Topic exists: ${topicData.title}`);
          } else {
            topic = new Topic({
              title: topicData.title,
              slug,
              description: topicData.description,
              content: topicData.content,
              course: course._id,
              technology: techId,
              order: existingTopicCount + i,
              duration: topicData.duration,
              difficulty: topicData.difficulty,
              type: topicData.type,
              isFree: topicData.isFree,
              isPublished: true,
              tags: topicData.tags,
              codeExamples: []
            });

            await topic.save();
            console.log(`    ✅ Created topic: ${topicData.title}`);
            totalTopics++;
          }
        }
      }
    }

    // Update course counts
    console.log('\n📊 Updating course statistics...');
    for (const course of courses) {
      const topicCount = await Topic.countDocuments({ course: course._id });
      if (course.sections && course.sections.length > 0) {
        let lessonCount = 0;
        course.sections.forEach(section => {
          lessonCount += section.lessons ? section.lessons.length : 0;
        });
        course.sectionsCount = course.sections.length;
        course.lessonsCount = lessonCount;
        await course.save();
        console.log(`  ✓ ${course.title}: ${course.sectionsCount} sections, ${lessonCount} lessons, ${topicCount} topics`);
      }
    }

    console.log('\n' + '='.repeat(50));
    console.log(`✅ Seeding completed!`);
    console.log(`   📚 New topics created: ${totalTopics}`);
    console.log('='.repeat(50) + '\n');

  } catch (error) {
    console.error('❌ Seeding error:', error);
  } finally {
    mongoose.connection.close();
    console.log('🔌 MongoDB connection closed');
  }
}

// Run the seeder
seedMoreTopics();
