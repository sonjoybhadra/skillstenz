/**
 * MCQs Seeder
 * Creates 500 MCQs with technology and course relations
 */

const MCQ = require('../../src/modules/mcqs/MCQ');
const Technology = require('../../src/modules/technologies/Technology');
const Course = require('../../src/modules/courses/Course');

// MCQ templates for each technology
const getMCQTemplates = () => ({
  python: [
    { q: 'What is the correct file extension for Python files?', options: ['.py', '.python', '.pt', '.pyt'], correct: 0, explanation: 'Python files use the .py extension.' },
    { q: 'Which keyword is used to define a function in Python?', options: ['function', 'def', 'fun', 'define'], correct: 1, explanation: 'The "def" keyword is used to define functions in Python.' },
    { q: 'What is the output of print(2 ** 3)?', options: ['6', '8', '9', '5'], correct: 1, explanation: '** is the exponentiation operator. 2^3 = 8.' },
    { q: 'Which data type is immutable in Python?', options: ['list', 'dictionary', 'tuple', 'set'], correct: 2, explanation: 'Tuples are immutable - their values cannot be changed after creation.' },
    { q: 'What does len() function do?', options: ['Returns length', 'Creates list', 'Adds elements', 'Removes elements'], correct: 0, explanation: 'len() returns the number of items in an object.' },
    { q: 'Which operator is used for floor division?', options: ['/', '//', '%', '**'], correct: 1, explanation: '// performs floor division, returning the largest integer less than or equal to the result.' },
    { q: 'What is the correct way to create a list in Python?', options: ['list = ()', 'list = []', 'list = {}', 'list = <>'], correct: 1, explanation: 'Square brackets [] are used to create lists in Python.' },
    { q: 'Which method adds an element at the end of a list?', options: ['add()', 'append()', 'insert()', 'extend()'], correct: 1, explanation: 'append() adds a single element at the end of the list.' },
    { q: 'What is a lambda function?', options: ['A named function', 'An anonymous function', 'A class method', 'A built-in function'], correct: 1, explanation: 'Lambda functions are anonymous (unnamed) small functions.' },
    { q: 'Which module is used for regular expressions?', options: ['regex', 're', 'regexp', 'reg'], correct: 1, explanation: 'The "re" module provides regular expression operations in Python.' },
    { q: 'What does the pass statement do?', options: ['Exits the loop', 'Skips iteration', 'Does nothing', 'Returns None'], correct: 2, explanation: 'pass is a null operation - it does nothing and is used as a placeholder.' },
    { q: 'Which keyword is used to handle exceptions?', options: ['catch', 'except', 'handle', 'error'], correct: 1, explanation: 'The except keyword is used to catch and handle exceptions.' },
    { q: 'What is __init__ in Python?', options: ['Destructor', 'Constructor', 'Decorator', 'Iterator'], correct: 1, explanation: '__init__ is the constructor method called when an object is created.' },
    { q: 'Which is NOT a valid variable name?', options: ['my_var', '_var', '2var', 'myVar'], correct: 2, explanation: 'Variable names cannot start with a number.' },
    { q: 'What is the output of bool("")?', options: ['True', 'False', 'None', 'Error'], correct: 1, explanation: 'Empty strings are falsy in Python, so bool("") returns False.' },
    { q: 'Which method removes whitespace from both ends?', options: ['trim()', 'strip()', 'clean()', 'remove()'], correct: 1, explanation: 'strip() removes leading and trailing whitespace.' },
    { q: 'What is a dictionary in Python?', options: ['Ordered sequence', 'Key-value pairs', 'Unique elements', 'Immutable list'], correct: 1, explanation: 'Dictionaries store data as key-value pairs.' },
    { q: 'Which loop is used for iteration?', options: ['for', 'while', 'Both A and B', 'do-while'], correct: 2, explanation: 'Python supports both for and while loops for iteration.' },
    { q: 'What is pip?', options: ['Python IDE', 'Package manager', 'Debugger', 'Compiler'], correct: 1, explanation: 'pip is the package installer for Python.' },
    { q: 'Which statement is used to exit a loop?', options: ['exit', 'break', 'stop', 'end'], correct: 1, explanation: 'The break statement exits the loop immediately.' },
  ],
  javascript: [
    { q: 'Which keyword declares a block-scoped variable?', options: ['var', 'let', 'const', 'Both B and C'], correct: 3, explanation: 'Both let and const declare block-scoped variables.' },
    { q: 'What is the output of typeof null?', options: ['null', 'object', 'undefined', 'string'], correct: 1, explanation: 'typeof null returns "object" - this is a known JavaScript quirk.' },
    { q: 'Which method converts JSON to object?', options: ['JSON.parse()', 'JSON.stringify()', 'JSON.convert()', 'JSON.toObject()'], correct: 0, explanation: 'JSON.parse() converts a JSON string to a JavaScript object.' },
    { q: 'What is === in JavaScript?', options: ['Assignment', 'Loose equality', 'Strict equality', 'Not equal'], correct: 2, explanation: '=== checks for equality without type conversion (strict equality).' },
    { q: 'Which method adds element to end of array?', options: ['push()', 'pop()', 'shift()', 'unshift()'], correct: 0, explanation: 'push() adds elements to the end of an array.' },
    { q: 'What does NaN stand for?', options: ['Not a Name', 'Not a Number', 'Null and None', 'None'], correct: 1, explanation: 'NaN stands for "Not a Number".' },
    { q: 'Which is a falsy value?', options: ['1', '"false"', '0', '[]'], correct: 2, explanation: '0 is falsy. The string "false" and empty array [] are truthy.' },
    { q: 'What is a closure?', options: ['A class', 'Function with access to outer scope', 'A loop', 'An array method'], correct: 1, explanation: 'A closure is a function that has access to variables from its outer scope.' },
    { q: 'Which method creates new array from callback?', options: ['forEach()', 'map()', 'filter()', 'reduce()'], correct: 1, explanation: 'map() creates a new array with the results of calling a function on every element.' },
    { q: 'What is the DOM?', options: ['Data Object Model', 'Document Object Model', 'Dynamic Object Model', 'Display Object Model'], correct: 1, explanation: 'DOM stands for Document Object Model.' },
    { q: 'Which event fires when page loads?', options: ['onload', 'onclick', 'onchange', 'onready'], correct: 0, explanation: 'The onload event fires when the page has finished loading.' },
    { q: 'What is hoisting?', options: ['Moving code', 'Variable declaration moved to top', 'Function call', 'Error handling'], correct: 1, explanation: 'Hoisting moves variable and function declarations to the top of their scope.' },
    { q: 'Which method removes last element?', options: ['push()', 'pop()', 'shift()', 'slice()'], correct: 1, explanation: 'pop() removes and returns the last element of an array.' },
    { q: 'What is async/await used for?', options: ['Loops', 'Asynchronous operations', 'Variables', 'Functions'], correct: 1, explanation: 'async/await is used to handle asynchronous operations more cleanly.' },
    { q: 'What is the spread operator?', options: ['..', '...', ':::', '***'], correct: 1, explanation: 'The spread operator (...) expands an iterable into individual elements.' },
    { q: 'Which method finds first matching element?', options: ['find()', 'filter()', 'search()', 'get()'], correct: 0, explanation: 'find() returns the first element that satisfies a condition.' },
    { q: 'What is "this" in JavaScript?', options: ['Current function', 'Current object', 'Global object always', 'Undefined'], correct: 1, explanation: '"this" refers to the object that is executing the current function.' },
    { q: 'Which creates a Promise?', options: ['new Promise()', 'Promise.make()', 'createPromise()', 'async()'], correct: 0, explanation: 'new Promise() creates a new Promise object.' },
    { q: 'What is destructuring?', options: ['Deleting objects', 'Extracting values from objects/arrays', 'Creating objects', 'Copying arrays'], correct: 1, explanation: 'Destructuring extracts values from objects or arrays into distinct variables.' },
    { q: 'Which is NOT a primitive type?', options: ['string', 'number', 'object', 'boolean'], correct: 2, explanation: 'object is not a primitive type - it is a reference type.' },
  ],
  react: [
    { q: 'What is React?', options: ['Framework', 'Library', 'Language', 'Database'], correct: 1, explanation: 'React is a JavaScript library for building user interfaces.' },
    { q: 'What is JSX?', options: ['JavaScript XML', 'Java Syntax Extension', 'JSON eXtension', 'JavaScript eXtra'], correct: 0, explanation: 'JSX stands for JavaScript XML.' },
    { q: 'What is a component in React?', options: ['HTML element', 'Reusable UI piece', 'CSS class', 'JavaScript file'], correct: 1, explanation: 'Components are reusable, independent pieces of UI.' },
    { q: 'Which hook manages state?', options: ['useEffect', 'useState', 'useContext', 'useRef'], correct: 1, explanation: 'useState is used to add state to functional components.' },
    { q: 'What is props in React?', options: ['Properties passed to components', 'State', 'Methods', 'Events'], correct: 0, explanation: 'Props are properties passed from parent to child components.' },
    { q: 'What does useEffect do?', options: ['Manages state', 'Handles side effects', 'Creates refs', 'Provides context'], correct: 1, explanation: 'useEffect handles side effects like data fetching and subscriptions.' },
    { q: 'What is the Virtual DOM?', options: ['Real DOM copy', 'Lightweight DOM representation', 'Shadow DOM', 'Server DOM'], correct: 1, explanation: 'Virtual DOM is a lightweight copy of the actual DOM for efficient updates.' },
    { q: 'How do you create a React app?', options: ['npm create react', 'npx create-react-app', 'react init', 'npm start react'], correct: 1, explanation: 'npx create-react-app is the standard way to create a new React application.' },
    { q: 'What is conditional rendering?', options: ['Rendering based on conditions', 'Always rendering', 'Never rendering', 'Random rendering'], correct: 0, explanation: 'Conditional rendering shows different UI based on conditions.' },
    { q: 'What is the key prop used for?', options: ['Styling', 'Unique identification in lists', 'Event handling', 'State management'], correct: 1, explanation: 'The key prop helps React identify which items have changed in a list.' },
    { q: 'What is Context API?', options: ['HTTP API', 'State management without props', 'Database API', 'Router API'], correct: 1, explanation: 'Context API allows passing data through the component tree without props.' },
    { q: 'Which is a valid event handler?', options: ['onclick', 'onClick', 'on-click', 'ONCLICK'], correct: 1, explanation: 'React uses camelCase for event handlers, so onClick is correct.' },
    { q: 'What is a controlled component?', options: ['Component controlled by state', 'Uncontrolled component', 'Parent component', 'Child component'], correct: 0, explanation: 'A controlled component is one whose value is controlled by React state.' },
    { q: 'What does React.memo do?', options: ['Creates memo', 'Memoizes component', 'Writes notes', 'Logs data'], correct: 1, explanation: 'React.memo memoizes a component to prevent unnecessary re-renders.' },
    { q: 'What is useReducer for?', options: ['Simple state', 'Complex state logic', 'Side effects', 'Context'], correct: 1, explanation: 'useReducer is for managing complex state logic with actions.' },
    { q: 'What is a React Fragment?', options: ['Broken component', 'Wrapper without DOM element', 'Error boundary', 'Suspense component'], correct: 1, explanation: 'Fragments let you group children without adding extra DOM nodes.' },
    { q: 'How to pass data from child to parent?', options: ['Props', 'Callback functions', 'State', 'Context only'], correct: 1, explanation: 'Callback functions passed as props can send data from child to parent.' },
    { q: 'What is lazy loading in React?', options: ['Slow loading', 'Loading components on demand', 'Not loading', 'Fast loading'], correct: 1, explanation: 'Lazy loading loads components only when they are needed.' },
    { q: 'What is StrictMode?', options: ['Error mode', 'Development helper', 'Production mode', 'Test mode'], correct: 1, explanation: 'StrictMode helps identify potential problems in development.' },
    { q: 'What is the purpose of useCallback?', options: ['Create callback', 'Memoize functions', 'Handle events', 'Create state'], correct: 1, explanation: 'useCallback memoizes callback functions to prevent unnecessary re-creations.' },
  ],
  nodejs: [
    { q: 'What is Node.js?', options: ['Browser', 'Runtime environment', 'Framework', 'Database'], correct: 1, explanation: 'Node.js is a JavaScript runtime built on Chrome\'s V8 engine.' },
    { q: 'Which module handles HTTP?', options: ['http', 'server', 'web', 'network'], correct: 0, explanation: 'The http module is used to create HTTP servers and clients.' },
    { q: 'What is npm?', options: ['Node Program Manager', 'Node Package Manager', 'New Package Manager', 'Node Project Manager'], correct: 1, explanation: 'npm stands for Node Package Manager.' },
    { q: 'Which is used to read files?', options: ['fs.read()', 'fs.readFile()', 'file.read()', 'read.file()'], correct: 1, explanation: 'fs.readFile() is used to asynchronously read files.' },
    { q: 'What is Express.js?', options: ['Database', 'Web framework', 'Testing tool', 'Package manager'], correct: 1, explanation: 'Express.js is a minimal and flexible Node.js web application framework.' },
    { q: 'What is middleware?', options: ['Middle layer between request and response', 'Database', 'Frontend', 'Cache'], correct: 0, explanation: 'Middleware functions have access to request and response objects.' },
    { q: 'Which command starts a Node app?', options: ['node run app', 'node app.js', 'start node app', 'run app.js'], correct: 1, explanation: 'node app.js runs the application file.' },
    { q: 'What is package.json?', options: ['JavaScript file', 'Project manifest', 'Database config', 'HTML file'], correct: 1, explanation: 'package.json contains project metadata and dependencies.' },
    { q: 'What does require() do?', options: ['Creates module', 'Imports module', 'Exports module', 'Deletes module'], correct: 1, explanation: 'require() is used to import modules in Node.js.' },
    { q: 'What is the event loop?', options: ['For loop', 'Handles async operations', 'While loop', 'For-each loop'], correct: 1, explanation: 'The event loop handles asynchronous operations in Node.js.' },
    { q: 'Which is a valid route method?', options: ['app.route()', 'app.get()', 'app.path()', 'app.url()'], correct: 1, explanation: 'app.get() defines a route for GET requests in Express.' },
    { q: 'What is body-parser?', options: ['HTML parser', 'Parses request body', 'CSS parser', 'JSON formatter'], correct: 1, explanation: 'body-parser middleware parses incoming request bodies.' },
    { q: 'What does process.env contain?', options: ['Errors', 'Environment variables', 'File paths', 'Functions'], correct: 1, explanation: 'process.env contains the user environment variables.' },
    { q: 'Which database is commonly used with Node?', options: ['MySQL only', 'MongoDB', 'Oracle only', 'None'], correct: 1, explanation: 'MongoDB is commonly used with Node.js due to its JavaScript-friendly nature.' },
    { q: 'What is nodemon?', options: ['Monster node', 'Auto-restart tool', 'Package manager', 'Debugger'], correct: 1, explanation: 'nodemon automatically restarts the node application on file changes.' },
    { q: 'What is REST API?', options: ['Sleep API', 'Representational State Transfer', 'Run-time API', 'Response API'], correct: 1, explanation: 'REST stands for Representational State Transfer.' },
    { q: 'Which module handles paths?', options: ['path', 'url', 'route', 'directory'], correct: 0, explanation: 'The path module provides utilities for working with file paths.' },
    { q: 'What is CORS?', options: ['Core Server', 'Cross-Origin Resource Sharing', 'Client Origin Response', 'Cache Origin'], correct: 1, explanation: 'CORS allows controlled access to resources from different origins.' },
    { q: 'What does res.json() do?', options: ['Reads JSON', 'Sends JSON response', 'Parses JSON', 'Creates JSON'], correct: 1, explanation: 'res.json() sends a JSON response to the client.' },
    { q: 'What is clustering in Node.js?', options: ['Grouping files', 'Running multiple processes', 'Clustering data', 'None'], correct: 1, explanation: 'Clustering allows running multiple Node.js processes to handle more load.' },
  ],
  java: [
    { q: 'What is Java?', options: ['Scripting language', 'Object-oriented language', 'Markup language', 'Assembly language'], correct: 1, explanation: 'Java is a class-based, object-oriented programming language.' },
    { q: 'Which keyword is used for inheritance?', options: ['inherit', 'extends', 'implements', 'super'], correct: 1, explanation: 'The extends keyword is used for class inheritance.' },
    { q: 'What is JVM?', options: ['Java Virtual Machine', 'Java Verification Module', 'Java Version Manager', 'Java Variable Machine'], correct: 0, explanation: 'JVM stands for Java Virtual Machine.' },
    { q: 'Which is a primitive type?', options: ['String', 'Array', 'int', 'Object'], correct: 2, explanation: 'int is a primitive type. String and Array are reference types.' },
    { q: 'What does static mean?', options: ['Unchangeable', 'Belongs to class not instance', 'Private', 'Final'], correct: 1, explanation: 'Static members belong to the class rather than any specific instance.' },
    { q: 'What is an interface?', options: ['GUI', 'Contract for classes', 'Abstract class', 'Package'], correct: 1, explanation: 'An interface is a contract that classes can implement.' },
    { q: 'Which keyword prevents inheritance?', options: ['static', 'private', 'final', 'abstract'], correct: 2, explanation: 'The final keyword prevents a class from being extended.' },
    { q: 'What is encapsulation?', options: ['Data hiding', 'Inheritance', 'Polymorphism', 'Abstraction'], correct: 0, explanation: 'Encapsulation is the bundling of data with methods that operate on it.' },
    { q: 'Which exception is checked?', options: ['NullPointerException', 'IOException', 'ArrayIndexOutOfBounds', 'ArithmeticException'], correct: 1, explanation: 'IOException is a checked exception that must be handled.' },
    { q: 'What is the main method signature?', options: ['public void main()', 'public static void main(String[] args)', 'void main()', 'main()'], correct: 1, explanation: 'The main method must be public static void with String[] parameter.' },
    { q: 'What does the new keyword do?', options: ['Creates variable', 'Creates object', 'Imports package', 'Defines class'], correct: 1, explanation: 'The new keyword instantiates a new object.' },
    { q: 'What is polymorphism?', options: ['Multiple forms', 'Single form', 'Data type', 'Variable'], correct: 0, explanation: 'Polymorphism allows objects to take many forms.' },
    { q: 'Which collection allows duplicates?', options: ['Set', 'List', 'Map keys', 'None'], correct: 1, explanation: 'List allows duplicate elements while Set does not.' },
    { q: 'What is a constructor?', options: ['Method to destroy object', 'Method to create object', 'Variable', 'Loop'], correct: 1, explanation: 'A constructor is called when an object is created.' },
    { q: 'What is the super keyword?', options: ['Best method', 'Parent class reference', 'Static method', 'Final variable'], correct: 1, explanation: 'super refers to the parent class.' },
    { q: 'What is method overloading?', options: ['Same name, different parameters', 'Same name, same parameters', 'Different name', 'No parameters'], correct: 0, explanation: 'Method overloading is having multiple methods with the same name but different parameters.' },
    { q: 'Which keyword handles exceptions?', options: ['catch', 'try', 'throw', 'All of above'], correct: 3, explanation: 'try, catch, and throw are all used in exception handling.' },
    { q: 'What is a package?', options: ['Box', 'Namespace for classes', 'Variable type', 'Loop'], correct: 1, explanation: 'A package is a namespace that organizes related classes.' },
    { q: 'What does void mean?', options: ['Empty space', 'No return value', 'Null', 'Zero'], correct: 1, explanation: 'void indicates that a method does not return a value.' },
    { q: 'What is garbage collection?', options: ['Removing files', 'Automatic memory management', 'Deleting variables', 'Cleaning code'], correct: 1, explanation: 'Garbage collection automatically frees memory from unused objects.' },
  ],
  typescript: [
    { q: 'What is TypeScript?', options: ['New language', 'JavaScript superset', 'Java variant', 'Python library'], correct: 1, explanation: 'TypeScript is a typed superset of JavaScript.' },
    { q: 'What is a type annotation?', options: ['Comment', 'Specifying variable type', 'Function', 'Class'], correct: 1, explanation: 'Type annotations specify the type of a variable.' },
    { q: 'Which keyword defines an interface?', options: ['type', 'interface', 'class', 'struct'], correct: 1, explanation: 'The interface keyword is used to define interfaces.' },
    { q: 'What is "any" type?', options: ['Specific type', 'Allows any type', 'Number type', 'String type'], correct: 1, explanation: 'any type allows any value, opting out of type checking.' },
    { q: 'How to define optional property?', options: ['!', '?', '*', '&'], correct: 1, explanation: 'The ? symbol after a property name makes it optional.' },
    { q: 'What are generics?', options: ['General functions', 'Type parameters', 'Variables', 'Constants'], correct: 1, explanation: 'Generics allow creating reusable components with type parameters.' },
    { q: 'What does readonly do?', options: ['Makes variable constant', 'Makes property unchangeable', 'Creates function', 'Imports module'], correct: 1, explanation: 'readonly makes a property immutable after initialization.' },
    { q: 'What is a tuple?', options: ['Single value', 'Fixed-length array with types', 'Object', 'Function'], correct: 1, explanation: 'A tuple is an array with a fixed number of elements of specific types.' },
    { q: 'What is type inference?', options: ['Guessing types', 'Automatic type detection', 'Manual typing', 'No types'], correct: 1, explanation: 'Type inference automatically determines the type of a variable.' },
    { q: 'What is a union type?', options: ['Combined types', 'Single type', 'No type', 'Class type'], correct: 0, explanation: 'Union types allow a value to be one of several types.' },
    { q: 'What does as keyword do?', options: ['Creates alias', 'Type assertion', 'Import', 'Export'], correct: 1, explanation: 'as is used for type assertion.' },
    { q: 'What is an enum?', options: ['Function', 'Named constants', 'Array', 'Object'], correct: 1, explanation: 'Enums are a set of named constants.' },
    { q: 'What is never type?', options: ['Always fails', 'Never returns', 'Optional', 'Null'], correct: 1, explanation: 'never type represents values that never occur.' },
    { q: 'How to compile TypeScript?', options: ['node file.ts', 'tsc file.ts', 'ts file.ts', 'compile file.ts'], correct: 1, explanation: 'tsc (TypeScript Compiler) compiles .ts files to JavaScript.' },
    { q: 'What is tsconfig.json?', options: ['Package file', 'TypeScript configuration', 'Test file', 'Build file'], correct: 1, explanation: 'tsconfig.json contains TypeScript compiler options.' },
    { q: 'What is a type alias?', options: ['Type nickname', 'New type name', 'Interface', 'Both A and B'], correct: 3, explanation: 'Type aliases create new names for types.' },
    { q: 'What is intersection type?', options: ['Combining types', 'Dividing types', 'Single type', 'No type'], correct: 0, explanation: 'Intersection types combine multiple types into one.' },
    { q: 'What does strict mode enable?', options: ['Less checks', 'More type checks', 'No checks', 'Runtime checks'], correct: 1, explanation: 'Strict mode enables stricter type checking.' },
    { q: 'What is a type guard?', options: ['Security', 'Narrowing types', 'Generic', 'Enum'], correct: 1, explanation: 'Type guards narrow the type within a conditional block.' },
    { q: 'What is keyof operator?', options: ['Key finder', 'Gets keys of type', 'Creates key', 'Deletes key'], correct: 1, explanation: 'keyof gets the keys of an object type as a union.' },
  ],
  html: [
    { q: 'What does HTML stand for?', options: ['Hyper Text Markup Language', 'High Tech Modern Language', 'Hyper Transfer Markup Language', 'Home Tool Markup Language'], correct: 0, explanation: 'HTML stands for Hyper Text Markup Language.' },
    { q: 'Which tag creates a paragraph?', options: ['<para>', '<p>', '<paragraph>', '<pg>'], correct: 1, explanation: 'The <p> tag defines a paragraph.' },
    { q: 'Which tag is for largest heading?', options: ['<h6>', '<h1>', '<header>', '<heading>'], correct: 1, explanation: '<h1> is the largest heading, <h6> is the smallest.' },
    { q: 'Which attribute specifies image source?', options: ['href', 'src', 'link', 'source'], correct: 1, explanation: 'The src attribute specifies the image source.' },
    { q: 'Which tag creates a hyperlink?', options: ['<link>', '<a>', '<href>', '<hyperlink>'], correct: 1, explanation: 'The <a> (anchor) tag creates hyperlinks.' },
    { q: 'Which is a self-closing tag?', options: ['<div>', '<span>', '<img>', '<p>'], correct: 2, explanation: '<img> is a self-closing (void) element.' },
    { q: 'Which tag creates a table row?', options: ['<tr>', '<row>', '<td>', '<table-row>'], correct: 0, explanation: '<tr> defines a table row.' },
    { q: 'What is the correct doctype for HTML5?', options: ['<!DOCTYPE html5>', '<!DOCTYPE html>', '<!HTML5>', '<doctype html>'], correct: 1, explanation: '<!DOCTYPE html> is the correct HTML5 doctype.' },
    { q: 'Which tag is for navigation?', options: ['<navigate>', '<nav>', '<navigation>', '<menu>'], correct: 1, explanation: '<nav> is the semantic tag for navigation.' },
    { q: 'Which creates an ordered list?', options: ['<ul>', '<ol>', '<li>', '<list>'], correct: 1, explanation: '<ol> creates an ordered (numbered) list.' },
    { q: 'Which attribute opens link in new tab?', options: ['target="_blank"', 'new="true"', 'tab="new"', 'open="blank"'], correct: 0, explanation: 'target="_blank" opens the link in a new tab.' },
    { q: 'Which tag is for footer?', options: ['<bottom>', '<footer>', '<foot>', '<end>'], correct: 1, explanation: '<footer> is the semantic tag for footer content.' },
    { q: 'Which input type is for email?', options: ['type="mail"', 'type="email"', 'type="e-mail"', 'type="emailaddress"'], correct: 1, explanation: 'type="email" creates an email input field.' },
    { q: 'Which tag embeds video?', options: ['<movie>', '<video>', '<media>', '<embed>'], correct: 1, explanation: '<video> is used to embed video content.' },
    { q: 'Which is NOT a semantic element?', options: ['<article>', '<section>', '<div>', '<aside>'], correct: 2, explanation: '<div> is not semantic - it has no meaning about its content.' },
    { q: 'Which creates a line break?', options: ['<break>', '<br>', '<lb>', '<newline>'], correct: 1, explanation: '<br> creates a line break.' },
    { q: 'Which tag groups form elements?', options: ['<formgroup>', '<fieldset>', '<group>', '<set>'], correct: 1, explanation: '<fieldset> groups related form elements.' },
    { q: 'Which attribute adds tooltip?', options: ['tooltip', 'alt', 'title', 'hint'], correct: 2, explanation: 'The title attribute adds a tooltip on hover.' },
    { q: 'Which tag is for main content?', options: ['<content>', '<main>', '<body>', '<center>'], correct: 1, explanation: '<main> represents the main content of the document.' },
    { q: 'Which input creates a checkbox?', options: ['type="check"', 'type="checkbox"', 'type="box"', 'type="tick"'], correct: 1, explanation: 'type="checkbox" creates a checkbox input.' },
  ],
  css: [
    { q: 'What does CSS stand for?', options: ['Cascading Style Sheets', 'Computer Style Sheets', 'Creative Style Sheets', 'Colorful Style Sheets'], correct: 0, explanation: 'CSS stands for Cascading Style Sheets.' },
    { q: 'Which property changes text color?', options: ['text-color', 'font-color', 'color', 'foreground'], correct: 2, explanation: 'The color property sets the text color.' },
    { q: 'Which selector targets class?', options: ['#class', '.class', '*class', '@class'], correct: 1, explanation: 'The dot (.) prefix targets class selectors.' },
    { q: 'Which property adds background?', options: ['bg-color', 'background', 'back-color', 'bgcolor'], correct: 1, explanation: 'background (or background-color) sets the background.' },
    { q: 'Which unit is relative to root font?', options: ['em', 'rem', 'px', '%'], correct: 1, explanation: 'rem is relative to the root element font size.' },
    { q: 'Which property creates space inside?', options: ['margin', 'padding', 'spacing', 'border'], correct: 1, explanation: 'padding creates space inside an element.' },
    { q: 'Which display value hides element?', options: ['hide', 'none', 'invisible', 'hidden'], correct: 1, explanation: 'display: none removes the element from layout.' },
    { q: 'Which property makes text bold?', options: ['font-style', 'font-weight', 'text-style', 'text-weight'], correct: 1, explanation: 'font-weight controls the boldness of text.' },
    { q: 'Which creates flexbox container?', options: ['display: flexbox', 'display: flex', 'flex: true', 'flexbox: on'], correct: 1, explanation: 'display: flex creates a flex container.' },
    { q: 'Which property controls element order in flex?', options: ['z-index', 'order', 'position', 'index'], correct: 1, explanation: 'The order property controls the order of flex items.' },
    { q: 'Which value centers in flexbox?', options: ['center', 'middle', 'align', 'justify'], correct: 0, explanation: 'center is used with justify-content and align-items.' },
    { q: 'Which property rounds corners?', options: ['corner-radius', 'border-radius', 'round-corner', 'radius'], correct: 1, explanation: 'border-radius rounds the corners of an element.' },
    { q: 'Which pseudo-class is for hover?', options: [':hover', ':active', ':focus', ':visited'], correct: 0, explanation: ':hover applies when the user hovers over an element.' },
    { q: 'Which property creates grid?', options: ['display: grid', 'grid: true', 'display: table', 'layout: grid'], correct: 0, explanation: 'display: grid creates a grid container.' },
    { q: 'Which property adds shadow to box?', options: ['shadow', 'box-shadow', 'drop-shadow', 'element-shadow'], correct: 1, explanation: 'box-shadow adds shadow effects to elements.' },
    { q: 'Which position is relative to viewport?', options: ['absolute', 'relative', 'fixed', 'static'], correct: 2, explanation: 'fixed position is relative to the viewport.' },
    { q: 'Which property controls transparency?', options: ['transparency', 'opacity', 'visible', 'alpha'], correct: 1, explanation: 'opacity controls the transparency level.' },
    { q: 'Which creates smooth transition?', options: ['animation', 'transition', 'transform', 'smooth'], correct: 1, explanation: 'transition creates smooth property changes.' },
    { q: 'Which property rotates element?', options: ['rotate', 'transform', 'turn', 'spin'], correct: 1, explanation: 'transform: rotate() rotates an element.' },
    { q: 'Which media query targets mobile?', options: ['@media screen', '@media mobile', '@media (max-width: 768px)', '@media phone'], correct: 2, explanation: 'max-width media queries target smaller screens.' },
  ],
  mongodb: [
    { q: 'What type of database is MongoDB?', options: ['Relational', 'NoSQL', 'Graph', 'Key-value only'], correct: 1, explanation: 'MongoDB is a NoSQL document database.' },
    { q: 'What format does MongoDB use?', options: ['XML', 'JSON/BSON', 'CSV', 'SQL'], correct: 1, explanation: 'MongoDB stores data in BSON (Binary JSON) format.' },
    { q: 'What is a collection in MongoDB?', options: ['Table equivalent', 'Row', 'Column', 'Index'], correct: 0, explanation: 'A collection is similar to a table in relational databases.' },
    { q: 'Which method inserts a document?', options: ['add()', 'insert()', 'insertOne()', 'create()'], correct: 2, explanation: 'insertOne() inserts a single document.' },
    { q: 'Which method finds documents?', options: ['get()', 'search()', 'find()', 'select()'], correct: 2, explanation: 'find() is used to query documents.' },
    { q: 'What is _id in MongoDB?', options: ['Optional field', 'Unique identifier', 'Index name', 'Collection name'], correct: 1, explanation: '_id is a unique identifier automatically created for each document.' },
    { q: 'Which updates one document?', options: ['update()', 'updateOne()', 'modify()', 'change()'], correct: 1, explanation: 'updateOne() updates a single document.' },
    { q: 'Which operator sets field value?', options: ['$set', '$update', '$modify', '$value'], correct: 0, explanation: '$set sets the value of a field.' },
    { q: 'What is an index?', options: ['Document type', 'Improves query performance', 'Collection name', 'Database name'], correct: 1, explanation: 'Indexes improve query performance.' },
    { q: 'Which deletes one document?', options: ['remove()', 'delete()', 'deleteOne()', 'drop()'], correct: 2, explanation: 'deleteOne() deletes a single document.' },
    { q: 'What is aggregation?', options: ['Adding documents', 'Data processing pipeline', 'Deleting data', 'Creating index'], correct: 1, explanation: 'Aggregation is a pipeline for processing and transforming data.' },
    { q: 'Which operator matches greater than?', options: ['$greater', '$gt', '$more', '$>'], correct: 1, explanation: '$gt is the greater than operator.' },
    { q: 'What is Mongoose?', options: ['Database', 'ODM for Node.js', 'Query language', 'Index type'], correct: 1, explanation: 'Mongoose is an Object Data Modeling library for MongoDB and Node.js.' },
    { q: 'Which finds and modifies?', options: ['findAndUpdate()', 'findOneAndUpdate()', 'updateAndFind()', 'modifyOne()'], correct: 1, explanation: 'findOneAndUpdate() finds and updates a document.' },
    { q: 'What is $push used for?', options: ['Remove from array', 'Add to array', 'Update field', 'Delete document'], correct: 1, explanation: '$push adds an element to an array.' },
    { q: 'Which counts documents?', options: ['count()', 'countDocuments()', 'length()', 'size()'], correct: 1, explanation: 'countDocuments() returns the count of documents.' },
    { q: 'What is $in operator?', options: ['Inside document', 'Matches any value in array', 'Insert data', 'Index'], correct: 1, explanation: '$in matches any value specified in an array.' },
    { q: 'Which sorts results?', options: ['orderBy()', 'sort()', 'arrange()', 'order()'], correct: 1, explanation: 'sort() orders the results.' },
    { q: 'What is $or operator?', options: ['AND logic', 'OR logic', 'NOT logic', 'XOR logic'], correct: 1, explanation: '$or performs logical OR operation.' },
    { q: 'Which limits results?', options: ['limit()', 'max()', 'top()', 'first()'], correct: 0, explanation: 'limit() restricts the number of returned documents.' },
  ],
  sql: [
    { q: 'What does SQL stand for?', options: ['Structured Query Language', 'Simple Query Language', 'Standard Query Language', 'Sequential Query Language'], correct: 0, explanation: 'SQL stands for Structured Query Language.' },
    { q: 'Which retrieves data?', options: ['GET', 'SELECT', 'FETCH', 'RETRIEVE'], correct: 1, explanation: 'SELECT is used to retrieve data from a database.' },
    { q: 'Which inserts new data?', options: ['ADD', 'INSERT', 'CREATE', 'NEW'], correct: 1, explanation: 'INSERT adds new rows to a table.' },
    { q: 'Which updates existing data?', options: ['MODIFY', 'CHANGE', 'UPDATE', 'ALTER'], correct: 2, explanation: 'UPDATE modifies existing records.' },
    { q: 'Which deletes data?', options: ['REMOVE', 'DELETE', 'DROP', 'ERASE'], correct: 1, explanation: 'DELETE removes rows from a table.' },
    { q: 'Which clause filters results?', options: ['FILTER', 'WHERE', 'HAVING', 'WHEN'], correct: 1, explanation: 'WHERE clause filters records.' },
    { q: 'Which joins tables?', options: ['MERGE', 'COMBINE', 'JOIN', 'LINK'], correct: 2, explanation: 'JOIN combines rows from multiple tables.' },
    { q: 'Which sorts results?', options: ['SORT', 'ORDER BY', 'ARRANGE', 'SEQUENCE'], correct: 1, explanation: 'ORDER BY sorts the result set.' },
    { q: 'Which groups rows?', options: ['GROUP BY', 'COMBINE', 'CLUSTER', 'COLLECT'], correct: 0, explanation: 'GROUP BY groups rows with same values.' },
    { q: 'Which returns unique values?', options: ['UNIQUE', 'DISTINCT', 'DIFFERENT', 'SINGLE'], correct: 1, explanation: 'DISTINCT returns only unique values.' },
    { q: 'Which creates a table?', options: ['MAKE TABLE', 'CREATE TABLE', 'NEW TABLE', 'ADD TABLE'], correct: 1, explanation: 'CREATE TABLE creates a new table.' },
    { q: 'Which deletes a table?', options: ['DELETE TABLE', 'REMOVE TABLE', 'DROP TABLE', 'DESTROY TABLE'], correct: 2, explanation: 'DROP TABLE deletes the entire table.' },
    { q: 'Which adds a column?', options: ['ADD COLUMN', 'ALTER TABLE ADD', 'INSERT COLUMN', 'CREATE COLUMN'], correct: 1, explanation: 'ALTER TABLE ADD adds a new column.' },
    { q: 'What is a primary key?', options: ['Any column', 'Unique identifier', 'Foreign reference', 'Index'], correct: 1, explanation: 'Primary key uniquely identifies each row.' },
    { q: 'What is a foreign key?', options: ['External key', 'References another table', 'Primary identifier', 'Index key'], correct: 1, explanation: 'Foreign key references a primary key in another table.' },
    { q: 'Which counts rows?', options: ['SUM()', 'COUNT()', 'TOTAL()', 'NUM()'], correct: 1, explanation: 'COUNT() returns the number of rows.' },
    { q: 'Which finds average?', options: ['MEAN()', 'AVG()', 'AVERAGE()', 'MID()'], correct: 1, explanation: 'AVG() calculates the average value.' },
    { q: 'Which limits results?', options: ['LIMIT', 'TOP', 'FIRST', 'All depend on DB'], correct: 3, explanation: 'LIMIT (MySQL), TOP (SQL Server) - syntax varies by database.' },
    { q: 'Which combines results?', options: ['MERGE', 'UNION', 'COMBINE', 'ADD'], correct: 1, explanation: 'UNION combines results from multiple SELECT statements.' },
    { q: 'What is NULL?', options: ['Zero', 'Empty string', 'Unknown/missing value', 'False'], correct: 2, explanation: 'NULL represents unknown or missing data.' },
  ],
  git: [
    { q: 'What is Git?', options: ['Language', 'Version control system', 'Database', 'Framework'], correct: 1, explanation: 'Git is a distributed version control system.' },
    { q: 'Which initializes a repository?', options: ['git start', 'git init', 'git create', 'git new'], correct: 1, explanation: 'git init initializes a new Git repository.' },
    { q: 'Which stages changes?', options: ['git stage', 'git add', 'git commit', 'git push'], correct: 1, explanation: 'git add stages changes for commit.' },
    { q: 'Which saves changes?', options: ['git save', 'git push', 'git commit', 'git store'], correct: 2, explanation: 'git commit saves staged changes.' },
    { q: 'Which uploads to remote?', options: ['git upload', 'git send', 'git push', 'git sync'], correct: 2, explanation: 'git push uploads commits to remote repository.' },
    { q: 'Which downloads from remote?', options: ['git download', 'git get', 'git pull', 'git fetch'], correct: 2, explanation: 'git pull fetches and merges from remote.' },
    { q: 'Which shows commit history?', options: ['git history', 'git log', 'git show', 'git list'], correct: 1, explanation: 'git log shows the commit history.' },
    { q: 'Which creates a branch?', options: ['git branch name', 'git create name', 'git new name', 'git make name'], correct: 0, explanation: 'git branch name creates a new branch.' },
    { q: 'Which switches branches?', options: ['git switch', 'git checkout', 'git change', 'Both A and B'], correct: 3, explanation: 'Both git switch and git checkout can switch branches.' },
    { q: 'Which merges branches?', options: ['git combine', 'git merge', 'git join', 'git add'], correct: 1, explanation: 'git merge combines branches.' },
    { q: 'Which shows status?', options: ['git info', 'git status', 'git show', 'git check'], correct: 1, explanation: 'git status shows the working tree status.' },
    { q: 'Which clones a repository?', options: ['git copy', 'git clone', 'git download', 'git get'], correct: 1, explanation: 'git clone copies a repository.' },
    { q: 'What is a commit?', options: ['Branch', 'Snapshot of changes', 'Remote', 'Merge'], correct: 1, explanation: 'A commit is a snapshot of your changes.' },
    { q: 'What is HEAD?', options: ['First commit', 'Current commit pointer', 'Branch name', 'Remote'], correct: 1, explanation: 'HEAD points to the current commit.' },
    { q: 'Which undoes last commit?', options: ['git undo', 'git reset', 'git revert', 'Both B and C'], correct: 3, explanation: 'Both reset and revert can undo commits differently.' },
    { q: 'What is .gitignore?', options: ['Git config', 'Files to ignore', 'Branch list', 'Commit log'], correct: 1, explanation: '.gitignore specifies files Git should ignore.' },
    { q: 'Which shows differences?', options: ['git compare', 'git diff', 'git show', 'git check'], correct: 1, explanation: 'git diff shows changes between commits.' },
    { q: 'What is a remote?', options: ['Local repo', 'Server repository', 'Branch', 'Commit'], correct: 1, explanation: 'A remote is a repository hosted on a server.' },
    { q: 'Which lists branches?', options: ['git list', 'git branch', 'git branches', 'git show'], correct: 1, explanation: 'git branch lists all branches.' },
    { q: 'What is GitHub?', options: ['Git command', 'Hosting service', 'Branch type', 'Git version'], correct: 1, explanation: 'GitHub is a hosting service for Git repositories.' },
  ]
});

