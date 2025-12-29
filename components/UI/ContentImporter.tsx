'use client';

import { useState, useRef } from 'react';

interface ImportResult {
  success: boolean;
  imported: number;
  failed: number;
  errors: string[];
}

interface ContentImporterProps {
  type: 'course' | 'courses' | 'tutorial' | 'tutorials' | 'mcq' | 'mcqs' | 'roadmap' | 'roadmaps' | 'cheatsheet' | 'cheatsheets';
  technologyId?: string;
  onImportComplete: (result: ImportResult) => void;
  onClose: () => void;
}

const SAMPLE_TEMPLATES = {
  courses: {
    title: "Python Complete Course",
    slug: "python-complete-course",
    description: "Master Python programming from scratch",
    shortDescription: "Learn Python basics to advanced",
    level: "beginner",
    language: "English",
    pricing: { type: "free", price: 0 },
    sections: [
      {
        title: "Getting Started",
        description: "Introduction to Python",
        order: 1,
        lessons: [
          {
            title: "What is Python?",
            contentType: "video",
            videoUrl: "https://www.youtube.com/watch?v=example",
            videoProvider: "youtube",
            videoDuration: 600,
            content: "# Introduction\n\nPython is a versatile programming language...",
            isFree: true,
            order: 1
          },
          {
            title: "Installing Python",
            contentType: "article",
            content: "# Installing Python\n\n## Windows\n\n```bash\nwinget install Python.Python.3.12\n```\n\n## Mac\n\n```bash\nbrew install python\n```",
            isFree: true,
            order: 2
          },
          {
            title: "Your First Code",
            contentType: "code",
            content: "# Hello World in Python\nprint('Hello, World!')\n\n# Variables\nname = 'Student'\nprint(f'Hello, {name}!')",
            language: "python",
            isFree: false,
            order: 3
          }
        ]
      },
      {
        title: "Python Basics",
        description: "Core concepts of Python",
        order: 2,
        lessons: [
          {
            title: "Variables and Data Types",
            contentType: "video",
            videoUrl: "https://youtu.be/example2",
            videoProvider: "youtube",
            videoDuration: 900,
            content: "Learn about Python variables...",
            isFree: false,
            order: 1
          }
        ]
      }
    ],
    learningObjectives: [
      "Understand Python fundamentals",
      "Write Python programs",
      "Work with data structures"
    ],
    requirements: ["Computer with internet", "Basic computer skills"],
    tags: ["python", "programming", "beginner"]
  },
  
  tutorials: [
    {
      title: "HTML Basics",
      slug: "html-basics",
      description: "Learn the fundamentals of HTML",
      content: "# HTML Basics\n\n## What is HTML?\n\nHTML (HyperText Markup Language) is the standard markup language for creating web pages.\n\n## Basic Structure\n\n```html\n<!DOCTYPE html>\n<html>\n<head>\n    <title>My Page</title>\n</head>\n<body>\n    <h1>Hello World</h1>\n</body>\n</html>\n```\n\n## Common Tags\n\n- `<h1>` to `<h6>` - Headings\n- `<p>` - Paragraph\n- `<a>` - Links\n- `<img>` - Images",
      order: 1,
      icon: "📄",
      estimatedTime: 15,
      difficulty: "beginner",
      videoUrl: "https://www.youtube.com/watch?v=html-intro",
      videoProvider: "youtube",
      keyPoints: [
        "HTML is the structure of web pages",
        "Tags come in pairs",
        "Attributes provide additional information"
      ],
      codeExamples: [
        {
          title: "Basic HTML Page",
          language: "html",
          code: "<!DOCTYPE html>\n<html>\n<head>\n    <title>My First Page</title>\n</head>\n<body>\n    <h1>Welcome!</h1>\n    <p>This is my first HTML page.</p>\n</body>\n</html>",
          output: "Renders a simple webpage with a heading and paragraph"
        }
      ]
    },
    {
      title: "HTML Elements",
      slug: "html-elements",
      description: "Deep dive into HTML elements",
      content: "# HTML Elements\n\n## Text Elements\n\n```html\n<h1>Heading 1</h1>\n<p>Paragraph text</p>\n<strong>Bold text</strong>\n<em>Italic text</em>\n```\n\n## Lists\n\n```html\n<ul>\n    <li>Unordered item</li>\n</ul>\n<ol>\n    <li>Ordered item</li>\n</ol>\n```",
      order: 2,
      icon: "🏷️",
      estimatedTime: 20,
      difficulty: "beginner",
      keyPoints: ["Block vs Inline elements", "Semantic HTML", "Nesting elements"]
    }
  ],
  
  mcqs: [
    {
      question: "What does HTML stand for?",
      category: "technology",
      difficulty: "easy",
      skill: "html-basics",
      points: 10,
      options: [
        { text: "Hyper Text Markup Language", isCorrect: true },
        { text: "High Tech Modern Language", isCorrect: false },
        { text: "Hyperlink Text Management Language", isCorrect: false },
        { text: "Home Tool Markup Language", isCorrect: false }
      ],
      explanation: "HTML stands for HyperText Markup Language. It is the standard markup language for creating web pages.",
      isActive: true
    },
    {
      question: "Which Python keyword is used to define a function?",
      category: "technology",
      difficulty: "easy",
      skill: "python-basics",
      points: 10,
      options: [
        { text: "function", isCorrect: false },
        { text: "def", isCorrect: true },
        { text: "func", isCorrect: false },
        { text: "define", isCorrect: false }
      ],
      explanation: "In Python, the 'def' keyword is used to define a function. For example: def my_function():",
      isActive: true
    },
    {
      question: "What is the output of print(2 ** 3) in Python?",
      category: "technology",
      difficulty: "medium",
      skill: "python-operators",
      points: 15,
      options: [
        { text: "6", isCorrect: false },
        { text: "8", isCorrect: true },
        { text: "5", isCorrect: false },
        { text: "23", isCorrect: false }
      ],
      explanation: "The ** operator in Python is the exponentiation operator. 2 ** 3 means 2 raised to the power of 3, which equals 8.",
      isActive: true
    }
  ],
  
  roadmaps: {
    title: "Python Developer Roadmap",
    slug: "python-developer-roadmap",
    description: "Complete roadmap to become a Python developer",
    estimatedTime: "6 months",
    difficulty: "beginner",
    nodes: [
      {
        id: "basics",
        title: "Python Basics",
        description: "Variables, data types, operators",
        type: "milestone",
        order: 1,
        resources: [
          { title: "Python Docs", url: "https://docs.python.org", type: "documentation" },
          { title: "Python Basics Course", url: "/courses/python-basics", type: "course" }
        ],
        children: ["control-flow", "functions"]
      },
      {
        id: "control-flow",
        title: "Control Flow",
        description: "If/else, loops, exceptions",
        type: "topic",
        order: 2,
        parentId: "basics",
        children: ["data-structures"]
      },
      {
        id: "functions",
        title: "Functions",
        description: "Defining functions, arguments, returns",
        type: "topic",
        order: 3,
        parentId: "basics",
        children: ["oop"]
      },
      {
        id: "data-structures",
        title: "Data Structures",
        description: "Lists, tuples, dictionaries, sets",
        type: "milestone",
        order: 4,
        children: ["oop"]
      },
      {
        id: "oop",
        title: "Object-Oriented Programming",
        description: "Classes, inheritance, polymorphism",
        type: "milestone",
        order: 5,
        children: ["modules", "file-handling"]
      },
      {
        id: "modules",
        title: "Modules & Packages",
        description: "Importing, creating modules, pip",
        type: "topic",
        order: 6,
        parentId: "oop",
        children: ["web-dev", "data-science"]
      },
      {
        id: "file-handling",
        title: "File Handling",
        description: "Reading/writing files, JSON, CSV",
        type: "topic",
        order: 7,
        parentId: "oop"
      },
      {
        id: "web-dev",
        title: "Web Development",
        description: "Flask, Django, FastAPI",
        type: "specialization",
        order: 8,
        optional: true
      },
      {
        id: "data-science",
        title: "Data Science",
        description: "NumPy, Pandas, Matplotlib",
        type: "specialization",
        order: 9,
        optional: true
      }
    ],
    connections: [
      { from: "basics", to: "control-flow", type: "required" },
      { from: "basics", to: "functions", type: "required" },
      { from: "control-flow", to: "data-structures", type: "required" },
      { from: "functions", to: "oop", type: "required" },
      { from: "data-structures", to: "oop", type: "required" },
      { from: "oop", to: "modules", type: "required" },
      { from: "oop", to: "file-handling", type: "required" },
      { from: "modules", to: "web-dev", type: "optional" },
      { from: "modules", to: "data-science", type: "optional" }
    ]
  },
  
  cheatsheets: {
    title: "Python Cheatsheet",
    slug: "python-cheatsheet",
    description: "Quick reference for Python programming",
    category: "syntax",
    difficulty: "beginner",
    icon: "🐍",
    color: "#3776ab",
    content: "# Python Quick Reference\n\n## Variables\n```python\nname = 'John'\nage = 25\nis_student = True\n```\n\n## Data Types\n```python\nstr, int, float, bool, list, tuple, dict, set\n```\n\n## Lists\n```python\nfruits = ['apple', 'banana', 'cherry']\nfruits.append('date')\nfruits[0]  # 'apple'\n```",
    sections: [
      {
        title: "Variables & Data Types",
        items: [
          { command: "x = 5", description: "Integer variable", example: "age = 25" },
          { command: "x = 'hello'", description: "String variable", example: "name = 'John'" },
          { command: "x = [1, 2, 3]", description: "List", example: "numbers = [1, 2, 3, 4, 5]" },
          { command: "x = {'a': 1}", description: "Dictionary", example: "person = {'name': 'John', 'age': 25}" }
        ]
      },
      {
        title: "Control Flow",
        items: [
          { command: "if condition:", description: "If statement", example: "if x > 5:\n    print('big')" },
          { command: "for item in list:", description: "For loop", example: "for i in range(5):\n    print(i)" },
          { command: "while condition:", description: "While loop", example: "while x > 0:\n    x -= 1" }
        ]
      },
      {
        title: "Functions",
        items: [
          { command: "def func():", description: "Define function", example: "def greet(name):\n    return f'Hello, {name}'" },
          { command: "lambda x: x*2", description: "Lambda function", example: "double = lambda x: x * 2" },
          { command: "*args, **kwargs", description: "Variable arguments", example: "def func(*args, **kwargs):" }
        ]
      },
      {
        title: "String Methods",
        items: [
          { command: "s.upper()", description: "Uppercase", example: "'hello'.upper() # 'HELLO'" },
          { command: "s.lower()", description: "Lowercase", example: "'HELLO'.lower() # 'hello'" },
          { command: "s.split()", description: "Split string", example: "'a,b,c'.split(',') # ['a','b','c']" },
          { command: "s.strip()", description: "Remove whitespace", example: "'  hi  '.strip() # 'hi'" },
          { command: "f'{var}'", description: "F-string", example: "f'Hello, {name}!'" }
        ]
      }
    ],
    tags: ["python", "programming", "reference"]
  }
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function ContentImporter({ type, technologyId, onImportComplete, onClose }: ContentImporterProps) {
  const [importing, setImporting] = useState(false);
  const [jsonContent, setJsonContent] = useState('');
  const [activeTab, setActiveTab] = useState<'paste' | 'upload' | 'sample'>('sample');
  const [selectedSample, setSelectedSample] = useState<string>('');
  const [previewData, setPreviewData] = useState<any>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Normalize type to plural form for template lookup
  const normalizeType = (t: string) => {
    const typeMap: Record<string, keyof typeof SAMPLE_TEMPLATES> = {
      'course': 'courses',
      'courses': 'courses',
      'tutorial': 'tutorials',
      'tutorials': 'tutorials',
      'mcq': 'mcqs',
      'mcqs': 'mcqs',
      'roadmap': 'roadmaps',
      'roadmaps': 'roadmaps',
      'cheatsheet': 'cheatsheets',
      'cheatsheets': 'cheatsheets'
    };
    return typeMap[t] || 'courses';
  };

  const getSampleTemplate = () => {
    const normalizedType = normalizeType(type);
    return JSON.stringify(SAMPLE_TEMPLATES[normalizedType], null, 2);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setJsonContent(content);
      validateAndPreview(content);
    };
    reader.readAsText(file);
  };

  const validateAndPreview = (content: string) => {
    setValidationErrors([]);
    try {
      const data = JSON.parse(content);
      setPreviewData(data);
      
      // Basic validation
      const errors: string[] = [];
      const normalizedType = normalizeType(type);
      
      if (normalizedType === 'courses') {
        if (!data.title) errors.push('Course title is required');
        if (!data.sections || !Array.isArray(data.sections)) errors.push('Sections array is required');
      } else if (normalizedType === 'tutorials') {
        const tutorials = Array.isArray(data) ? data : [data];
        tutorials.forEach((t, i) => {
          if (!t.title) errors.push(`Tutorial ${i + 1}: title is required`);
        });
      } else if (normalizedType === 'mcqs') {
        const mcqs = Array.isArray(data) ? data : [data];
        mcqs.forEach((m, i) => {
          if (!m.question) errors.push(`MCQ ${i + 1}: question is required`);
          if (!m.options || m.options.length < 2) errors.push(`MCQ ${i + 1}: at least 2 options required`);
        });
      } else if (normalizedType === 'roadmaps') {
        if (!data.title) errors.push('Roadmap title is required');
        if (!data.name) errors.push('Roadmap name is required');
      } else if (normalizedType === 'cheatsheets') {
        if (!data.title) errors.push('Cheatsheet title is required');
      }
      
      setValidationErrors(errors);
    } catch (err) {
      setValidationErrors(['Invalid JSON format']);
      setPreviewData(null);
    }
  };

  const loadSample = () => {
    const sample = getSampleTemplate();
    setJsonContent(sample);
    validateAndPreview(sample);
  };

  const handleImport = async () => {
    if (!previewData || validationErrors.length > 0) return;
    
    setImporting(true);
    try {
      const token = localStorage.getItem('accessToken');
      let endpoint = '';
      let payload = previewData;

      switch (type) {
        case 'course':
        case 'courses':
          endpoint = `${API_URL}/courses/import`;
          if (technologyId) payload.technology = technologyId;
          break;
        case 'tutorial':
        case 'tutorials':
          endpoint = `${API_URL}/tutorials/admin/import`;
          if (technologyId) {
            const tutorials = Array.isArray(payload) ? payload : [payload];
            payload = tutorials.map(t => ({ ...t, technologyId }));
          }
          break;
        case 'mcq':
        case 'mcqs':
          endpoint = `${API_URL}/mcqs/import`;
          if (technologyId) {
            const mcqs = Array.isArray(payload) ? payload : [payload];
            payload = mcqs.map(m => ({ ...m, technology: technologyId }));
          }
          break;
        case 'roadmap':
        case 'roadmaps':
          endpoint = `${API_URL}/roadmaps/import`;
          if (technologyId) payload.technology = technologyId;
          break;
        case 'cheatsheet':
        case 'cheatsheets':
          endpoint = `${API_URL}/cheatsheets/import`;
          if (technologyId) payload.technology = technologyId;
          break;
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      
      if (response.ok) {
        onImportComplete({
          success: true,
          imported: result.imported || 1,
          failed: result.failed || 0,
          errors: result.errors || []
        });
      } else {
        onImportComplete({
          success: false,
          imported: 0,
          failed: 1,
          errors: [result.message || 'Import failed']
        });
      }
    } catch (error) {
      onImportComplete({
        success: false,
        imported: 0,
        failed: 1,
        errors: ['Network error occurred']
      });
    } finally {
      setImporting(false);
    }
  };

  const getTypeLabel = () => {
    const labels: Record<string, string> = {
      courses: 'Course with Sections & Lessons',
      tutorials: 'Tutorial Chapters',
      mcqs: 'MCQ Questions',
      roadmaps: 'Learning Roadmap',
      cheatsheets: 'Cheatsheet'
    };
    return labels[type] || type;
  };

  const getPreviewSummary = () => {
    if (!previewData) return null;
    
    switch (type) {
      case 'courses':
        return (
          <div className="space-y-2">
            <p><strong>📚 Course:</strong> {previewData.title}</p>
            <p><strong>📊 Level:</strong> {previewData.level}</p>
            <p><strong>📁 Sections:</strong> {previewData.sections?.length || 0}</p>
            <p><strong>📖 Total Lessons:</strong> {previewData.sections?.reduce((acc: number, s: any) => acc + (s.lessons?.length || 0), 0) || 0}</p>
            <p><strong>🎥 Video Lessons:</strong> {previewData.sections?.reduce((acc: number, s: any) => acc + (s.lessons?.filter((l: any) => l.contentType === 'video').length || 0), 0) || 0}</p>
          </div>
        );
      case 'tutorials':
        const tutorials = Array.isArray(previewData) ? previewData : [previewData];
        return (
          <div className="space-y-2">
            <p><strong>📚 Chapters:</strong> {tutorials.length}</p>
            {tutorials.slice(0, 3).map((t: any, i: number) => (
              <p key={i} className="text-sm text-[var(--text-muted)]">• {t.title}</p>
            ))}
            {tutorials.length > 3 && <p className="text-sm text-[var(--text-muted)]">...and {tutorials.length - 3} more</p>}
          </div>
        );
      case 'mcqs':
        const mcqs = Array.isArray(previewData) ? previewData : [previewData];
        return (
          <div className="space-y-2">
            <p><strong>❓ Questions:</strong> {mcqs.length}</p>
            <p><strong>📊 Difficulties:</strong> {[...new Set(mcqs.map((m: any) => m.difficulty))].join(', ')}</p>
            <p><strong>🏆 Total Points:</strong> {mcqs.reduce((acc: number, m: any) => acc + (m.points || 10), 0)}</p>
          </div>
        );
      case 'roadmaps':
        return (
          <div className="space-y-2">
            <p><strong>🗺️ Roadmap:</strong> {previewData.title}</p>
            <p><strong>📍 Nodes:</strong> {previewData.nodes?.length || 0}</p>
            <p><strong>🔗 Connections:</strong> {previewData.connections?.length || 0}</p>
            <p><strong>⏱️ Est. Time:</strong> {previewData.estimatedTime}</p>
          </div>
        );
      case 'cheatsheets':
        return (
          <div className="space-y-2">
            <p><strong>📋 Cheatsheet:</strong> {previewData.title}</p>
            <p><strong>📁 Sections:</strong> {previewData.sections?.length || 0}</p>
            <p><strong>📝 Items:</strong> {previewData.sections?.reduce((acc: number, s: any) => acc + (s.items?.length || 0), 0) || 0}</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[var(--bg-card)] rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-[var(--border-primary)] flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-[var(--text-primary)]">📥 Import {getTypeLabel()}</h2>
            <p className="text-sm text-[var(--text-muted)] mt-1">Import content from JSON format</p>
          </div>
          <button onClick={onClose} className="text-2xl text-[var(--text-muted)] hover:text-[var(--text-primary)]">×</button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[var(--border-primary)]">
          {[
            { key: 'sample', label: '📄 Sample Template', icon: '📄' },
            { key: 'paste', label: '📋 Paste JSON', icon: '📋' },
            { key: 'upload', label: '📁 Upload File', icon: '📁' }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? 'text-[var(--accent-primary)] border-b-2 border-[var(--accent-primary)] bg-[var(--bg-secondary)]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input Section */}
            <div>
              {activeTab === 'sample' && (
                <div className="space-y-4">
                  <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                    <h3 className="font-medium text-blue-600 mb-2">💡 Sample Template</h3>
                    <p className="text-sm text-[var(--text-muted)]">
                      Click "Load Sample" to see a complete example for {getTypeLabel().toLowerCase()}.
                      You can modify it and import.
                    </p>
                  </div>
                  <button
                    onClick={loadSample}
                    className="w-full py-3 bg-[var(--accent-primary)] text-white rounded-lg hover:opacity-90 font-medium"
                  >
                    📥 Load Sample Template
                  </button>
                  {jsonContent && (
                    <textarea
                      value={jsonContent}
                      onChange={(e) => {
                        setJsonContent(e.target.value);
                        validateAndPreview(e.target.value);
                      }}
                      className="w-full h-[300px] p-4 font-mono text-sm bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg resize-none"
                      placeholder="JSON will appear here..."
                    />
                  )}
                </div>
              )}

              {activeTab === 'paste' && (
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-[var(--text-primary)]">
                    Paste your JSON content:
                  </label>
                  <textarea
                    value={jsonContent}
                    onChange={(e) => {
                      setJsonContent(e.target.value);
                      validateAndPreview(e.target.value);
                    }}
                    className="w-full h-[400px] p-4 font-mono text-sm bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg resize-none"
                    placeholder='{\n  "title": "Course Title",\n  "sections": [...]\n}'
                  />
                </div>
              )}

              {activeTab === 'upload' && (
                <div className="space-y-4">
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-[var(--border-primary)] rounded-lg p-8 text-center cursor-pointer hover:border-[var(--accent-primary)] transition-colors"
                  >
                    <div className="text-4xl mb-4">📁</div>
                    <p className="text-[var(--text-primary)] font-medium">Click to upload JSON file</p>
                    <p className="text-sm text-[var(--text-muted)] mt-1">or drag and drop</p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  {jsonContent && (
                    <textarea
                      value={jsonContent}
                      onChange={(e) => {
                        setJsonContent(e.target.value);
                        validateAndPreview(e.target.value);
                      }}
                      className="w-full h-[300px] p-4 font-mono text-sm bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg resize-none"
                    />
                  )}
                </div>
              )}
            </div>

            {/* Preview Section */}
            <div>
              <h3 className="font-medium text-[var(--text-primary)] mb-4">📊 Preview</h3>
              
              {validationErrors.length > 0 && (
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg mb-4">
                  <h4 className="font-medium text-red-500 mb-2">⚠️ Validation Errors</h4>
                  <ul className="text-sm text-red-400 space-y-1">
                    {validationErrors.map((err, i) => (
                      <li key={i}>• {err}</li>
                    ))}
                  </ul>
                </div>
              )}

              {previewData && validationErrors.length === 0 && (
                <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                  <h4 className="font-medium text-green-600 mb-3">✅ Valid JSON</h4>
                  {getPreviewSummary()}
                </div>
              )}

              {!previewData && validationErrors.length === 0 && (
                <div className="p-8 text-center text-[var(--text-muted)] border border-[var(--border-primary)] rounded-lg">
                  <div className="text-4xl mb-4">📝</div>
                  <p>Load a template or paste JSON to preview</p>
                </div>
              )}

              {/* Format Guide */}
              <div className="mt-6 p-4 bg-[var(--bg-secondary)] rounded-lg">
                <h4 className="font-medium text-[var(--text-primary)] mb-2">📖 Format Guide</h4>
                <ul className="text-sm text-[var(--text-muted)] space-y-2">
                  {type === 'courses' && (
                    <>
                      <li>• <strong>videoUrl:</strong> YouTube URL (youtube.com/watch?v=... or youtu.be/...)</li>
                      <li>• <strong>contentType:</strong> video, article, quiz, or code</li>
                      <li>• <strong>content:</strong> Supports Markdown with code blocks</li>
                    </>
                  )}
                  {type === 'tutorials' && (
                    <>
                      <li>• <strong>content:</strong> Full HTML/Markdown content</li>
                      <li>• <strong>codeExamples:</strong> Array of code snippets with output</li>
                      <li>• <strong>videoUrl:</strong> Optional YouTube video link</li>
                    </>
                  )}
                  {type === 'mcqs' && (
                    <>
                      <li>• <strong>options:</strong> Array with at least 2 options</li>
                      <li>• <strong>isCorrect:</strong> Mark one option as correct</li>
                      <li>• <strong>explanation:</strong> Explain the correct answer</li>
                    </>
                  )}
                  {type === 'roadmaps' && (
                    <>
                      <li>• <strong>nodes:</strong> Learning path milestones</li>
                      <li>• <strong>connections:</strong> Links between nodes</li>
                      <li>• <strong>type:</strong> milestone, topic, or specialization</li>
                    </>
                  )}
                  {type === 'cheatsheets' && (
                    <>
                      <li>• <strong>sections:</strong> Grouped commands/snippets</li>
                      <li>• <strong>items:</strong> command, description, example</li>
                      <li>• <strong>content:</strong> Full Markdown content</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-[var(--border-primary)] flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-[var(--border-primary)] rounded-lg hover:bg-[var(--bg-secondary)]"
          >
            Cancel
          </button>
          <button
            onClick={handleImport}
            disabled={importing || !previewData || validationErrors.length > 0}
            className="px-6 py-2 bg-[var(--accent-primary)] text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {importing ? (
              <>
                <span className="animate-spin">⏳</span>
                Importing...
              </>
            ) : (
              <>
                📥 Import {getTypeLabel()}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
