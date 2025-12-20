'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import Layout from '@/components/Layout';

const cheatsheetsData: Record<string, { title: string; description: string; sections: { title: string; content: string }[] }> = {
  'machine-learning': {
    title: 'Machine Learning Cheatsheet',
    description: 'Complete reference guide for Machine Learning algorithms and concepts',
    sections: [
      { title: 'Supervised Learning', content: 'Linear Regression, Logistic Regression, Decision Trees, Random Forest, SVM, KNN, Naive Bayes' },
      { title: 'Unsupervised Learning', content: 'K-Means, Hierarchical Clustering, PCA, t-SNE, DBSCAN' },
      { title: 'Deep Learning', content: 'Neural Networks, CNN, RNN, LSTM, GAN, Transformers' },
      { title: 'Model Evaluation', content: 'Accuracy, Precision, Recall, F1-Score, ROC-AUC, Confusion Matrix' },
    ]
  },
  'html': {
    title: 'HTML Cheatsheet',
    description: 'Complete HTML5 reference with all elements and attributes',
    sections: [
      { title: 'Document Structure', content: '<!DOCTYPE>, <html>, <head>, <body>, <meta>, <title>, <link>, <script>' },
      { title: 'Text Elements', content: '<h1>-<h6>, <p>, <span>, <strong>, <em>, <br>, <hr>, <blockquote>' },
      { title: 'Lists', content: '<ul>, <ol>, <li>, <dl>, <dt>, <dd>' },
      { title: 'Forms', content: '<form>, <input>, <textarea>, <select>, <button>, <label>, <fieldset>' },
    ]
  },
  'python': {
    title: 'Python Cheatsheet',
    description: 'Python programming language quick reference',
    sections: [
      { title: 'Data Types', content: 'int, float, str, bool, list, tuple, dict, set, None' },
      { title: 'Control Flow', content: 'if/elif/else, for, while, break, continue, pass, try/except' },
      { title: 'Functions', content: 'def, return, *args, **kwargs, lambda, decorators, generators' },
      { title: 'OOP', content: 'class, __init__, self, inheritance, polymorphism, encapsulation' },
    ]
  },
  'c': {
    title: 'C Programming Cheatsheet',
    description: 'C programming language quick reference',
    sections: [
      { title: 'Data Types', content: 'int, char, float, double, void, short, long, unsigned' },
      { title: 'Operators', content: 'Arithmetic, Relational, Logical, Bitwise, Assignment, Ternary' },
      { title: 'Control Structures', content: 'if-else, switch, for, while, do-while, break, continue' },
      { title: 'Pointers', content: '*, &, pointer arithmetic, arrays, function pointers, malloc/free' },
    ]
  },
  'cpp': {
    title: 'C++ Cheatsheet',
    description: 'C++ programming language quick reference',
    sections: [
      { title: 'Basics', content: 'Variables, Data Types, Operators, Control Flow, Functions' },
      { title: 'OOP Concepts', content: 'Classes, Objects, Inheritance, Polymorphism, Encapsulation, Abstraction' },
      { title: 'STL', content: 'Vectors, Maps, Sets, Queues, Stacks, Algorithms' },
      { title: 'Advanced', content: 'Templates, Smart Pointers, Move Semantics, Lambda Expressions' },
    ]
  },
  'cpp-stl': {
    title: 'C++ STL Cheatsheet',
    description: 'Standard Template Library complete reference',
    sections: [
      { title: 'Containers', content: 'vector, list, deque, set, map, unordered_set, unordered_map, stack, queue, priority_queue' },
      { title: 'Algorithms', content: 'sort, find, binary_search, lower_bound, upper_bound, accumulate, transform' },
      { title: 'Iterators', content: 'begin, end, rbegin, rend, advance, distance, next, prev' },
      { title: 'Utilities', content: 'pair, tuple, make_pair, tie, swap, min, max' },
    ]
  },
  'javascript': {
    title: 'JavaScript Cheatsheet',
    description: 'JavaScript programming language quick reference',
    sections: [
      { title: 'Variables', content: 'var, let, const, hoisting, scope, closures' },
      { title: 'Functions', content: 'Function declarations, expressions, arrow functions, callbacks, promises, async/await' },
      { title: 'Objects', content: 'Object literals, constructors, prototypes, classes, destructuring' },
      { title: 'Arrays', content: 'map, filter, reduce, find, forEach, some, every, spread operator' },
    ]
  },
  'java': {
    title: 'Java Cheatsheet',
    description: 'Java programming language quick reference',
    sections: [
      { title: 'Basics', content: 'Data Types, Variables, Operators, Control Flow, Methods' },
      { title: 'OOP', content: 'Classes, Objects, Inheritance, Polymorphism, Interfaces, Abstract Classes' },
      { title: 'Collections', content: 'ArrayList, LinkedList, HashMap, HashSet, TreeMap, Queue, Stack' },
      { title: 'Advanced', content: 'Generics, Streams, Lambda, Exception Handling, Multithreading' },
    ]
  },
};

export default function CheatsheetPage() {
  const params = useParams();
  const slug = params.slug as string;
  const cheatsheet = cheatsheetsData[slug];

  if (!cheatsheet) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-[var(--foreground)] mb-4">Cheatsheet Not Found</h1>
            <p className="text-[var(--muted-foreground)] mb-6">The cheatsheet you&apos;re looking for doesn&apos;t exist.</p>
            <Link href="/cheatsheets" className="btn-primary">
              Browse All Cheatsheets
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm mb-6">
          <Link href="/" className="text-[var(--muted-foreground)] hover:text-[var(--foreground)]">Home</Link>
          <span className="text-[var(--muted-foreground)]">/</span>
          <Link href="/cheatsheets" className="text-[var(--muted-foreground)] hover:text-[var(--foreground)]">Cheatsheets</Link>
          <span className="text-[var(--muted-foreground)]">/</span>
          <span className="text-[var(--foreground)]">{cheatsheet.title}</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--foreground)] mb-4">{cheatsheet.title}</h1>
          <p className="text-lg text-[var(--muted-foreground)]">{cheatsheet.description}</p>
        </div>

        {/* Actions */}
        <div className="flex gap-4 mb-8">
          <button className="btn-primary flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download PDF
          </button>
          <button className="btn-secondary flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            Bookmark
          </button>
        </div>

        {/* Sections */}
        <div className="space-y-6">
          {cheatsheet.sections.map((section, index) => (
            <div key={index} className="card">
              <h2 className="text-xl font-semibold text-[var(--foreground)] mb-3">{section.title}</h2>
              <div className="bg-[var(--muted)] rounded-lg p-4">
                <code className="text-sm text-[var(--foreground)]">{section.content}</code>
              </div>
            </div>
          ))}
        </div>

        {/* Related Cheatsheets */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-[var(--foreground)] mb-6">Related Cheatsheets</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(cheatsheetsData)
              .filter(([key]) => key !== slug)
              .slice(0, 4)
              .map(([key, cs]) => (
                <Link key={key} href={`/cheatsheets/${key}`} className="card hover:border-[var(--primary)] transition-colors">
                  <h3 className="font-medium text-[var(--foreground)]">{cs.title.replace(' Cheatsheet', '')}</h3>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
