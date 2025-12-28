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

// Topic data organized by technology and course
const topicsData = {
  // JavaScript related topics
  'javascript': {
    'javascript-fundamentals-advanced': [
      {
        title: 'Introduction to JavaScript',
        description: 'Learn what JavaScript is and why it\'s essential for web development',
        content: `# Introduction to JavaScript

JavaScript is a powerful programming language that runs in the browser and server.

## What is JavaScript?

JavaScript is a high-level, interpreted programming language that was created in 1995 by Brendan Eich. It's the language of the web and is essential for creating interactive websites.

## Why Learn JavaScript?

- It's the only language that runs natively in browsers
- Used by 97% of all websites
- Full-stack development with Node.js
- Large ecosystem of libraries and frameworks

## Your First JavaScript Code

\`\`\`javascript
console.log("Hello, World!");

// Variables
let name = "John";
const age = 25;

// Functions
function greet(name) {
  return \`Hello, \${name}!\`;
}

console.log(greet(name));
\`\`\`

## JavaScript in HTML

\`\`\`html
<!DOCTYPE html>
<html>
<head>
  <title>My First JS</title>
</head>
<body>
  <script>
    alert("JavaScript is running!");
  </script>
</body>
</html>
\`\`\``,
        duration: 15,
        difficulty: 'beginner',
        type: 'lesson',
        isFree: true,
        tags: ['javascript', 'basics', 'introduction']
      },
      {
        title: 'Variables and Data Types',
        description: 'Understanding variables, constants, and primitive data types in JavaScript',
        content: `# Variables and Data Types

## Declaring Variables

JavaScript has three ways to declare variables:

### var (Old way)
\`\`\`javascript
var name = "John";
var age = 25;
\`\`\`

### let (Modern way for reassignable variables)
\`\`\`javascript
let count = 0;
count = 1; // Can be reassigned
\`\`\`

### const (For constants)
\`\`\`javascript
const PI = 3.14159;
// PI = 3.14; // Error! Cannot reassign
\`\`\`

## Data Types

### Primitive Types

1. **String** - Text data
\`\`\`javascript
let greeting = "Hello";
let name = 'World';
let template = \`Hello \${name}\`;
\`\`\`

2. **Number** - Numeric values
\`\`\`javascript
let integer = 42;
let decimal = 3.14;
let negative = -100;
\`\`\`

3. **Boolean** - true/false
\`\`\`javascript
let isActive = true;
let isLoggedIn = false;
\`\`\`

4. **undefined** - Unassigned value
\`\`\`javascript
let notDefined;
console.log(notDefined); // undefined
\`\`\`

5. **null** - Intentional absence of value
\`\`\`javascript
let empty = null;
\`\`\`

## Type Checking
\`\`\`javascript
console.log(typeof "hello"); // "string"
console.log(typeof 42);      // "number"
console.log(typeof true);    // "boolean"
\`\`\``,
        duration: 20,
        difficulty: 'beginner',
        type: 'lesson',
        isFree: true,
        tags: ['javascript', 'variables', 'data-types']
      },
      {
        title: 'Functions in JavaScript',
        description: 'Learn how to create and use functions effectively',
        content: `# Functions in JavaScript

Functions are reusable blocks of code that perform specific tasks.

## Function Declaration
\`\`\`javascript
function greet(name) {
  return "Hello, " + name + "!";
}

console.log(greet("Alice")); // "Hello, Alice!"
\`\`\`

## Function Expression
\`\`\`javascript
const add = function(a, b) {
  return a + b;
};

console.log(add(2, 3)); // 5
\`\`\`

## Arrow Functions (ES6)
\`\`\`javascript
const multiply = (a, b) => a * b;

const greet = name => \`Hello, \${name}!\`;

const getUser = () => ({
  name: "John",
  age: 25
});
\`\`\`

## Default Parameters
\`\`\`javascript
function greet(name = "Guest") {
  return \`Hello, \${name}!\`;
}

console.log(greet());      // "Hello, Guest!"
console.log(greet("Bob")); // "Hello, Bob!"
\`\`\`

## Rest Parameters
\`\`\`javascript
function sum(...numbers) {
  return numbers.reduce((a, b) => a + b, 0);
}

console.log(sum(1, 2, 3, 4)); // 10
\`\`\`

## Callback Functions
\`\`\`javascript
function fetchData(callback) {
  setTimeout(() => {
    callback("Data loaded!");
  }, 1000);
}

fetchData(data => console.log(data));
\`\`\``,
        duration: 25,
        difficulty: 'beginner',
        type: 'lesson',
        isFree: true,
        tags: ['javascript', 'functions', 'basics']
      },
      {
        title: 'Arrays and Array Methods',
        description: 'Master JavaScript arrays and common array manipulation methods',
        content: `# Arrays and Array Methods

## Creating Arrays
\`\`\`javascript
const fruits = ["apple", "banana", "orange"];
const numbers = [1, 2, 3, 4, 5];
const mixed = [1, "two", true, null];
\`\`\`

## Accessing Elements
\`\`\`javascript
console.log(fruits[0]); // "apple"
console.log(fruits[fruits.length - 1]); // "orange"
\`\`\`

## Common Array Methods

### map() - Transform each element
\`\`\`javascript
const doubled = numbers.map(n => n * 2);
// [2, 4, 6, 8, 10]
\`\`\`

### filter() - Keep matching elements
\`\`\`javascript
const evens = numbers.filter(n => n % 2 === 0);
// [2, 4]
\`\`\`

### reduce() - Combine to single value
\`\`\`javascript
const sum = numbers.reduce((acc, n) => acc + n, 0);
// 15
\`\`\`

### find() - Find first match
\`\`\`javascript
const found = numbers.find(n => n > 3);
// 4
\`\`\`

### some() / every()
\`\`\`javascript
numbers.some(n => n > 4);  // true
numbers.every(n => n > 0); // true
\`\`\`

### push, pop, shift, unshift
\`\`\`javascript
fruits.push("grape");    // Add to end
fruits.pop();            // Remove from end
fruits.unshift("mango"); // Add to start
fruits.shift();          // Remove from start
\`\`\`

### slice() vs splice()
\`\`\`javascript
// slice - returns new array (non-mutating)
const sliced = fruits.slice(1, 3);

// splice - modifies original array
fruits.splice(1, 1, "kiwi");
\`\`\``,
        duration: 30,
        difficulty: 'beginner',
        type: 'lesson',
        isFree: true,
        tags: ['javascript', 'arrays', 'methods']
      },
      {
        title: 'Objects and Object Methods',
        description: 'Learn to work with JavaScript objects and their methods',
        content: `# Objects in JavaScript

## Creating Objects
\`\`\`javascript
const person = {
  name: "John",
  age: 30,
  city: "New York",
  greet() {
    return \`Hello, I'm \${this.name}\`;
  }
};
\`\`\`

## Accessing Properties
\`\`\`javascript
console.log(person.name);      // Dot notation
console.log(person["age"]);    // Bracket notation

const key = "city";
console.log(person[key]);      // Dynamic access
\`\`\`

## Object Methods

### Object.keys()
\`\`\`javascript
const keys = Object.keys(person);
// ["name", "age", "city", "greet"]
\`\`\`

### Object.values()
\`\`\`javascript
const values = Object.values(person);
// ["John", 30, "New York", ƒ]
\`\`\`

### Object.entries()
\`\`\`javascript
const entries = Object.entries(person);
// [["name", "John"], ["age", 30], ...]
\`\`\`

### Object.assign() / Spread
\`\`\`javascript
const clone = Object.assign({}, person);
const clone2 = { ...person };
\`\`\`

## Destructuring
\`\`\`javascript
const { name, age } = person;
console.log(name); // "John"

// With renaming
const { name: userName } = person;

// With defaults
const { country = "USA" } = person;
\`\`\`

## Optional Chaining
\`\`\`javascript
const user = { profile: { name: "John" } };
console.log(user?.profile?.name); // "John"
console.log(user?.settings?.theme); // undefined
\`\`\``,
        duration: 25,
        difficulty: 'beginner',
        type: 'lesson',
        isFree: false,
        tags: ['javascript', 'objects', 'methods']
      }
    ]
  },
  
  // Python related topics
  'python': {
    'python-complete-masterclass': [
      {
        title: 'Getting Started with Python',
        description: 'Your first steps into Python programming',
        content: `# Getting Started with Python

## What is Python?

Python is a high-level, interpreted programming language known for its simplicity and readability.

## Installing Python

1. Visit python.org
2. Download Python 3.x
3. Run the installer
4. Verify installation:

\`\`\`bash
python --version
# Python 3.11.x
\`\`\`

## Your First Python Program

\`\`\`python
# hello.py
print("Hello, Python!")

# Variables
name = "Alice"
age = 25

print(f"My name is {name} and I'm {age} years old")
\`\`\`

## Running Python

\`\`\`bash
python hello.py
\`\`\`

## Python Interactive Shell

\`\`\`python
>>> 2 + 2
4
>>> "Hello" + " World"
'Hello World'
>>> len("Python")
6
\`\`\`

## Comments

\`\`\`python
# This is a single-line comment

"""
This is a
multi-line comment
(docstring)
"""
\`\`\``,
        duration: 15,
        difficulty: 'beginner',
        type: 'lesson',
        isFree: true,
        tags: ['python', 'basics', 'introduction']
      },
      {
        title: 'Python Data Types',
        description: 'Understanding variables and data types in Python',
        content: `# Python Data Types

## Basic Data Types

### Numbers
\`\`\`python
# Integer
age = 25
count = -10

# Float
price = 19.99
pi = 3.14159

# Complex
z = 3 + 4j
\`\`\`

### Strings
\`\`\`python
name = "Python"
message = 'Hello, World!'
multiline = """This is a
multiline string"""

# String operations
print(len(name))        # 6
print(name.upper())     # PYTHON
print(name[0])          # P
print(name[1:4])        # yth
\`\`\`

### Booleans
\`\`\`python
is_active = True
is_admin = False

print(10 > 5)   # True
print(5 == 3)   # False
\`\`\`

### None
\`\`\`python
result = None

if result is None:
    print("No result yet")
\`\`\`

## Type Checking
\`\`\`python
print(type(42))        # <class 'int'>
print(type(3.14))      # <class 'float'>
print(type("hello"))   # <class 'str'>
print(type(True))      # <class 'bool'>

# Type conversion
int("42")      # 42
str(123)       # "123"
float("3.14")  # 3.14
\`\`\``,
        duration: 20,
        difficulty: 'beginner',
        type: 'lesson',
        isFree: true,
        tags: ['python', 'data-types', 'variables']
      },
      {
        title: 'Python Lists and Tuples',
        description: 'Working with sequences in Python',
        content: `# Lists and Tuples

## Lists (Mutable)

\`\`\`python
fruits = ["apple", "banana", "orange"]
numbers = [1, 2, 3, 4, 5]
mixed = [1, "two", True, None]
\`\`\`

### List Operations
\`\`\`python
# Accessing elements
print(fruits[0])     # apple
print(fruits[-1])    # orange
print(fruits[1:3])   # ['banana', 'orange']

# Modifying
fruits[0] = "mango"
fruits.append("grape")
fruits.insert(1, "kiwi")
fruits.remove("banana")
fruits.pop()         # Remove last

# List methods
fruits.sort()
fruits.reverse()
len(fruits)
\`\`\`

### List Comprehensions
\`\`\`python
# Create list from expression
squares = [x**2 for x in range(10)]
# [0, 1, 4, 9, 16, 25, 36, 49, 64, 81]

evens = [x for x in range(20) if x % 2 == 0]
# [0, 2, 4, 6, 8, 10, 12, 14, 16, 18]
\`\`\`

## Tuples (Immutable)

\`\`\`python
coordinates = (10, 20)
rgb = (255, 128, 0)

# Tuple unpacking
x, y = coordinates

# Can't modify
# coordinates[0] = 5  # Error!
\`\`\`

## When to Use Each

- **Lists**: When you need to modify the collection
- **Tuples**: For fixed data (coordinates, RGB values)`,
        duration: 25,
        difficulty: 'beginner',
        type: 'lesson',
        isFree: true,
        tags: ['python', 'lists', 'tuples', 'sequences']
      },
      {
        title: 'Python Dictionaries',
        description: 'Master Python dictionaries for key-value data',
        content: `# Python Dictionaries

## Creating Dictionaries

\`\`\`python
person = {
    "name": "John",
    "age": 30,
    "city": "New York"
}

# Alternative syntax
person = dict(name="John", age=30, city="New York")
\`\`\`

## Accessing Values

\`\`\`python
print(person["name"])     # John
print(person.get("age"))  # 30
print(person.get("job", "Unknown"))  # Unknown (default)
\`\`\`

## Modifying Dictionaries

\`\`\`python
# Add/Update
person["email"] = "john@example.com"
person["age"] = 31

# Remove
del person["city"]
email = person.pop("email")

# Update multiple
person.update({"age": 32, "job": "Developer"})
\`\`\`

## Dictionary Methods

\`\`\`python
# Keys, values, items
person.keys()    # dict_keys(['name', 'age'])
person.values()  # dict_values(['John', 32])
person.items()   # dict_items([('name', 'John'), ...])
\`\`\`

## Iterating

\`\`\`python
# Iterate keys
for key in person:
    print(key)

# Iterate items
for key, value in person.items():
    print(f"{key}: {value}")
\`\`\`

## Dictionary Comprehension

\`\`\`python
squares = {x: x**2 for x in range(6)}
# {0: 0, 1: 1, 2: 4, 3: 9, 4: 16, 5: 25}
\`\`\``,
        duration: 25,
        difficulty: 'beginner',
        type: 'lesson',
        isFree: false,
        tags: ['python', 'dictionaries', 'data-structures']
      },
      {
        title: 'Python Functions',
        description: 'Create reusable code with Python functions',
        content: `# Python Functions

## Basic Function

\`\`\`python
def greet(name):
    return f"Hello, {name}!"

message = greet("Alice")
print(message)  # Hello, Alice!
\`\`\`

## Default Parameters

\`\`\`python
def greet(name, greeting="Hello"):
    return f"{greeting}, {name}!"

print(greet("Bob"))           # Hello, Bob!
print(greet("Bob", "Hi"))     # Hi, Bob!
\`\`\`

## Multiple Return Values

\`\`\`python
def get_user():
    return "John", 30, "john@email.com"

name, age, email = get_user()
\`\`\`

## *args and **kwargs

\`\`\`python
# Variable positional arguments
def sum_all(*numbers):
    return sum(numbers)

print(sum_all(1, 2, 3, 4))  # 10

# Variable keyword arguments
def print_info(**kwargs):
    for key, value in kwargs.items():
        print(f"{key}: {value}")

print_info(name="John", age=30)
\`\`\`

## Lambda Functions

\`\`\`python
# Anonymous functions
square = lambda x: x**2
add = lambda a, b: a + b

print(square(5))    # 25
print(add(2, 3))    # 5

# With built-in functions
numbers = [3, 1, 4, 1, 5, 9]
sorted_nums = sorted(numbers, key=lambda x: -x)
# [9, 5, 4, 3, 1, 1]
\`\`\`

## Docstrings

\`\`\`python
def calculate_area(radius):
    """
    Calculate the area of a circle.
    
    Args:
        radius: The radius of the circle
        
    Returns:
        The area of the circle
    """
    import math
    return math.pi * radius ** 2
\`\`\``,
        duration: 30,
        difficulty: 'beginner',
        type: 'lesson',
        isFree: false,
        tags: ['python', 'functions', 'basics']
      }
    ]
  },

  // React related topics
  'react': {
    'react-complete-guide': [
      {
        title: 'Introduction to React',
        description: 'Learn what React is and why it\'s popular',
        content: `# Introduction to React

## What is React?

React is a JavaScript library for building user interfaces, developed by Facebook.

## Why React?

- **Component-Based**: Build encapsulated components
- **Declarative**: Design views for each state
- **Virtual DOM**: Efficient updates and rendering
- **Large Ecosystem**: Rich tooling and libraries

## Setting Up React

\`\`\`bash
# Create a new React app
npx create-react-app my-app
cd my-app
npm start
\`\`\`

Or with Vite (faster):
\`\`\`bash
npm create vite@latest my-app -- --template react
cd my-app
npm install
npm run dev
\`\`\`

## Your First Component

\`\`\`jsx
// App.jsx
function App() {
  return (
    <div>
      <h1>Hello, React!</h1>
      <p>Welcome to React development</p>
    </div>
  );
}

export default App;
\`\`\`

## JSX Syntax

\`\`\`jsx
// JSX allows HTML-like syntax in JavaScript
const element = <h1>Hello, World!</h1>;

// With expressions
const name = "John";
const greeting = <h1>Hello, {name}!</h1>;

// With attributes
const link = <a href="https://react.dev">React Docs</a>;
\`\`\``,
        duration: 20,
        difficulty: 'beginner',
        type: 'lesson',
        isFree: true,
        tags: ['react', 'introduction', 'basics']
      },
      {
        title: 'Components and Props',
        description: 'Building reusable components with props',
        content: `# Components and Props

## Function Components

\`\`\`jsx
function Welcome(props) {
  return <h1>Hello, {props.name}!</h1>;
}

// Usage
<Welcome name="Alice" />
\`\`\`

## Destructuring Props

\`\`\`jsx
function UserCard({ name, email, avatar }) {
  return (
    <div className="card">
      <img src={avatar} alt={name} />
      <h2>{name}</h2>
      <p>{email}</p>
    </div>
  );
}

// Usage
<UserCard 
  name="John Doe"
  email="john@example.com"
  avatar="/john.jpg"
/>
\`\`\`

## Default Props

\`\`\`jsx
function Button({ text = "Click Me", onClick }) {
  return <button onClick={onClick}>{text}</button>;
}
\`\`\`

## Children Prop

\`\`\`jsx
function Card({ title, children }) {
  return (
    <div className="card">
      <h2>{title}</h2>
      <div className="card-body">
        {children}
      </div>
    </div>
  );
}

// Usage
<Card title="My Card">
  <p>This is the card content</p>
  <button>Learn More</button>
</Card>
\`\`\`

## Prop Types

\`\`\`jsx
import PropTypes from 'prop-types';

function User({ name, age, isAdmin }) {
  return <div>{name} ({age})</div>;
}

User.propTypes = {
  name: PropTypes.string.isRequired,
  age: PropTypes.number,
  isAdmin: PropTypes.bool
};
\`\`\``,
        duration: 25,
        difficulty: 'beginner',
        type: 'lesson',
        isFree: true,
        tags: ['react', 'components', 'props']
      },
      {
        title: 'State with useState',
        description: 'Managing component state with React hooks',
        content: `# State with useState

## What is State?

State is data that changes over time in your component.

## Using useState

\`\`\`jsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}
\`\`\`

## Multiple State Variables

\`\`\`jsx
function Form() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <form>
      <input 
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <input 
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
    </form>
  );
}
\`\`\`

## State with Objects

\`\`\`jsx
function UserForm() {
  const [user, setUser] = useState({
    name: '',
    email: '',
    age: 0
  });

  const updateField = (field, value) => {
    setUser(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <input
      value={user.name}
      onChange={e => updateField('name', e.target.value)}
    />
  );
}
\`\`\`

## State with Arrays

\`\`\`jsx
function TodoList() {
  const [todos, setTodos] = useState([]);

  const addTodo = (text) => {
    setTodos([...todos, { id: Date.now(), text }]);
  };

  const removeTodo = (id) => {
    setTodos(todos.filter(t => t.id !== id));
  };
}
\`\`\``,
        duration: 30,
        difficulty: 'beginner',
        type: 'lesson',
        isFree: true,
        tags: ['react', 'state', 'useState', 'hooks']
      },
      {
        title: 'useEffect Hook',
        description: 'Handle side effects in React components',
        content: `# useEffect Hook

## What is useEffect?

useEffect lets you perform side effects in function components.

## Basic Usage

\`\`\`jsx
import { useState, useEffect } from 'react';

function Example() {
  const [count, setCount] = useState(0);

  // Runs after every render
  useEffect(() => {
    document.title = \`Count: \${count}\`;
  });

  return (
    <button onClick={() => setCount(count + 1)}>
      Clicked {count} times
    </button>
  );
}
\`\`\`

## Dependencies Array

\`\`\`jsx
// Run only once on mount
useEffect(() => {
  console.log('Component mounted');
}, []);

// Run when specific values change
useEffect(() => {
  console.log('Count changed:', count);
}, [count]);
\`\`\`

## Cleanup Function

\`\`\`jsx
useEffect(() => {
  const timer = setInterval(() => {
    console.log('Tick');
  }, 1000);

  // Cleanup on unmount
  return () => {
    clearInterval(timer);
  };
}, []);
\`\`\`

## Fetching Data

\`\`\`jsx
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      setLoading(true);
      const response = await fetch(\`/api/users/\${userId}\`);
      const data = await response.json();
      setUser(data);
      setLoading(false);
    }

    fetchUser();
  }, [userId]);

  if (loading) return <div>Loading...</div>;
  return <div>{user.name}</div>;
}
\`\`\``,
        duration: 30,
        difficulty: 'intermediate',
        type: 'lesson',
        isFree: false,
        tags: ['react', 'useEffect', 'hooks', 'side-effects']
      },
      {
        title: 'Event Handling in React',
        description: 'Handle user interactions with event handlers',
        content: `# Event Handling in React

## Basic Event Handler

\`\`\`jsx
function Button() {
  const handleClick = () => {
    alert('Button clicked!');
  };

  return <button onClick={handleClick}>Click Me</button>;
}
\`\`\`

## Event Object

\`\`\`jsx
function Form() {
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Form submitted');
  };

  const handleChange = (event) => {
    console.log('Value:', event.target.value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input onChange={handleChange} />
      <button type="submit">Submit</button>
    </form>
  );
}
\`\`\`

## Passing Arguments

\`\`\`jsx
function ItemList() {
  const handleDelete = (id) => {
    console.log('Deleting item:', id);
  };

  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>
          {item.name}
          <button onClick={() => handleDelete(item.id)}>
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}
\`\`\`

## Common Events

\`\`\`jsx
<input 
  onClick={handleClick}
  onChange={handleChange}
  onFocus={handleFocus}
  onBlur={handleBlur}
  onKeyDown={handleKeyDown}
/>

<form onSubmit={handleSubmit}>

<div 
  onMouseEnter={handleMouseEnter}
  onMouseLeave={handleMouseLeave}
>
\`\`\``,
        duration: 20,
        difficulty: 'beginner',
        type: 'lesson',
        isFree: false,
        tags: ['react', 'events', 'handlers']
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

async function seedTopicsAndLessons() {
  try {
    console.log('\n📚 Starting Topics and Lessons Seeding...\n');

    let totalTopics = 0;
    let totalLessons = 0;

    // Get all technologies
    const technologies = await Technology.find({});
    const techMap = {};
    technologies.forEach(t => {
      techMap[t.slug] = t._id;
    });

    // Get all courses
    const courses = await Course.find({});
    const courseMap = {};
    courses.forEach(c => {
      courseMap[c.slug] = c;
    });

    // Process each technology
    for (const [techSlug, courseTopics] of Object.entries(topicsData)) {
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
              order: i,
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

        // Update course with lessons in sections if not already done
        if (!course.sections || course.sections.length === 0) {
          // Create sections with lessons based on topics
          const sections = [];
          const lessonsPerSection = Math.ceil(topics.length / 2);

          for (let s = 0; s < 2; s++) {
            const sectionTopics = topics.slice(s * lessonsPerSection, (s + 1) * lessonsPerSection);
            if (sectionTopics.length === 0) continue;

            const section = {
              title: s === 0 ? 'Getting Started' : 'Core Concepts',
              description: s === 0 ? 'Introduction and basics' : 'Advanced topics',
              order: s,
              lessons: sectionTopics.map((t, idx) => ({
                title: t.title,
                slug: generateSlug(t.title),
                description: t.description,
                contentType: t.type === 'video' ? 'video' : 'article',
                content: t.content,
                order: idx,
                isFree: t.isFree,
                isPublished: true
              }))
            };

            sections.push(section);
            totalLessons += sectionTopics.length;
          }

          course.sections = sections;
          await course.save();
          console.log(`    📝 Added ${totalLessons} lessons to course sections`);
        }
      }
    }

    console.log('\n' + '='.repeat(50));
    console.log(`✅ Seeding completed!`);
    console.log(`   📚 Topics created: ${totalTopics}`);
    console.log(`   📄 Lessons added: ${totalLessons}`);
    console.log('='.repeat(50) + '\n');

  } catch (error) {
    console.error('❌ Seeding error:', error);
  } finally {
    mongoose.connection.close();
    console.log('🔌 MongoDB connection closed');
  }
}

// Run the seeder
seedTopicsAndLessons();