// Additional generic programming MCQs
const getGenericMCQs = () => [
  { q: 'What is an algorithm?', options: ['A program', 'Step-by-step solution', 'A language', 'A database'], correct: 1, tech: 'general', difficulty: 'easy' },
  { q: 'What is a variable?', options: ['Constant value', 'Storage location', 'Function', 'Loop'], correct: 1, tech: 'general', difficulty: 'easy' },
  { q: 'What is a function?', options: ['Variable', 'Reusable code block', 'Loop type', 'Data type'], correct: 1, tech: 'general', difficulty: 'easy' },
  { q: 'What is a loop?', options: ['Error', 'Repeated execution', 'Variable', 'Function'], correct: 1, tech: 'general', difficulty: 'easy' },
  { q: 'What is debugging?', options: ['Adding bugs', 'Finding and fixing errors', 'Writing code', 'Testing'], correct: 1, tech: 'general', difficulty: 'easy' },
  { q: 'What is an array?', options: ['Single value', 'Collection of values', 'Function', 'Class'], correct: 1, tech: 'general', difficulty: 'easy' },
  { q: 'What is OOP?', options: ['Object-Oriented Programming', 'Online Operating Program', 'Open Office Protocol', 'Output Operation Process'], correct: 0, tech: 'general', difficulty: 'medium' },
  { q: 'What is inheritance?', options: ['Copying code', 'Deriving from parent class', 'Creating variables', 'Looping'], correct: 1, tech: 'general', difficulty: 'medium' },
  { q: 'What is an API?', options: ['Application Programming Interface', 'Automated Program Integration', 'Advanced Programming Index', 'Application Process Integration'], correct: 0, tech: 'general', difficulty: 'medium' },
  { q: 'What is recursion?', options: ['Iteration', 'Function calling itself', 'Variable declaration', 'Loop type'], correct: 1, tech: 'general', difficulty: 'medium' },
  { q: 'What is Big O notation?', options: ['Syntax', 'Algorithm efficiency measure', 'Variable type', 'Function name'], correct: 1, tech: 'general', difficulty: 'hard' },
  { q: 'What is a stack?', options: ['FIFO structure', 'LIFO structure', 'Random access', 'Tree structure'], correct: 1, tech: 'general', difficulty: 'medium' },
  { q: 'What is a queue?', options: ['LIFO structure', 'FIFO structure', 'Stack type', 'Array type'], correct: 1, tech: 'general', difficulty: 'medium' },
  { q: 'What is a linked list?', options: ['Array', 'Nodes with pointers', 'Tree', 'Graph'], correct: 1, tech: 'general', difficulty: 'medium' },
  { q: 'What is time complexity?', options: ['Code length', 'Execution time growth', 'Memory usage', 'Line count'], correct: 1, tech: 'general', difficulty: 'hard' },
  { q: 'What is a binary tree?', options: ['Linear structure', 'Each node has max 2 children', 'Graph type', 'Stack type'], correct: 1, tech: 'general', difficulty: 'medium' },
  { q: 'What is a hash table?', options: ['Array', 'Key-value storage with hashing', 'Tree', 'Queue'], correct: 1, tech: 'general', difficulty: 'hard' },
  { q: 'What is MVC?', options: ['Memory Variable Cache', 'Model-View-Controller', 'Main Visual Component', 'Module Version Control'], correct: 1, tech: 'general', difficulty: 'medium' },
  { q: 'What is a design pattern?', options: ['UI design', 'Reusable solution template', 'Code style', 'Framework'], correct: 1, tech: 'general', difficulty: 'medium' },
  { q: 'What is microservices?', options: ['Small functions', 'Independent deployable services', 'Mini databases', 'Tiny APIs'], correct: 1, tech: 'general', difficulty: 'hard' },
];

