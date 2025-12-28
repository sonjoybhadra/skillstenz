/**
 * Cheatsheets Seeder
 * Seeds quick reference cheatsheets for various technologies
 * Schema: { title, slug, description, technology, category, content, sections, tags, difficulty, icon, color, isPublished, isFeatured }
 */

const Cheatsheet = require('../../src/modules/cheatsheets/Cheatsheet');
const Technology = require('../../src/modules/technologies/Technology');

const getCheatsheets = (techMap) => [
  // Python Cheatsheet
  {
    title: 'Python Cheatsheet',
    slug: 'python-cheatsheet',
    technology: techMap['python'],
    description: 'Quick reference for Python programming - syntax, data types, functions, and common patterns.',
    category: 'syntax',
    content: 'Python is a versatile programming language known for its readable syntax and extensive standard library. This cheatsheet covers variables, data types, control flow, functions, and file operations.',
    difficulty: 'beginner',
    icon: '🐍',
    color: '#3572A5',
    isPublished: true,
    isFeatured: true,
    tags: ['python', 'programming', 'beginner', 'reference'],
    sections: [
      {
        title: 'Variables & Data Types',
        items: [
          { command: 'name = "TechTooTalk"', description: 'String - Text data enclosed in quotes', example: 'greeting = "Hello World"' },
          { command: 'age = 25', description: 'Integer - Whole numbers', example: 'count = 100' },
          { command: 'price = 19.99', description: 'Float - Decimal numbers', example: 'pi = 3.14159' },
          { command: 'is_active = True', description: 'Boolean - True or False values', example: 'logged_in = False' },
          { command: 'items = [1, 2, 3]', description: 'List - Ordered, mutable collection', example: 'names = ["Alice", "Bob"]' },
          { command: 'user = {"name": "John"}', description: 'Dictionary - Key-value pairs', example: 'config = {"debug": True}' }
        ]
      },
      {
        title: 'Control Flow',
        items: [
          { command: 'if x > 0: print("positive")', description: 'Conditional statement', example: 'if age >= 18: print("adult")' },
          { command: 'for i in range(5): print(i)', description: 'For loop iteration', example: 'for name in names: print(name)' },
          { command: 'while x < 10: x += 1', description: 'While loop', example: 'while not done: process()' },
          { command: '[x**2 for x in range(5)]', description: 'List comprehension', example: '[n*2 for n in numbers]' }
        ]
      },
      {
        title: 'Functions',
        items: [
          { command: 'def greet(name): return f"Hello {name}"', description: 'Define a function', example: 'def add(a, b): return a + b' },
          { command: 'lambda x: x ** 2', description: 'Lambda/anonymous function', example: 'square = lambda n: n*n' },
          { command: 'def func(*args):', description: 'Variable positional arguments', example: 'def sum_all(*nums): return sum(nums)' }
        ]
      },
      {
        title: 'File Operations',
        items: [
          { command: 'with open("file.txt", "r") as f:', description: 'Read file with context manager', example: 'content = f.read()' },
          { command: 'with open("file.txt", "w") as f:', description: 'Write to file', example: 'f.write("Hello")' }
        ]
      }
    ]
  },

  // JavaScript Cheatsheet
  {
    title: 'JavaScript Cheatsheet',
    slug: 'javascript-cheatsheet',
    technology: techMap['javascript'],
    description: 'Essential JavaScript reference - ES6+ syntax, DOM manipulation, async programming.',
    category: 'syntax',
    content: 'JavaScript is the language of the web. This cheatsheet covers modern ES6+ syntax, array methods, async/await, and DOM manipulation.',
    difficulty: 'beginner',
    icon: '💛',
    color: '#F7DF1E',
    isPublished: true,
    isFeatured: true,
    tags: ['javascript', 'web', 'es6', 'reference'],
    sections: [
      {
        title: 'Variables & Types',
        items: [
          { command: 'let age = 25;', description: 'Block-scoped, reassignable variable', example: 'let count = 0; count++;' },
          { command: 'const PI = 3.14;', description: 'Block-scoped constant', example: 'const API_URL = "/api"' },
          { command: '`Hello ${name}`', description: 'Template literal for string interpolation', example: '`Welcome, ${user.name}!`' },
          { command: 'const { name } = user;', description: 'Object destructuring', example: 'const { id, title } = post;' },
          { command: '[...arr, 4]', description: 'Spread operator', example: 'const newArr = [...oldArr, newItem]' }
        ]
      },
      {
        title: 'Arrow Functions',
        items: [
          { command: 'const add = (a, b) => a + b;', description: 'Arrow function with implicit return', example: 'const double = n => n * 2;' },
          { command: 'const greet = name => `Hi ${name}`;', description: 'Single param without parentheses', example: 'users.map(u => u.name)' },
          { command: 'arr.forEach(item => console.log(item));', description: 'Callback with arrow function', example: 'buttons.forEach(btn => btn.addEventListener(...))' }
        ]
      },
      {
        title: 'Array Methods',
        items: [
          { command: 'arr.map(x => x * 2)', description: 'Transform each element', example: 'users.map(u => u.name)' },
          { command: 'arr.filter(x => x > 5)', description: 'Filter elements by condition', example: 'adults = users.filter(u => u.age >= 18)' },
          { command: 'arr.reduce((sum, x) => sum + x, 0)', description: 'Reduce to single value', example: 'total = prices.reduce((a, b) => a + b, 0)' },
          { command: 'arr.find(x => x.id === 1)', description: 'Find first matching element', example: 'user = users.find(u => u.email === email)' }
        ]
      },
      {
        title: 'Async/Await',
        items: [
          { command: 'async function fetchData() { }', description: 'Declare async function', example: 'async function getUsers() { return await api.get("/users"); }' },
          { command: 'const data = await fetch(url);', description: 'Await a promise', example: 'const response = await axios.get(url);' },
          { command: 'try { await fn(); } catch (e) { }', description: 'Error handling with try/catch', example: 'try { await save(); } catch (err) { console.error(err); }' }
        ]
      }
    ]
  },

  // React Cheatsheet
  {
    title: 'React Cheatsheet',
    slug: 'react-cheatsheet',
    technology: techMap['react'],
    description: 'React quick reference - components, hooks, state management, and common patterns.',
    category: 'reference',
    content: 'React is a popular library for building user interfaces. This cheatsheet covers functional components, hooks, and common patterns.',
    difficulty: 'intermediate',
    icon: '⚛️',
    color: '#61DAFB',
    isPublished: true,
    isFeatured: true,
    tags: ['react', 'javascript', 'frontend', 'hooks'],
    sections: [
      {
        title: 'Components',
        items: [
          { command: 'function App() { return <div>Hello</div>; }', description: 'Functional component', example: 'function Button({ label }) { return <button>{label}</button>; }' },
          { command: '<Component prop={value} />', description: 'Pass props to component', example: '<User name="John" age={25} />' },
          { command: '{children}', description: 'Render children prop', example: '<Card>{content}</Card>' }
        ]
      },
      {
        title: 'Hooks',
        items: [
          { command: 'const [count, setCount] = useState(0);', description: 'State hook', example: 'const [user, setUser] = useState(null);' },
          { command: 'useEffect(() => { }, [deps]);', description: 'Effect hook with dependencies', example: 'useEffect(() => { fetchData(); }, [id]);' },
          { command: 'const value = useContext(MyContext);', description: 'Context hook', example: 'const { user } = useContext(AuthContext);' },
          { command: 'const inputRef = useRef(null);', description: 'Ref hook', example: 'useRef() for DOM references' },
          { command: 'const memoized = useMemo(() => compute(), [deps]);', description: 'Memoization hook', example: 'const filtered = useMemo(() => filterItems(items), [items]);' }
        ]
      },
      {
        title: 'Conditional Rendering',
        items: [
          { command: '{condition && <Component />}', description: 'Render if condition true', example: '{isLoggedIn && <Dashboard />}' },
          { command: '{condition ? <A /> : <B />}', description: 'Ternary conditional', example: '{loading ? <Spinner /> : <Content />}' },
          { command: 'items.map(item => <Item key={item.id} />)', description: 'Render list with key', example: 'users.map(u => <UserCard key={u.id} user={u} />)' }
        ]
      }
    ]
  },

  // Git Cheatsheet
  {
    title: 'Git Cheatsheet',
    slug: 'git-cheatsheet',
    technology: techMap['git'],
    description: 'Essential Git commands for version control - branching, merging, and collaboration.',
    category: 'commands',
    content: 'Git is a distributed version control system. Master these commands for effective collaboration.',
    difficulty: 'beginner',
    icon: '📚',
    color: '#F05032',
    isPublished: true,
    isFeatured: true,
    tags: ['git', 'version-control', 'commands', 'github'],
    sections: [
      {
        title: 'Basic Commands',
        items: [
          { command: 'git init', description: 'Initialize a new repository', example: 'git init my-project' },
          { command: 'git clone <url>', description: 'Clone a repository', example: 'git clone https://github.com/user/repo.git' },
          { command: 'git status', description: 'Check working directory status', example: 'Shows modified, staged files' },
          { command: 'git add .', description: 'Stage all changes', example: 'git add src/app.js' },
          { command: 'git commit -m "message"', description: 'Commit staged changes', example: 'git commit -m "Add login feature"' }
        ]
      },
      {
        title: 'Branching',
        items: [
          { command: 'git branch', description: 'List branches', example: 'git branch -a (all branches)' },
          { command: 'git branch <name>', description: 'Create new branch', example: 'git branch feature/login' },
          { command: 'git checkout <branch>', description: 'Switch to branch', example: 'git checkout main' },
          { command: 'git checkout -b <name>', description: 'Create and switch to branch', example: 'git checkout -b feature/signup' },
          { command: 'git merge <branch>', description: 'Merge branch into current', example: 'git merge feature/login' }
        ]
      },
      {
        title: 'Remote',
        items: [
          { command: 'git push origin <branch>', description: 'Push to remote', example: 'git push origin main' },
          { command: 'git pull', description: 'Pull changes from remote', example: 'git pull origin main' },
          { command: 'git fetch', description: 'Fetch without merging', example: 'git fetch --all' },
          { command: 'git remote -v', description: 'Show remote URLs', example: 'Lists origin and upstream' }
        ]
      }
    ]
  },

  // SQL Cheatsheet
  {
    title: 'SQL Cheatsheet',
    slug: 'sql-cheatsheet',
    technology: techMap['postgresql'],
    description: 'SQL quick reference - queries, joins, aggregations, and database operations.',
    category: 'syntax',
    content: 'SQL is essential for working with relational databases. This cheatsheet covers common queries and operations.',
    difficulty: 'beginner',
    icon: '🗄️',
    color: '#336791',
    isPublished: true,
    isFeatured: true,
    tags: ['sql', 'database', 'queries', 'postgresql'],
    sections: [
      {
        title: 'Basic Queries',
        items: [
          { command: 'SELECT * FROM users;', description: 'Select all columns', example: 'SELECT id, name FROM users;' },
          { command: 'SELECT * FROM users WHERE age > 18;', description: 'Filter with WHERE', example: 'WHERE status = "active"' },
          { command: 'ORDER BY name ASC;', description: 'Sort results', example: 'ORDER BY created_at DESC' },
          { command: 'LIMIT 10 OFFSET 20;', description: 'Pagination', example: 'LIMIT 25 OFFSET 0' }
        ]
      },
      {
        title: 'Joins',
        items: [
          { command: 'INNER JOIN orders ON users.id = orders.user_id', description: 'Inner join - matching rows', example: 'Returns only users with orders' },
          { command: 'LEFT JOIN orders ON ...', description: 'Left join - all from left table', example: 'All users, even without orders' },
          { command: 'RIGHT JOIN orders ON ...', description: 'Right join - all from right table', example: 'All orders, even without users' }
        ]
      },
      {
        title: 'Aggregations',
        items: [
          { command: 'SELECT COUNT(*) FROM users;', description: 'Count rows', example: 'COUNT(DISTINCT category)' },
          { command: 'SELECT SUM(price) FROM orders;', description: 'Sum values', example: 'SUM(quantity * price)' },
          { command: 'SELECT AVG(rating) FROM reviews;', description: 'Average value', example: 'AVG(score)' },
          { command: 'GROUP BY category', description: 'Group results', example: 'SELECT category, COUNT(*) GROUP BY category' }
        ]
      },
      {
        title: 'Modifications',
        items: [
          { command: 'INSERT INTO users (name, email) VALUES (...);', description: 'Insert row', example: 'INSERT INTO products (name, price) VALUES ("Widget", 9.99);' },
          { command: 'UPDATE users SET name = "John" WHERE id = 1;', description: 'Update rows', example: 'UPDATE orders SET status = "shipped" WHERE id = 123;' },
          { command: 'DELETE FROM users WHERE id = 1;', description: 'Delete rows', example: 'DELETE FROM sessions WHERE expired = true;' }
        ]
      }
    ]
  },

  // Docker Cheatsheet
  {
    title: 'Docker Cheatsheet',
    slug: 'docker-cheatsheet',
    technology: techMap['docker'],
    description: 'Docker commands and concepts - containers, images, volumes, and docker-compose.',
    category: 'commands',
    content: 'Docker enables containerization of applications. Master these commands for container management.',
    difficulty: 'intermediate',
    icon: '🐳',
    color: '#2496ED',
    isPublished: true,
    isFeatured: true,
    tags: ['docker', 'devops', 'containers', 'deployment'],
    sections: [
      {
        title: 'Container Commands',
        items: [
          { command: 'docker run -d -p 3000:3000 image', description: 'Run container in background', example: 'docker run -d -p 80:80 nginx' },
          { command: 'docker ps', description: 'List running containers', example: 'docker ps -a (all containers)' },
          { command: 'docker stop <container>', description: 'Stop container', example: 'docker stop my-app' },
          { command: 'docker rm <container>', description: 'Remove container', example: 'docker rm -f my-app' },
          { command: 'docker logs <container>', description: 'View container logs', example: 'docker logs -f my-app (follow)' }
        ]
      },
      {
        title: 'Image Commands',
        items: [
          { command: 'docker build -t name .', description: 'Build image from Dockerfile', example: 'docker build -t my-app:latest .' },
          { command: 'docker images', description: 'List images', example: 'docker images | grep my-app' },
          { command: 'docker pull image:tag', description: 'Pull image from registry', example: 'docker pull node:18-alpine' },
          { command: 'docker push image:tag', description: 'Push image to registry', example: 'docker push myrepo/my-app:v1' }
        ]
      },
      {
        title: 'Docker Compose',
        items: [
          { command: 'docker-compose up -d', description: 'Start services in background', example: 'docker-compose up --build' },
          { command: 'docker-compose down', description: 'Stop and remove containers', example: 'docker-compose down -v (with volumes)' },
          { command: 'docker-compose logs', description: 'View service logs', example: 'docker-compose logs -f web' }
        ]
      }
    ]
  },

  // Tailwind CSS Cheatsheet
  {
    title: 'Tailwind CSS Cheatsheet',
    slug: 'tailwind-css-cheatsheet',
    technology: techMap['tailwindcss'],
    description: 'Tailwind CSS utility classes - spacing, typography, flexbox, grid, and responsive design.',
    category: 'reference',
    content: 'Tailwind CSS is a utility-first CSS framework. This cheatsheet covers commonly used utility classes.',
    difficulty: 'beginner',
    icon: '🎨',
    color: '#06B6D4',
    isPublished: true,
    isFeatured: false,
    tags: ['tailwind', 'css', 'frontend', 'styling'],
    sections: [
      {
        title: 'Spacing',
        items: [
          { command: 'p-4, px-4, py-4', description: 'Padding (all, horizontal, vertical)', example: 'p-0, p-1, p-2, ..., p-96' },
          { command: 'm-4, mx-auto, my-4', description: 'Margin', example: 'mx-auto for centering' },
          { command: 'space-x-4, space-y-4', description: 'Space between children', example: 'flex space-x-4' },
          { command: 'gap-4', description: 'Grid/flex gap', example: 'grid gap-6' }
        ]
      },
      {
        title: 'Flexbox',
        items: [
          { command: 'flex, flex-row, flex-col', description: 'Flex container and direction', example: 'flex flex-col md:flex-row' },
          { command: 'justify-center, justify-between', description: 'Justify content', example: 'flex justify-between items-center' },
          { command: 'items-center, items-start', description: 'Align items', example: 'flex items-center' },
          { command: 'flex-1, flex-grow, flex-shrink-0', description: 'Flex sizing', example: 'flex-1 to fill space' }
        ]
      },
      {
        title: 'Typography',
        items: [
          { command: 'text-sm, text-lg, text-xl', description: 'Font sizes', example: 'text-xs to text-9xl' },
          { command: 'font-bold, font-semibold', description: 'Font weight', example: 'font-light to font-black' },
          { command: 'text-gray-500, text-blue-600', description: 'Text color', example: 'text-white dark:text-gray-100' },
          { command: 'text-center, text-right', description: 'Text alignment', example: 'text-left md:text-center' }
        ]
      },
      {
        title: 'Responsive',
        items: [
          { command: 'sm:, md:, lg:, xl:', description: 'Responsive breakpoint prefixes', example: 'hidden md:block lg:flex' },
          { command: 'dark:', description: 'Dark mode prefix', example: 'bg-white dark:bg-gray-900' },
          { command: 'hover:, focus:, active:', description: 'State variants', example: 'hover:bg-blue-600 focus:ring-2' }
        ]
      }
    ]
  },

  // Node.js Cheatsheet
  {
    title: 'Node.js Cheatsheet',
    slug: 'nodejs-cheatsheet',
    technology: techMap['nodejs'],
    description: 'Node.js quick reference - modules, file system, HTTP, and Express patterns.',
    category: 'reference',
    content: 'Node.js enables server-side JavaScript. This cheatsheet covers core modules and common patterns.',
    difficulty: 'intermediate',
    icon: '💚',
    color: '#339933',
    isPublished: true,
    isFeatured: false,
    tags: ['nodejs', 'javascript', 'backend', 'server'],
    sections: [
      {
        title: 'Core Modules',
        items: [
          { command: "const fs = require('fs');", description: 'File system module', example: 'fs.readFileSync, fs.writeFile' },
          { command: "const path = require('path');", description: 'Path utilities', example: 'path.join(__dirname, "file.txt")' },
          { command: "const http = require('http');", description: 'HTTP module', example: 'http.createServer()' }
        ]
      },
      {
        title: 'File System',
        items: [
          { command: 'fs.readFile(path, callback)', description: 'Read file async', example: "fs.readFile('data.json', 'utf8', (err, data) => {})" },
          { command: 'fs.writeFile(path, data, callback)', description: 'Write file async', example: "fs.writeFile('out.txt', content, (err) => {})" },
          { command: 'fs.promises.readFile(path)', description: 'Promise-based file read', example: 'await fs.promises.readFile(path, "utf8")' }
        ]
      },
      {
        title: 'Express.js',
        items: [
          { command: "const app = express();", description: 'Create Express app', example: "app.listen(3000, () => console.log('Running'))" },
          { command: "app.get('/path', handler)", description: 'GET route handler', example: "app.get('/users', (req, res) => {})" },
          { command: 'app.use(middleware)', description: 'Use middleware', example: 'app.use(express.json())' },
          { command: 'req.params, req.query, req.body', description: 'Request data', example: 'const { id } = req.params;' }
        ]
      }
    ]
  },

  // MongoDB Cheatsheet
  {
    title: 'MongoDB Cheatsheet',
    slug: 'mongodb-cheatsheet',
    technology: techMap['mongodb'],
    description: 'MongoDB operations - CRUD, aggregation, indexes, and Mongoose patterns.',
    category: 'commands',
    content: 'MongoDB is a popular NoSQL database. This cheatsheet covers essential operations and Mongoose ODM.',
    difficulty: 'intermediate',
    icon: '🍃',
    color: '#47A248',
    isPublished: true,
    isFeatured: false,
    tags: ['mongodb', 'database', 'nosql', 'mongoose'],
    sections: [
      {
        title: 'CRUD Operations',
        items: [
          { command: 'db.collection.find({})', description: 'Find documents', example: 'db.users.find({ age: { $gt: 18 } })' },
          { command: 'db.collection.insertOne(doc)', description: 'Insert document', example: 'db.users.insertOne({ name: "John" })' },
          { command: 'db.collection.updateOne(filter, update)', description: 'Update document', example: 'db.users.updateOne({ _id }, { $set: { name } })' },
          { command: 'db.collection.deleteOne(filter)', description: 'Delete document', example: 'db.users.deleteOne({ _id: id })' }
        ]
      },
      {
        title: 'Query Operators',
        items: [
          { command: '{ $gt: 5, $lt: 10 }', description: 'Greater/less than', example: '{ age: { $gte: 18 } }' },
          { command: '{ $in: [1, 2, 3] }', description: 'Match any in array', example: '{ status: { $in: ["active", "pending"] } }' },
          { command: '{ $regex: /pattern/ }', description: 'Regex match', example: '{ email: { $regex: /@gmail/ } }' },
          { command: '{ $exists: true }', description: 'Field exists', example: '{ deletedAt: { $exists: false } }' }
        ]
      },
      {
        title: 'Mongoose',
        items: [
          { command: 'Model.find(query)', description: 'Find documents', example: 'const users = await User.find({ active: true });' },
          { command: 'Model.findById(id)', description: 'Find by ID', example: 'const user = await User.findById(req.params.id);' },
          { command: 'new Model(data).save()', description: 'Create and save', example: 'const user = new User(req.body); await user.save();' },
          { command: 'Model.findByIdAndUpdate(id, update)', description: 'Find and update', example: 'await User.findByIdAndUpdate(id, { name }, { new: true });' }
        ]
      }
    ]
  },

  // Linux/Bash Cheatsheet  
  {
    title: 'Linux/Bash Cheatsheet',
    slug: 'linux-bash-cheatsheet',
    technology: techMap['linux'],
    description: 'Essential Linux commands - file operations, permissions, processes, and shell scripting.',
    category: 'commands',
    content: 'Linux command line is essential for developers. Master these commands for system administration and scripting.',
    difficulty: 'beginner',
    icon: '🐧',
    color: '#FCC624',
    isPublished: true,
    isFeatured: false,
    tags: ['linux', 'bash', 'terminal', 'shell'],
    sections: [
      {
        title: 'File Operations',
        items: [
          { command: 'ls -la', description: 'List files with details', example: 'ls -lah (human-readable sizes)' },
          { command: 'cd /path/to/dir', description: 'Change directory', example: 'cd ~, cd .., cd -' },
          { command: 'cp source dest', description: 'Copy file/directory', example: 'cp -r folder/ backup/' },
          { command: 'mv source dest', description: 'Move/rename', example: 'mv old.txt new.txt' },
          { command: 'rm file', description: 'Remove file', example: 'rm -rf folder/ (recursive, force)' },
          { command: 'mkdir -p path', description: 'Create directories', example: 'mkdir -p src/components' }
        ]
      },
      {
        title: 'File Viewing',
        items: [
          { command: 'cat file.txt', description: 'Display file contents', example: 'cat file1 file2 (concatenate)' },
          { command: 'less file.txt', description: 'View file with paging', example: 'less +F to follow' },
          { command: 'head -n 10 file', description: 'First N lines', example: 'head -20 log.txt' },
          { command: 'tail -f log.txt', description: 'Last lines, follow', example: 'tail -n 100 -f app.log' },
          { command: 'grep pattern file', description: 'Search in file', example: 'grep -r "TODO" src/' }
        ]
      },
      {
        title: 'Permissions',
        items: [
          { command: 'chmod 755 file', description: 'Change permissions', example: 'chmod +x script.sh' },
          { command: 'chown user:group file', description: 'Change ownership', example: 'chown www-data:www-data /var/www' },
          { command: 'sudo command', description: 'Run as superuser', example: 'sudo apt update' }
        ]
      },
      {
        title: 'Process Management',
        items: [
          { command: 'ps aux', description: 'List all processes', example: 'ps aux | grep node' },
          { command: 'top / htop', description: 'Monitor processes', example: 'htop for interactive view' },
          { command: 'kill -9 PID', description: 'Force kill process', example: 'kill $(pgrep node)' },
          { command: 'command &', description: 'Run in background', example: 'npm run dev &' }
        ]
      }
    ]
  }
];

async function seedCheatsheets() {
  try {
    console.log('📋 Seeding Cheatsheets...');
    
    // Get technologies map
    const technologies = await Technology.find({});
    const techMap = {};
    technologies.forEach(tech => {
      techMap[tech.slug] = tech._id;
    });
    
    // Clear existing cheatsheets
    await Cheatsheet.deleteMany({});
    
    // Get cheatsheets with tech references
    const cheatsheets = getCheatsheets(techMap);
    
    // Filter out cheatsheets with missing technology references
    const validCheatsheets = cheatsheets.filter(cs => {
      if (!cs.technology) {
        console.log(`⚠️  Skipping cheatsheet "${cs.title}" - technology not found`);
        return false;
      }
      return true;
    });
    
    // Insert cheatsheets
    const result = await Cheatsheet.insertMany(validCheatsheets);
    
    console.log(`✅ Seeded ${result.length} cheatsheets`);
    return result;
  } catch (error) {
    console.error('❌ Error seeding cheatsheets:', error.message);
    throw error;
  }
}

module.exports = { seedCheatsheets, getCheatsheets };
