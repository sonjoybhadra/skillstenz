'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Layout from '../../../components/Layout';
import DynamicSEO from '../../../components/DynamicSEO';

interface Category {
  name: string;
  slug: string;
  icon: string;
  color: string;
}

interface Tag {
  name: string;
  slug: string;
  color: string;
}

interface Author {
  name: string;
  username: string;
  avatar?: string;
  bio?: string;
}

interface Comment {
  _id: string;
  user: {
    name: string;
    username: string;
    avatar?: string;
  };
  content: string;
  likes: number;
  createdAt: string;
  isEdited: boolean;
  replies?: Comment[];
}

interface Article {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  author: Author;
  category: Category;
  tags: Tag[];
  readTime: number;
  views: number;
  likes: number;
  publishedAt: string;
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: string;
  comments?: Comment[];
}

interface RelatedArticle {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage?: string;
  category: Category;
  readTime: number;
}

// Sample articles data with code snippets
const sampleArticlesData: Record<string, Article> = {
  'building-ai-applications-openai-gpt4-langchain': {
    _id: '1',
    title: 'Building AI-Powered Applications with OpenAI GPT-4 and LangChain',
    slug: 'building-ai-applications-openai-gpt4-langchain',
    excerpt: 'Learn how to integrate GPT-4 into your applications using LangChain for advanced AI capabilities.',
    featuredImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200',
    author: { 
      name: 'Alex Chen', 
      username: 'alexchen', 
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex',
      bio: 'AI/ML Engineer with 8+ years of experience building production AI systems. Previously at Google Brain and OpenAI.'
    },
    category: { name: 'AI & Machine Learning', slug: 'ai-ml', icon: '🤖', color: '#8B5CF6' },
    tags: [
      { name: 'Python', slug: 'python', color: '#3776AB' },
      { name: 'ChatGPT', slug: 'chatgpt', color: '#10A37F' },
      { name: 'LLM', slug: 'llm', color: '#8B5CF6' }
    ],
    readTime: 12,
    views: 15420,
    likes: 234,
    publishedAt: '2024-12-20',
    content: `
<p class="lead">Large Language Models (LLMs) like GPT-4 have revolutionized how we build AI applications. In this comprehensive guide, we'll explore how to leverage LangChain to create powerful AI-powered applications.</p>

<h2>🚀 Getting Started with LangChain</h2>

<p>LangChain is a framework designed to simplify the creation of applications using large language models. It provides tools for prompt management, chains, agents, and memory systems.</p>

<h3>Installation</h3>

<p>First, let's install the required dependencies:</p>

<pre><code class="language-bash">pip install langchain openai python-dotenv
pip install chromadb  # For vector storage
pip install tiktoken  # For token counting</code></pre>

<h3>Basic Setup</h3>

<p>Create a simple LangChain application with GPT-4:</p>

<pre><code class="language-python">import os
from dotenv import load_dotenv
from langchain.chat_models import ChatOpenAI
from langchain.prompts import ChatPromptTemplate
from langchain.chains import LLMChain

# Load environment variables
load_dotenv()

# Initialize the GPT-4 model
llm = ChatOpenAI(
    model_name="gpt-4",
    temperature=0.7,
    openai_api_key=os.getenv("OPENAI_API_KEY")
)

# Create a prompt template
prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a helpful AI assistant specialized in {topic}."),
    ("human", "{question}")
])

# Create a chain
chain = LLMChain(llm=llm, prompt=prompt)

# Run the chain
response = chain.run(
    topic="Python programming",
    question="How do I implement a binary search tree?"
)
print(response)</code></pre>

<h2>📚 Building a RAG System</h2>

<p>Retrieval-Augmented Generation (RAG) combines the power of LLMs with external knowledge bases. Here's how to build one:</p>

<pre><code class="language-python">from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import Chroma
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.chains import RetrievalQA
from langchain.document_loaders import TextLoader

# Load and split documents
loader = TextLoader("knowledge_base.txt")
documents = loader.load()

text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,
    chunk_overlap=200
)
splits = text_splitter.split_documents(documents)

# Create embeddings and vector store
embeddings = OpenAIEmbeddings()
vectorstore = Chroma.from_documents(
    documents=splits,
    embedding=embeddings,
    persist_directory="./chroma_db"
)

# Create retrieval chain
qa_chain = RetrievalQA.from_chain_type(
    llm=llm,
    chain_type="stuff",
    retriever=vectorstore.as_retriever(
        search_kwargs={"k": 3}
    )
)

# Query your knowledge base
result = qa_chain.run("What are the key features of our product?")
print(result)</code></pre>

<h2>🤖 Creating AI Agents</h2>

<p>Agents can use tools to perform complex tasks. Here's an example of a research agent:</p>

<pre><code class="language-python">from langchain.agents import initialize_agent, Tool, AgentType
from langchain.tools import DuckDuckGoSearchRun
from langchain.utilities import WikipediaAPIWrapper

# Initialize tools
search = DuckDuckGoSearchRun()
wikipedia = WikipediaAPIWrapper()

tools = [
    Tool(
        name="Search",
        func=search.run,
        description="Useful for searching the internet for current information"
    ),
    Tool(
        name="Wikipedia",
        func=wikipedia.run,
        description="Useful for getting detailed information about topics"
    )
]

# Create the agent
agent = initialize_agent(
    tools=tools,
    llm=llm,
    agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION,
    verbose=True
)

# Run the agent
result = agent.run(
    "What are the latest developments in quantum computing?"
)
print(result)</code></pre>

<h2>💾 Adding Memory</h2>

<p>LangChain provides various memory types for maintaining conversation context:</p>

<pre><code class="language-python">from langchain.memory import ConversationBufferMemory
from langchain.chains import ConversationChain

# Create memory
memory = ConversationBufferMemory()

# Create conversation chain with memory
conversation = ConversationChain(
    llm=llm,
    memory=memory,
    verbose=True
)

# Have a conversation
conversation.predict(input="Hi, my name is Alex!")
conversation.predict(input="What's my name?")
# The AI will remember your name from the previous message</code></pre>

<h2>🎯 Best Practices</h2>

<ul>
<li><strong>Use streaming</strong> for better UX with long responses</li>
<li><strong>Implement rate limiting</strong> to manage API costs</li>
<li><strong>Cache responses</strong> for frequently asked questions</li>
<li><strong>Monitor token usage</strong> to optimize costs</li>
<li><strong>Use async operations</strong> for better performance</li>
</ul>

<h2>🔗 Conclusion</h2>

<p>LangChain makes it easy to build sophisticated AI applications. By combining LLMs with RAG, agents, and memory, you can create powerful systems that leverage the best of both structured knowledge and generative AI.</p>

<p>In the next article, we'll explore deploying these applications to production with proper error handling and monitoring.</p>
    `,
    comments: [
      {
        _id: 'c1',
        user: { name: 'Sarah Kim', username: 'sarahkim', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah' },
        content: 'Great article! The RAG example was exactly what I needed for my project.',
        likes: 12,
        createdAt: '2024-12-21',
        isEdited: false
      },
      {
        _id: 'c2',
        user: { name: 'Mike Johnson', username: 'mikej', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike' },
        content: 'Would love to see a follow-up on deploying LangChain apps with FastAPI!',
        likes: 8,
        createdAt: '2024-12-22',
        isEdited: false
      }
    ]
  },
  'nextjs-15-server-components-complete-guide': {
    _id: '2',
    title: 'Next.js 15 Server Components: Complete Guide to Modern React',
    slug: 'nextjs-15-server-components-complete-guide',
    excerpt: 'Master Next.js 15 Server Components, understand the new rendering patterns, and build lightning-fast web applications.',
    featuredImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200',
    author: { 
      name: 'Sarah Kim', 
      username: 'sarahkim', 
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
      bio: 'Full-stack developer and Next.js core contributor. Teaching modern web development at Tech Academy.'
    },
    category: { name: 'Web Development', slug: 'web-dev', icon: '🌐', color: '#3B82F6' },
    tags: [
      { name: 'React', slug: 'react', color: '#61DAFB' },
      { name: 'Next.js', slug: 'nextjs', color: '#000000' },
      { name: 'TypeScript', slug: 'typescript', color: '#3178C6' }
    ],
    readTime: 15,
    views: 12350,
    likes: 189,
    publishedAt: '2024-12-18',
    content: `
<p class="lead">Next.js 15 introduces powerful new features for building modern web applications. This guide covers Server Components, the new rendering model, and best practices for optimal performance.</p>

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

<p>Here's the recommended structure for a Next.js 15 application:</p>

<pre><code class="language-bash">app/
├── layout.tsx          # Root layout (Server Component)
├── page.tsx            # Home page (Server Component)
├── loading.tsx         # Loading UI
├── error.tsx           # Error boundary
├── globals.css
├── (auth)/             # Route group
│   ├── login/
│   │   └── page.tsx
│   └── register/
│       └── page.tsx
├── dashboard/
│   ├── layout.tsx      # Nested layout
│   ├── page.tsx
│   └── settings/
│       └── page.tsx
└── api/
    └── [...route]/
        └── route.ts</code></pre>

<h2>⚡ Creating Server Components</h2>

<p>By default, all components in the app directory are Server Components:</p>

<pre><code class="language-typescript">// app/posts/page.tsx - Server Component
import { prisma } from '@/lib/prisma';

interface Post {
  id: string;
  title: string;
  content: string;
  author: {
    name: string;
  };
  createdAt: Date;
}

async function getPosts(): Promise<Post[]> {
  // Direct database access - no API needed!
  const posts = await prisma.post.findMany({
    include: { author: true },
    orderBy: { createdAt: 'desc' },
  });
  return posts;
}

export default async function PostsPage() {
  const posts = await getPosts();

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Latest Posts</h1>
      <div className="grid gap-4">
        {posts.map((post) => (
          <article key={post.id} className="p-6 bg-white rounded-lg shadow">
            <h2 className="text-xl font-semibold">{post.title}</h2>
            <p className="text-gray-600 mt-2">{post.content}</p>
            <div className="mt-4 text-sm text-gray-500">
              By {post.author.name} • {post.createdAt.toLocaleDateString()}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}</code></pre>

<h2>🔄 Client Components</h2>

<p>Use the 'use client' directive for interactive components:</p>

<pre><code class="language-typescript">'use client';

import { useState, useTransition } from 'react';
import { likePost } from '@/actions/posts';

interface LikeButtonProps {
  postId: string;
  initialLikes: number;
}

export default function LikeButton({ postId, initialLikes }: LikeButtonProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [isPending, startTransition] = useTransition();

  const handleLike = () => {
    startTransition(async () => {
      const newLikes = await likePost(postId);
      setLikes(newLikes);
    });
  };

  return (
    <button
      onClick={handleLike}
      disabled={isPending}
      className="flex items-center gap-2 px-4 py-2 bg-pink-100 
                 hover:bg-pink-200 rounded-full transition-colors"
    >
      <span>{isPending ? '...' : '❤️'}</span>
      <span>{likes}</span>
    </button>
  );
}</code></pre>

<h2>🚀 Server Actions</h2>

<p>Next.js 15 Server Actions allow you to run server code directly from client components:</p>

<pre><code class="language-typescript">// app/actions/posts.ts
'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function createPost(formData: FormData) {
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;

  await prisma.post.create({
    data: { title, content, authorId: 'current-user-id' },
  });

  revalidatePath('/posts');
}

export async function likePost(postId: string): Promise<number> {
  const post = await prisma.post.update({
    where: { id: postId },
    data: { likes: { increment: 1 } },
  });

  return post.likes;
}</code></pre>

<h2>⏳ Streaming and Suspense</h2>

<p>Use Suspense for progressive loading:</p>

<pre><code class="language-typescript">import { Suspense } from 'react';
import PostsList from './PostsList';
import PostsSkeleton from './PostsSkeleton';

export default function Page() {
  return (
    <div>
      <h1>Blog</h1>
      <Suspense fallback={<PostsSkeleton />}>
        <PostsList />
      </Suspense>
    </div>
  );
}</code></pre>

<h2>🎨 Loading States</h2>

<pre><code class="language-typescript">// app/posts/loading.tsx
export default function Loading() {
  return (
    <div className="container mx-auto py-8">
      <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-6" />
      <div className="grid gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-6 bg-white rounded-lg shadow">
            <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-full bg-gray-100 rounded animate-pulse mt-3" />
            <div className="h-4 w-2/3 bg-gray-100 rounded animate-pulse mt-2" />
          </div>
        ))}
      </div>
    </div>
  );
}</code></pre>

<h2>📊 Performance Tips</h2>

<ul>
<li><strong>Prefer Server Components</strong> for static or data-fetching components</li>
<li><strong>Use Client Components sparingly</strong> for interactive features</li>
<li><strong>Leverage caching</strong> with fetch options and revalidation</li>
<li><strong>Implement proper loading states</strong> for better UX</li>
<li><strong>Use parallel data fetching</strong> with Promise.all</li>
</ul>

<h2>🔗 Conclusion</h2>

<p>Next.js 15 Server Components represent a paradigm shift in React development. By understanding when to use Server vs Client Components, you can build faster, more efficient applications.</p>
    `,
    comments: []
  }
};

// Related articles data
const relatedArticlesData: RelatedArticle[] = [
  {
    _id: '3',
    title: 'Kubernetes for Developers: From Zero to Production',
    slug: 'kubernetes-developers-zero-to-production',
    excerpt: 'A hands-on guide to deploying and managing containerized applications.',
    featuredImage: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800',
    category: { name: 'Cloud & DevOps', slug: 'cloud-devops', icon: '☁️', color: '#06B6D4' },
    readTime: 18
  },
  {
    _id: '4',
    title: 'Building Real-Time APIs with Node.js and WebSockets',
    slug: 'real-time-apis-nodejs-websockets',
    excerpt: 'Create powerful real-time applications using Node.js and Socket.io.',
    featuredImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800',
    category: { name: 'Backend & APIs', slug: 'backend', icon: '⚙️', color: '#6366F1' },
    readTime: 10
  },
  {
    _id: '5',
    title: 'Python Data Analysis: Pandas, NumPy, and Visualization',
    slug: 'python-data-analysis-pandas-numpy',
    excerpt: 'Master data analysis with Python using Pandas and NumPy.',
    featuredImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
    category: { name: 'Data Science', slug: 'data-science', icon: '📊', color: '#F59E0B' },
    readTime: 14
  },
  {
    _id: '6',
    title: 'Securing Your APIs: Best Practices for 2024',
    slug: 'securing-apis-best-practices-2024',
    excerpt: 'Comprehensive guide to API security including authentication and rate limiting.',
    featuredImage: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800',
    category: { name: 'Cybersecurity', slug: 'security', icon: '🔒', color: '#EF4444' },
    readTime: 11
  }
];

export default function BlogArticlePage() {
  const params = useParams();
  const router = useRouter();
  const [article, setArticle] = useState<Article | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<RelatedArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (params.slug) {
      fetchArticle();
    }
  }, [params.slug]);

  const fetchArticle = async () => {
    try {
      setLoading(true);
      const slug = params.slug as string;
      
      // First, check if we have sample data for this slug
      if (sampleArticlesData[slug]) {
        setArticle(sampleArticlesData[slug]);
        setRelatedArticles(relatedArticlesData);
        setLoading(false);
        return;
      }

      // Try to fetch from API
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blog/articles/${slug}`);
      if (response.ok) {
        const data = await response.json();
        setArticle(data.article);
        setRelatedArticles(data.relatedArticles || relatedArticlesData);
      } else {
        // Use a default article if not found
        const defaultArticle = Object.values(sampleArticlesData)[0];
        if (defaultArticle) {
          setArticle({
            ...defaultArticle,
            slug: slug,
            title: slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
          });
          setRelatedArticles(relatedArticlesData);
        }
      }
    } catch (error) {
      console.error('Error fetching article:', error);
      // Fallback to sample data on error
      const slug = params.slug as string;
      const defaultArticle = sampleArticlesData[slug] || Object.values(sampleArticlesData)[0];
      if (defaultArticle) {
        setArticle(defaultArticle);
        setRelatedArticles(relatedArticlesData);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLikeArticle = async () => {
    if (!article) return;
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blog/articles/${article._id}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setArticle({ ...article, likes: data.likes });
      }
    } catch (error) {
      console.error('Error liking article:', error);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!article || !commentText.trim()) return;

    try {
      setSubmittingComment(true);
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blog/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          article: article._id,
          content: commentText
        })
      });

      if (response.ok) {
        setCommentText('');
        fetchArticle(); // Refresh to get new comment
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      setSubmittingComment(false);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <Layout>
        <div className="container py-20 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  if (!article) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <h1 className="text-3xl font-bold mb-4">Article Not Found</h1>
          <Link href="/blog" className="text-purple-600 hover:underline">← Back to Insights</Link>
        </div>
      </Layout>
    );
  }

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const fallbackSidebarArticles: RelatedArticle[] = Object.values(sampleArticlesData).map((item) => ({
    _id: item._id,
    title: item.title,
    slug: item.slug,
    excerpt: item.excerpt,
    featuredImage: item.featuredImage,
    category: item.category,
    readTime: item.readTime
  }));

  const sidebarArticles = (relatedArticles.length ? relatedArticles : fallbackSidebarArticles)
    .filter((post) => post.slug !== article.slug)
    .slice(0, 6);

  return (
    <>
      <DynamicSEO
        title={article.metaTitle || article.title}
        description={article.metaDescription || article.excerpt}
        keywords={article.tags.map(t => t.name).join(', ')}
        ogImage={article.ogImage || article.featuredImage}
        ogType="article"
      />
      <Layout>
        {/* Code highlighting styles */}
        <style jsx global>{`
          .article-content pre {
            background: #1e1e1e;
            border-radius: 12px;
            padding: 20px;
            overflow-x: auto;
            margin: 24px 0;
            position: relative;
          }
          .article-content pre code {
            color: #d4d4d4;
            font-family: 'Fira Code', 'Monaco', 'Consolas', monospace;
            font-size: 14px;
            line-height: 1.6;
          }
          .article-content code:not(pre code) {
            background: #f3f4f6;
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 14px;
            color: #e11d48;
          }
          .dark .article-content code:not(pre code) {
            background: #374151;
            color: #f472b6;
          }
          .article-content h2 {
            font-size: 28px;
            font-weight: 700;
            margin-top: 48px;
            margin-bottom: 16px;
            padding-bottom: 8px;
            border-bottom: 2px solid #e5e7eb;
          }
          .dark .article-content h2 {
            border-bottom-color: #374151;
          }
          .article-content h3 {
            font-size: 22px;
            font-weight: 600;
            margin-top: 32px;
            margin-bottom: 12px;
          }
          .article-content p {
            margin-bottom: 16px;
            line-height: 1.8;
          }
          .article-content .lead {
            font-size: 20px;
            color: #6b7280;
            line-height: 1.7;
            margin-bottom: 32px;
          }
          .dark .article-content .lead {
            color: #9ca3af;
          }
          .article-content ul, .article-content ol {
            margin: 16px 0;
            padding-left: 24px;
          }
          .article-content li {
            margin-bottom: 8px;
            line-height: 1.7;
          }
          .article-content ul li {
            list-style-type: disc;
          }
          .article-content ol li {
            list-style-type: decimal;
          }
          .article-content strong {
            font-weight: 600;
          }
          /* Syntax highlighting */
          .article-content pre .keyword { color: #569cd6; }
          .article-content pre .string { color: #ce9178; }
          .article-content pre .comment { color: #6a9955; }
          .article-content pre .function { color: #dcdcaa; }
          .article-content pre .number { color: #b5cea8; }
        `}</style>
        
        {/* Article Header */}
        <article className="bg-white dark:bg-slate-900">
          <div className="container py-12">
            <div className="flex flex-col lg:flex-row gap-8">
              <aside className="order-2 lg:order-1 lg:w-80 xl:w-96 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-5 h-fit sticky top-24 self-start">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Latest Insights</h3>
                  <Link href="/blog" className="text-sm text-purple-600 hover:text-purple-500 font-medium">
                    View all
                  </Link>
                </div>
                <div className="mt-6 space-y-4">
                  {sidebarArticles.map((post) => (
                    <Link key={post._id} href={`/blog/${post.slug}`} className="flex gap-3 group">
                      {post.featuredImage ? (
                        <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-200 dark:bg-slate-700 flex-shrink-0">
                          <img
                            src={post.featuredImage}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                          />
                        </div>
                      ) : (
                        <div className="w-20 h-20 rounded-xl bg-gray-200 dark:bg-slate-700 flex items-center justify-center text-2xl">
                          📝
                        </div>
                      )}
                      <div>
                        <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                          {post.category.icon} {post.category.name}
                        </p>
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-2">
                          {post.title}
                        </h4>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          ⏱️ {post.readTime} min read
                        </div>
                      </div>
                    </Link>
                  ))}
                  {sidebarArticles.length === 0 && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Fresh stories coming soon. Stay tuned!
                    </p>
                  )}
                </div>
              </aside>
              <div className="flex-1 max-w-4xl mx-auto lg:mx-0 order-1 lg:order-2">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm mb-6 text-gray-600 dark:text-gray-400">
                  <Link href="/" className="hover:text-purple-600">Home</Link>
                  <span>/</span>
                  <Link href="/blog" className="hover:text-purple-600">Insights</Link>
                  <span>/</span>
                  <Link href={`/blog?category=${article.category.slug}`} className="hover:text-purple-600">
                    {article.category.name}
                  </Link>
                </nav>

                {/* Category Badge */}
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 rounded-lg text-sm font-semibold" style={{ backgroundColor: article.category.color + '20', color: article.category.color }}>
                    {article.category.icon} {article.category.name}
                  </span>
                </div>

                {/* Title */}
                <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">{article.title}</h1>

                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-6 text-gray-600 dark:text-gray-400 mb-8">
                  <div className="flex items-center gap-3">
                    {article.author.avatar && (
                      <img src={article.author.avatar} alt={article.author.name} className="w-12 h-12 rounded-full" />
                    )}
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">{article.author.name}</div>
                      <div className="text-sm">@{article.author.username}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span>{formatDate(article.publishedAt)}</span>
                    <span>•</span>
                    <span>{article.readTime} min read</span>
                    <span>•</span>
                    <span>{article.views} views</span>
                  </div>
                </div>

                {/* Featured Image */}
                {article.featuredImage && (
                  <div className="mb-12 rounded-2xl overflow-hidden shadow-lg">
                    <img src={article.featuredImage} alt={article.title} className="w-full h-auto" />
                  </div>
                )}

                {/* Article Content */}
                <div className="article-content" dangerouslySetInnerHTML={{ __html: article.content }} />

                {/* Tags */}
                <div className="my-12 pt-8 border-t border-gray-200 dark:border-slate-700">
                  <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3">Tags:</h3>
                  <div className="flex flex-wrap gap-2">
                    {article.tags.map((tag) => (
                      <Link
                        key={tag.slug}
                        href={`/blog?tag=${tag.slug}`}
                        className="px-4 py-2 rounded-full text-sm font-medium hover:opacity-80 transition-opacity"
                        style={{ backgroundColor: tag.color + '20', color: tag.color }}
                      >
                        #{tag.name}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Like & Share */}
                <div className="flex items-center gap-4 pb-12 border-b border-gray-200 dark:border-slate-700">
                  <button
                    onClick={handleLikeArticle}
                    className="px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-xl font-semibold transition-all flex items-center gap-2 shadow-lg hover:shadow-xl"
                  >
                    ❤️ Like ({article.likes})
                  </button>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="px-6 py-3 bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 rounded-xl font-semibold transition-colors flex items-center gap-2"
                  >
                    {copied ? '✓ Copied!' : '🔗 Share'}
                  </button>
                  <a 
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 bg-blue-400 hover:bg-blue-500 text-white rounded-xl font-semibold transition-colors"
                  >
                    𝕏 Tweet
                  </a>
                </div>

                {/* Author Bio */}
                {article.author.bio && (
                  <div className="my-12 p-6 bg-gray-50 dark:bg-slate-800 rounded-2xl">
                    <h3 className="text-xl font-bold mb-4">About the Author</h3>
                    <div className="flex items-start gap-4">
                      {article.author.avatar && (
                        <img src={article.author.avatar} alt={article.author.name} className="w-16 h-16 rounded-full" />
                      )}
                      <div>
                        <div className="font-bold text-lg">{article.author.name}</div>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">{article.author.bio}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Comments Section */}
                <div className="mt-12">
                  <h3 className="text-2xl font-bold mb-6">Comments ({article.comments?.length || 0})</h3>

                  {/* Comment Form */}
                  <form onSubmit={handleSubmitComment} className="mb-8">
                    <textarea
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Share your thoughts..."
                      className="w-full px-4 py-3 border border-gray-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 min-h-[100px]"
                      required
                    />
                    <div className="mt-3 flex justify-end">
                      <button
                        type="submit"
                        disabled={submittingComment || !commentText.trim()}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold disabled:opacity-50 transition-colors"
                      >
                        {submittingComment ? 'Posting...' : 'Post Comment'}
                      </button>
                    </div>
                  </form>

                  {/* Comments List */}
                  <div className="space-y-6">
                    {article.comments?.map((comment) => (
                      <div key={comment._id} className="flex gap-4">
                        {comment.user.avatar && (
                          <img src={comment.user.avatar} alt={comment.user.name} className="w-10 h-10 rounded-full flex-shrink-0" />
                        )}
                        <div className="flex-1">
                          <div className="bg-gray-50 dark:bg-slate-800 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <span className="font-semibold">{comment.user.name}</span>
                                <span className="text-sm text-gray-500 ml-2">@{comment.user.username}</span>
                              </div>
                              <span className="text-sm text-gray-500">{formatDate(comment.createdAt)}</span>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300">{comment.content}</p>
                            {comment.isEdited && (
                              <span className="text-xs text-gray-500 italic">Edited</span>
                            )}
                          </div>
                          <div className="mt-2 flex items-center gap-4 text-sm">
                            <button className="text-gray-600 dark:text-gray-400 hover:text-blue-600">
                              ❤️ {comment.likes}
                            </button>
                            <button className="text-gray-600 dark:text-gray-400 hover:text-blue-600">
                              Reply
                            </button>
                          </div>

                          {/* Replies */}
                          {comment.replies && comment.replies.length > 0 && (
                            <div className="ml-8 mt-4 space-y-4">
                              {comment.replies.map((reply) => (
                                <div key={reply._id} className="flex gap-3">
                                  {reply.user.avatar && (
                                    <img src={reply.user.avatar} alt={reply.user.name} className="w-8 h-8 rounded-full flex-shrink-0" />
                                  )}
                                  <div className="flex-1 bg-gray-100 dark:bg-slate-700 rounded-lg p-3">
                                    <div className="flex items-center justify-between mb-1">
                                      <span className="font-semibold text-sm">{reply.user.name}</span>
                                      <span className="text-xs text-gray-500">{formatDate(reply.createdAt)}</span>
                                    </div>
                                    <p className="text-sm text-gray-700 dark:text-gray-300">{reply.content}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </article>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <section className="bg-gray-50 dark:bg-slate-800 py-16">
            <div className="container">
              <h2 className="text-3xl font-bold mb-8 text-center">Related Insights</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                {relatedArticles.map((related) => (
                  <Link key={related._id} href={`/blog/${related.slug}`} className="group">
                    <div className="card overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1 h-full">
                      {related.featuredImage && (
                        <div className="h-40 bg-gray-200 dark:bg-slate-700 relative overflow-hidden">
                          <img
                            src={related.featuredImage}
                            alt={related.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <div className="p-4">
                        <span className="text-xs px-2 py-1 rounded-full font-medium" style={{ backgroundColor: related.category.color + '20', color: related.category.color }}>
                          {related.category.icon} {related.category.name}
                        </span>
                        <h3 className="font-bold mt-2 mb-2 group-hover:text-purple-600 transition-colors line-clamp-2">
                          {related.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{related.excerpt}</p>
                        <div className="mt-3 text-xs text-gray-500">⏱️ {related.readTime} min read</div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </Layout>
    </>
  );
}