const seedMCQs = async () => {
  try {
    // Clear existing MCQs
    await MCQ.deleteMany({});
    console.log('   └── Cleared existing MCQs');

    // Get all technologies and courses
    const technologies = await Technology.find({ isPublished: true });
    const courses = await Course.find({ isPublished: true });

    const techMap = {};
    technologies.forEach(t => { techMap[t.slug] = t; });

    const courseMap = {};
    courses.forEach(c => { 
      if (c.technology) {
        const techId = c.technology.toString();
        if (!courseMap[techId]) courseMap[techId] = [];
        courseMap[techId].push(c);
      }
    });

    const templates = getMCQTemplates();
    const genericMCQs = getGenericMCQs();
    const difficulties = ['easy', 'medium', 'hard', 'expert'];
    const categories = ['course', 'skill', 'interview', 'certification'];
    const interviewLevels = ['fresher', 'junior', 'mid', 'senior'];

    const allMCQs = [];
    let mcqCount = 0;

    // Generate MCQs for each technology
    for (const [techSlug, techMCQs] of Object.entries(templates)) {
      const technology = techMap[techSlug];
      if (!technology) continue;

      const techCourses = courseMap[technology._id.toString()] || [];
      const course = techCourses.length > 0 ? techCourses[0] : null;

      for (let i = 0; i < techMCQs.length; i++) {
        const mcqData = techMCQs[i];
        const difficulty = difficulties[Math.floor(i / 5) % 4];
        const category = categories[i % 4];

        const mcq = {
          question: mcqData.q,
          questionType: 'text',
          options: mcqData.options.map((text, idx) => ({
            text,
            isCorrect: idx === mcqData.correct,
            explanation: idx === mcqData.correct ? mcqData.explanation : ''
          })),
          correctAnswer: mcqData.correct,
          explanation: mcqData.explanation,
          category,
          technology: technology._id,
          course: course?._id,
          difficulty,
          interviewLevel: category === 'interview' ? interviewLevels[i % 4] : undefined,
          points: difficulty === 'easy' ? 5 : difficulty === 'medium' ? 10 : difficulty === 'hard' ? 15 : 20,
          timeLimit: difficulty === 'easy' ? 30 : difficulty === 'medium' ? 60 : 90,
          tags: [techSlug, difficulty, category],
          isActive: true
        };

        allMCQs.push(mcq);
        mcqCount++;
      }

      // Add variations to reach more MCQs per technology
      for (let v = 0; v < 5; v++) {
        for (let i = 0; i < Math.min(10, techMCQs.length); i++) {
          const mcqData = techMCQs[i];
          const difficulty = difficulties[(i + v) % 4];
          const category = categories[(i + v) % 4];

          const mcq = {
            question: `[${technology.name}] ${mcqData.q}`,
            questionType: 'text',
            options: mcqData.options.map((text, idx) => ({
              text,
              isCorrect: idx === mcqData.correct,
              explanation: idx === mcqData.correct ? mcqData.explanation : ''
            })),
            correctAnswer: mcqData.correct,
            explanation: `In ${technology.name}: ${mcqData.explanation}`,
            category,
            technology: technology._id,
            course: course?._id,
            difficulty,
            interviewLevel: category === 'interview' ? interviewLevels[(i + v) % 4] : undefined,
            points: difficulty === 'easy' ? 5 : difficulty === 'medium' ? 10 : difficulty === 'hard' ? 15 : 20,
            timeLimit: difficulty === 'easy' ? 30 : difficulty === 'medium' ? 60 : 90,
            tags: [techSlug, difficulty, category, 'variation'],
            isActive: true
          };

          allMCQs.push(mcq);
          mcqCount++;
          
          if (mcqCount >= 500) break;
        }
        if (mcqCount >= 500) break;
      }
      if (mcqCount >= 500) break;
    }

    // Add generic MCQs if we need more
    if (mcqCount < 500) {
      const techArray = Object.values(techMap);
      for (const genericMcq of genericMCQs) {
        if (mcqCount >= 500) break;
        
        const randomTech = techArray[mcqCount % techArray.length];
        const techCourses = courseMap[randomTech._id.toString()] || [];
        const course = techCourses.length > 0 ? techCourses[0] : null;

        const mcq = {
          question: genericMcq.q,
          questionType: 'text',
          options: genericMcq.options.map((text, idx) => ({
            text,
            isCorrect: idx === genericMcq.correct,
            explanation: ''
          })),
          correctAnswer: genericMcq.correct,
          explanation: `The correct answer demonstrates fundamental programming concepts.`,
          category: categories[mcqCount % 4],
          technology: randomTech._id,
          course: course?._id,
          difficulty: genericMcq.difficulty || 'medium',
          points: 10,
          timeLimit: 60,
          tags: ['general', 'programming', genericMcq.difficulty || 'medium'],
          isActive: true
        };

        allMCQs.push(mcq);
        mcqCount++;
      }
    }

    // Insert all MCQs
    const insertedMCQs = await MCQ.insertMany(allMCQs.slice(0, 500));
    console.log(`   └── Created ${insertedMCQs.length} MCQs`);
    
    return insertedMCQs;
  } catch (error) {
    console.error('   └── Error seeding MCQs:', error.message);
    throw error;
  }
};

module.exports = { seedMCQs };
