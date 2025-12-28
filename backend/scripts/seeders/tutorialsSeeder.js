/**
 * Tutorials Seeder
 * Seeds tutorial chapters with code examples and practice exercises
 */

const TutorialChapter = require('../../src/modules/tutorials/Tutorial');
const Technology = require('../../src/modules/technologies/Technology');

const getTutorials = (techMap) => [
  // Python Tutorials
  {
    technology: techMap['python'],
    title: 'Python Basics - Variables and Data Types',
    slug: 'python-basics-variables',
    order: 1,
    chapter: 1,
    isPublished: true,
    accessType: 'free',
    content: `
# Python Variables and Data Types

Python is a dynamically typed language, meaning you don't need to declare variable types explicitly.

## Creating Variables

In Python, variables are created when you assign a value to them:

\`\`\`python
# String variable
name = "TechTooTalk"

# Integer variable
age = 25

# Float variable
price = 19.99

# Boolean variable
is_active = True
\`\`\`

## Data Types

Python has several built-in data types:

1. **Strings** - Text data enclosed in quotes
2. **Integers** - Whole numbers
3. **Floats** - Decimal numbers
4. **Booleans** - True or False values
5. **Lists** - Ordered, mutable collections
6. **Tuples** - Ordered, immutable collections
7. **Dictionaries** - Key-value pairs
8. **Sets** - Unordered, unique elements

## Type Checking

Use the \`type()\` function to check a variable's type:

\`\`\`python
x = 10
print(type(x))  # <class 'int'>

y = "Hello"
print(type(y))  # <class 'str'>
\`\`\`
    `,
    codeExamples: [
      {
        title: 'Variable Declaration',
        language: 'python',
        code: `# Declaring different types of variables
name = "TechTooTalk"
age = 25
price = 19.99
is_student = True

# Multiple assignment
a, b, c = 1, 2, 3

# Same value to multiple variables
x = y = z = 0

print(f"Name: {name}, Age: {age}")`
      },
      {
        title: 'Type Conversion',
        language: 'python',
        code: `# Converting between types
num_str = "42"
num_int = int(num_str)  # String to integer

pi = 3.14159
pi_int = int(pi)  # Float to integer (3)

age = 25
age_str = str(age)  # Integer to string

print(f"Integer: {num_int}, Pi as int: {pi_int}")`
      }
    ],
    practiceExercises: [
      {
        question: 'Create a variable that stores your name and print it.',
        hint: 'Use a string data type with quotes.'
      },
      {
        question: 'Convert the string "100" to an integer and add 50 to it.',
        hint: 'Use the int() function for conversion.'
      }
    ]
  },
  {
    technology: techMap['python'],
    title: 'Python Control Flow - Conditionals',
    slug: 'python-control-flow-conditionals',
    order: 2,
    chapter: 2,
    isPublished: true,
    accessType: 'free',
    content: `
# Python Conditionals

Control flow allows your program to make decisions based on conditions.

## If Statement

\`\`\`python
age = 18

if age >= 18:
    print("You are an adult")
\`\`\`

## If-Else Statement

\`\`\`python
temperature = 25

if temperature > 30:
    print("It's hot!")
else:
    print("It's comfortable")
\`\`\`

## If-Elif-Else Chain

\`\`\`python
score = 85

if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
elif score >= 70:
    grade = "C"
else:
    grade = "F"

print(f"Your grade: {grade}")
\`\`\`

## Comparison Operators

- \`==\` Equal to
- \`!=\` Not equal to
- \`>\` Greater than
- \`<\` Less than
- \`>=\` Greater than or equal
- \`<=\` Less than or equal
    `,
    codeExamples: [
      {
        title: 'Nested Conditionals',
        language: 'python',
        code: `age = 25
has_license = True

if age >= 18:
    if has_license:
        print("You can drive!")
    else:
        print("Get a license first")
else:
    print("Too young to drive")`
      },
      {
        title: 'Logical Operators',
        language: 'python',
        code: `username = "admin"
password = "secret"

# Using 'and'
if username == "admin" and password == "secret":
    print("Login successful!")

# Using 'or'
day = "Saturday"
if day == "Saturday" or day == "Sunday":
    print("It's the weekend!")

# Using 'not'
is_raining = False
if not is_raining:
    print("No umbrella needed")`
      }
    ],
    practiceExercises: [
      {
        question: 'Write a program that checks if a number is positive, negative, or zero.',
        hint: 'Use if-elif-else with comparison operators.'
      }
    ]
  },
  {
    technology: techMap['python'],
    title: 'Python Loops - For and While',
    slug: 'python-loops',
    order: 3,
    chapter: 3,
    isPublished: true,
    accessType: 'free',
    content: `
# Python Loops

Loops allow you to execute code repeatedly.

## For Loop

\`\`\`python
# Loop through a list
fruits = ["apple", "banana", "cherry"]
for fruit in fruits:
    print(fruit)

# Loop with range
for i in range(5):
    print(i)  # 0, 1, 2, 3, 4
\`\`\`

## While Loop

\`\`\`python
count = 0
while count < 5:
    print(count)
    count += 1
\`\`\`

## Loop Control

- \`break\` - Exit the loop
- \`continue\` - Skip to next iteration
- \`pass\` - Do nothing (placeholder)
    `,
    codeExamples: [
      {
        title: 'Loop with Break and Continue',
        language: 'python',
        code: `# Break example
for i in range(10):
    if i == 5:
        break  # Exit loop at 5
    print(i)

# Continue example
for i in range(5):
    if i == 2:
        continue  # Skip 2
    print(i)  # 0, 1, 3, 4`
      },
      {
        title: 'Nested Loops',
        language: 'python',
        code: `# Multiplication table
for i in range(1, 4):
    for j in range(1, 4):
        print(f"{i} x {j} = {i*j}")
    print("---")`
      }
    ],
    practiceExercises: [
      {
        question: 'Write a loop that prints numbers 1-10 but skips 5.',
        hint: 'Use continue statement when i equals 5.'
      }
    ]
  },

  // JavaScript Tutorials
  {
    technology: techMap['javascript'],
    title: 'JavaScript Variables - let, const, var',
    slug: 'javascript-variables',
    order: 1,
    chapter: 1,
    isPublished: true,
    accessType: 'free',
    content: `
# JavaScript Variables

JavaScript has three ways to declare variables: \`let\`, \`const\`, and \`var\`.

## let

Block-scoped, can be reassigned:

\`\`\`javascript
let age = 25;
age = 26;  // OK - can reassign
\`\`\`

## const

Block-scoped, cannot be reassigned:

\`\`\`javascript
const PI = 3.14159;
// PI = 3.14;  // Error - cannot reassign

// But objects can be mutated
const user = { name: "John" };
user.name = "Jane";  // OK - mutating, not reassigning
\`\`\`

## var (Legacy)

Function-scoped, avoid in modern code:

\`\`\`javascript
var oldWay = "avoid this";
\`\`\`

## Best Practices

1. Use \`const\` by default
2. Use \`let\` when you need to reassign
3. Avoid \`var\` in modern JavaScript
    `,
    codeExamples: [
      {
        title: 'Variable Scope',
        language: 'javascript',
        code: `// Block scope with let
if (true) {
  let blockScoped = "inside block";
  console.log(blockScoped);  // Works
}
// console.log(blockScoped);  // Error - not defined

// const for constants
const API_URL = "https://api.example.com";
const CONFIG = {
  theme: "dark",
  language: "en"
};

// Mutating const object is allowed
CONFIG.theme = "light";  // OK`
      }
    ],
    practiceExercises: [
      {
        question: 'Declare a constant for your birth year and a let variable for your age. Why use different keywords?',
        hint: 'Birth year never changes, but age does each year.'
      }
    ]
  },
  {
    technology: techMap['javascript'],
    title: 'JavaScript Functions - Modern Syntax',
    slug: 'javascript-functions-modern',
    order: 2,
    chapter: 2,
    isPublished: true,
    accessType: 'free',
    content: `
# JavaScript Functions

Functions are reusable blocks of code.

## Function Declaration

\`\`\`javascript
function greet(name) {
  return \`Hello, \${name}!\`;
}
\`\`\`

## Function Expression

\`\`\`javascript
const greet = function(name) {
  return \`Hello, \${name}!\`;
};
\`\`\`

## Arrow Functions (ES6+)

\`\`\`javascript
const greet = (name) => \`Hello, \${name}!\`;

// Multiple lines
const calculate = (a, b) => {
  const sum = a + b;
  return sum * 2;
};
\`\`\`

## Default Parameters

\`\`\`javascript
const greet = (name = "Guest") => \`Hello, \${name}!\`;
greet();  // "Hello, Guest!"
\`\`\`
    `,
    codeExamples: [
      {
        title: 'Arrow Functions',
        language: 'javascript',
        code: `// Single parameter - parentheses optional
const double = n => n * 2;

// Multiple parameters
const add = (a, b) => a + b;

// With array methods
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);
const evens = numbers.filter(n => n % 2 === 0);

console.log(doubled);  // [2, 4, 6, 8, 10]
console.log(evens);    // [2, 4]`
      },
      {
        title: 'Higher-Order Functions',
        language: 'javascript',
        code: `// Function that returns a function
const createMultiplier = (factor) => {
  return (number) => number * factor;
};

const double = createMultiplier(2);
const triple = createMultiplier(3);

console.log(double(5));  // 10
console.log(triple(5));  // 15`
      }
    ],
    practiceExercises: [
      {
        question: 'Convert this function to an arrow function: function square(n) { return n * n; }',
        hint: 'Arrow functions can have implicit returns for single expressions.'
      }
    ]
  },
  {
    technology: techMap['javascript'],
    title: 'JavaScript Async/Await',
    slug: 'javascript-async-await',
    order: 3,
    chapter: 3,
    isPublished: true,
    accessType: 'mixed',
    content: `
# Async/Await in JavaScript

Async/await makes asynchronous code look synchronous.

## Async Functions

\`\`\`javascript
async function fetchData() {
  const response = await fetch('https://api.example.com/data');
  const data = await response.json();
  return data;
}
\`\`\`

## Error Handling

\`\`\`javascript
async function fetchData() {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}
\`\`\`

## Parallel Execution

\`\`\`javascript
// Run promises in parallel
const [users, posts] = await Promise.all([
  fetch('/api/users').then(r => r.json()),
  fetch('/api/posts').then(r => r.json())
]);
\`\`\`
    `,
    codeExamples: [
      {
        title: 'Fetching Data',
        language: 'javascript',
        code: `async function getUser(id) {
  try {
    const response = await fetch(\`/api/users/\${id}\`);
    
    if (!response.ok) {
      throw new Error('User not found');
    }
    
    const user = await response.json();
    return user;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    return null;
  }
}

// Usage
const user = await getUser(123);
if (user) {
  console.log(user.name);
}`
      }
    ],
    practiceExercises: [
      {
        question: 'Write an async function that fetches data from two URLs in parallel.',
        hint: 'Use Promise.all with await.'
      }
    ]
  },

  // React Tutorials
  {
    technology: techMap['react'],
    title: 'React Components and JSX',
    slug: 'react-components-jsx',
    order: 1,
    chapter: 1,
    isPublished: true,
    accessType: 'free',
    content: `
# React Components and JSX

React uses a component-based architecture with JSX syntax.

## Functional Components

\`\`\`jsx
function Welcome({ name }) {
  return <h1>Hello, {name}!</h1>;
}
\`\`\`

## JSX Rules

1. Return a single root element
2. Close all tags
3. Use camelCase for attributes
4. Use curly braces for JavaScript

## Component Composition

\`\`\`jsx
function App() {
  return (
    <div>
      <Header />
      <Main />
      <Footer />
    </div>
  );
}
\`\`\`
    `,
    codeExamples: [
      {
        title: 'Functional Component with Props',
        language: 'jsx',
        code: `function UserCard({ user }) {
  return (
    <div className="user-card">
      <img src={user.avatar} alt={user.name} />
      <h2>{user.name}</h2>
      <p>{user.bio}</p>
      <span className="role">{user.role}</span>
    </div>
  );
}

// Usage
<UserCard user={{
  name: "John Doe",
  avatar: "/avatars/john.jpg",
  bio: "Full-stack developer",
  role: "Admin"
}} />`
      }
    ],
    practiceExercises: [
      {
        question: 'Create a Button component that accepts text and onClick props.',
        hint: 'Destructure props in the function parameters.'
      }
    ]
  },
  {
    technology: techMap['react'],
    title: 'React useState Hook',
    slug: 'react-usestate-hook',
    order: 2,
    chapter: 2,
    isPublished: true,
    accessType: 'free',
    content: `
# React useState Hook

The useState hook lets you add state to functional components.

## Basic Usage

\`\`\`jsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
}
\`\`\`

## State with Objects

\`\`\`jsx
const [user, setUser] = useState({
  name: '',
  email: ''
});

// Update specific field
setUser(prev => ({
  ...prev,
  name: 'John'
}));
\`\`\`
    `,
    codeExamples: [
      {
        title: 'Form with useState',
        language: 'jsx',
        code: `function LoginForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Submit logic here
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
      />
      <input
        name="password"
        type="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Password"
      />
      <button disabled={isSubmitting}>
        {isSubmitting ? 'Loading...' : 'Login'}
      </button>
    </form>
  );
}`
      }
    ],
    practiceExercises: [
      {
        question: 'Create a toggle switch component that alternates between On and Off states.',
        hint: 'Use useState with a boolean and toggle it with setIsOn(!isOn).'
      }
    ]
  },

  // Node.js Tutorials
  {
    technology: techMap['nodejs'],
    title: 'Node.js Express Server Setup',
    slug: 'nodejs-express-server',
    order: 1,
    chapter: 1,
    isPublished: true,
    accessType: 'free',
    content: `
# Setting Up Express Server

Express is a minimal web framework for Node.js.

## Basic Server

\`\`\`javascript
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
\`\`\`

## Middleware

\`\`\`javascript
// Parse JSON bodies
app.use(express.json());

// Custom middleware
app.use((req, res, next) => {
  console.log(\`\${req.method} \${req.path}\`);
  next();
});
\`\`\`
    `,
    codeExamples: [
      {
        title: 'Complete Express Setup',
        language: 'javascript',
        code: `const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/api/users', (req, res) => {
  res.json([
    { id: 1, name: 'John' },
    { id: 2, name: 'Jane' }
  ]);
});

app.post('/api/users', (req, res) => {
  const { name, email } = req.body;
  // Create user logic
  res.status(201).json({ id: 3, name, email });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});`
      }
    ],
    practiceExercises: [
      {
        question: 'Create a route that returns a list of products as JSON.',
        hint: 'Use app.get() and res.json() with an array of product objects.'
      }
    ]
  },

  // SQL Tutorials
  {
    technology: techMap['sql'],
    title: 'SQL SELECT Fundamentals',
    slug: 'sql-select-fundamentals',
    order: 1,
    chapter: 1,
    isPublished: true,
    accessType: 'free',
    content: `
# SQL SELECT Statement

The SELECT statement retrieves data from a database.

## Basic SELECT

\`\`\`sql
SELECT * FROM users;
SELECT name, email FROM users;
\`\`\`

## WHERE Clause

\`\`\`sql
SELECT * FROM users WHERE age > 18;
SELECT * FROM products WHERE price BETWEEN 10 AND 50;
\`\`\`

## ORDER BY

\`\`\`sql
SELECT * FROM users ORDER BY name ASC;
SELECT * FROM products ORDER BY price DESC;
\`\`\`
    `,
    codeExamples: [
      {
        title: 'Common SELECT Patterns',
        language: 'sql',
        code: `-- Select specific columns
SELECT first_name, last_name, email
FROM users
WHERE status = 'active';

-- Multiple conditions
SELECT *
FROM products
WHERE category = 'Electronics'
  AND price < 1000
  AND in_stock = true;

-- Pattern matching
SELECT *
FROM users
WHERE email LIKE '%@gmail.com';

-- Limiting results
SELECT *
FROM orders
ORDER BY created_at DESC
LIMIT 10;`
      }
    ],
    practiceExercises: [
      {
        question: 'Write a query to find all users whose name starts with "J" and are older than 25.',
        hint: 'Use LIKE with wildcard and AND for multiple conditions.'
      }
    ]
  },

  // Docker Tutorials
  {
    technology: techMap['docker'],
    title: 'Docker Basics - Containers and Images',
    slug: 'docker-basics',
    order: 1,
    chapter: 1,
    isPublished: true,
    accessType: 'free',
    content: `
# Docker Basics

Docker packages applications into containers.

## Key Concepts

- **Image**: Blueprint for containers (like a class)
- **Container**: Running instance of an image (like an object)
- **Dockerfile**: Instructions to build an image

## Basic Commands

\`\`\`bash
# Pull an image
docker pull node:18

# Run a container
docker run -d -p 3000:3000 my-app

# List containers
docker ps

# Stop a container
docker stop <container-id>
\`\`\`
    `,
    codeExamples: [
      {
        title: 'Node.js Dockerfile',
        language: 'dockerfile',
        code: `# Base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Expose port
EXPOSE 3000

# Start command
CMD ["node", "server.js"]`
      },
      {
        title: 'Docker Compose',
        language: 'yaml',
        code: `version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=mongodb://mongo:27017/mydb
    depends_on:
      - mongo
  
  mongo:
    image: mongo:6
    volumes:
      - mongo-data:/data/db

volumes:
  mongo-data:`
      }
    ],
    practiceExercises: [
      {
        question: 'Write a Dockerfile for a Python Flask application.',
        hint: 'Use python:3.11-slim as base and pip install -r requirements.txt.'
      }
    ]
  },

  // Git Tutorial
  {
    technology: techMap['git'],
    title: 'Git Essentials - Commits and Branches',
    slug: 'git-essentials',
    order: 1,
    chapter: 1,
    isPublished: true,
    accessType: 'free',
    content: `
# Git Essentials

Git is a distributed version control system.

## Basic Workflow

\`\`\`bash
# Initialize repository
git init

# Check status
git status

# Stage changes
git add .

# Commit changes
git commit -m "Your message"
\`\`\`

## Branching

\`\`\`bash
# Create branch
git branch feature-name

# Switch branch
git checkout feature-name

# Or create and switch
git checkout -b feature-name
\`\`\`
    `,
    codeExamples: [
      {
        title: 'Complete Git Workflow',
        language: 'bash',
        code: `# Start a new feature
git checkout -b feature/user-auth

# Make changes and commit
git add .
git commit -m "Add user authentication"

# Push to remote
git push -u origin feature/user-auth

# After review, merge to main
git checkout main
git pull origin main
git merge feature/user-auth
git push origin main

# Delete feature branch
git branch -d feature/user-auth
git push origin --delete feature/user-auth`
      }
    ],
    practiceExercises: [
      {
        question: 'Create a new branch called "feature/login" and make a commit on it.',
        hint: 'Use git checkout -b to create and switch to the branch.'
      }
    ]
  },

  // Machine Learning Tutorial
  {
    technology: techMap['machine-learning'],
    title: 'Machine Learning - Getting Started with Scikit-learn',
    slug: 'ml-scikit-learn-intro',
    order: 1,
    chapter: 1,
    isPublished: true,
    accessType: 'mixed',
    content: `
# Getting Started with Scikit-learn

Scikit-learn is Python's premier machine learning library.

## Basic Workflow

1. Load data
2. Preprocess data
3. Split into train/test sets
4. Train model
5. Evaluate model
6. Make predictions

## Example: Classification

\`\`\`python
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score

# Load data
iris = load_iris()
X, y = iris.data, iris.target

# Split data
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Train model
model = RandomForestClassifier()
model.fit(X_train, y_train)

# Evaluate
predictions = model.predict(X_test)
accuracy = accuracy_score(y_test, predictions)
print(f"Accuracy: {accuracy:.2f}")
\`\`\`
    `,
    codeExamples: [
      {
        title: 'Complete ML Pipeline',
        language: 'python',
        code: `import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report

# Load data
df = pd.read_csv('data.csv')

# Features and target
X = df.drop('target', axis=1)
y = df['target']

# Split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Scale features
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Train
model = RandomForestClassifier(n_estimators=100)
model.fit(X_train_scaled, y_train)

# Evaluate
y_pred = model.predict(X_test_scaled)
print(classification_report(y_test, y_pred))`
      }
    ],
    practiceExercises: [
      {
        question: 'Train a logistic regression model on the iris dataset and calculate accuracy.',
        hint: 'Import LogisticRegression from sklearn.linear_model.'
      }
    ]
  },

  // Tailwind CSS Tutorial
  {
    technology: techMap['tailwindcss'],
    title: 'Tailwind CSS Fundamentals',
    slug: 'tailwind-css-fundamentals',
    order: 1,
    chapter: 1,
    isPublished: true,
    accessType: 'free',
    content: `
# Tailwind CSS Fundamentals

Tailwind CSS is a utility-first CSS framework.

## Utility Classes

Instead of writing CSS, you use pre-built classes:

\`\`\`html
<button class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
  Click me
</button>
\`\`\`

## Common Utilities

- **Spacing**: p-4, m-2, px-6, my-8
- **Colors**: bg-red-500, text-gray-700
- **Typography**: text-lg, font-bold
- **Flexbox**: flex, justify-center, items-center
- **Responsive**: sm:, md:, lg:, xl:
    `,
    codeExamples: [
      {
        title: 'Card Component',
        language: 'html',
        code: `<div class="max-w-sm rounded-lg shadow-lg overflow-hidden bg-white dark:bg-gray-800">
  <img class="w-full h-48 object-cover" src="image.jpg" alt="Card image">
  <div class="p-6">
    <h2 class="text-xl font-bold text-gray-800 dark:text-white mb-2">
      Card Title
    </h2>
    <p class="text-gray-600 dark:text-gray-300 mb-4">
      Card description goes here with some helpful text.
    </p>
    <button class="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors">
      Learn More
    </button>
  </div>
</div>`
      },
      {
        title: 'Responsive Grid',
        language: 'html',
        code: `<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
  <div class="bg-white p-4 rounded-lg shadow">Item 1</div>
  <div class="bg-white p-4 rounded-lg shadow">Item 2</div>
  <div class="bg-white p-4 rounded-lg shadow">Item 3</div>
  <div class="bg-white p-4 rounded-lg shadow">Item 4</div>
  <div class="bg-white p-4 rounded-lg shadow">Item 5</div>
  <div class="bg-white p-4 rounded-lg shadow">Item 6</div>
</div>`
      }
    ],
    practiceExercises: [
      {
        question: 'Create a responsive navigation bar with Tailwind.',
        hint: 'Use flex, justify-between, items-center and responsive classes.'
      }
    ]
  }
];

async function seedTutorials() {
  try {
    console.log('📖 Seeding Tutorials...');
    
    // Get all technologies
    const technologies = await Technology.find({});
    const techMap = {};
    for (const tech of technologies) {
      techMap[tech.slug] = tech._id;
    }
    
    if (Object.keys(techMap).length === 0) {
      console.warn('⚠️  No technologies found. Please run technology seeder first.');
      return [];
    }
    
    // Clear existing tutorials
    await TutorialChapter.deleteMany({});
    
    // Get tutorials with references
    const tutorials = getTutorials(techMap);
    
    // Filter out tutorials with missing technology references
    const validTutorials = tutorials.filter(tutorial => tutorial.technology);
    
    // Insert new tutorials
    const result = await TutorialChapter.insertMany(validTutorials);
    
    console.log(`✅ Seeded ${result.length} tutorial chapters`);
    return result;
  } catch (error) {
    console.error('❌ Error seeding tutorials:', error.message);
    throw error;
  }
}

module.exports = { seedTutorials, getTutorials };
