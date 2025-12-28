'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Layout from '../../../components/Layout';
import DynamicSEO from '../../../components/DynamicSEO';
import { useAuth } from '@/lib/auth';
import { blogAPI, BlogArticle, BlogComment } from '@/lib/api';

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
  dislikes: number;
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
    dislikes: 12,
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
    dislikes: 8,
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

// Helper to check if an ID is a valid MongoDB ObjectId (24 char hex string)
const isValidObjectId = (id: string): boolean => {
  return /^[a-fA-F0-9]{24}$/.test(id);
};

export default function BlogArticlePage() {
  const params = useParams();
  const { user, isAuthenticated } = useAuth();
  const [article, setArticle] = useState<Article | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<RelatedArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [copied, setCopied] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);
  const [hasDisliked, setHasDisliked] = useState(false);
  const [viewIncremented, setViewIncremented] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [submittingReply, setSubmittingReply] = useState(false);

  // Increment view count when article is loaded
  useEffect(() => {
    if (article && !viewIncremented) {
      incrementViewCount();
      setViewIncremented(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [article, viewIncremented]);

  const incrementViewCount = async () => {
    if (!article) return;
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/blog/articles/${article._id}/view`, {
        method: 'POST'
      });
      // Update local state to reflect the view
      setArticle(prev => prev ? { ...prev, views: prev.views + 1 } : null);
    } catch (error) {
      console.error('Error incrementing view count:', error);
    }
  };

  const fetchArticle = useCallback(async () => {
    try {
      setLoading(true);
      const slug = params.slug as string;
      
      // Try to fetch from API first
      const { data, error } = await blogAPI.getArticleBySlug(slug);
      
      if (data && data.article) {
        // Convert API response to our Article interface
        const apiArticle = data.article;
        setArticle({
          _id: apiArticle._id,
          title: apiArticle.title,
          slug: apiArticle.slug,
          excerpt: apiArticle.excerpt,
          content: apiArticle.content,
          featuredImage: apiArticle.featuredImage,
          author: {
            name: apiArticle.author?.name || 'Unknown',
            username: apiArticle.author?.username || '',
            avatar: apiArticle.author?.avatar,
            bio: apiArticle.author?.bio
          },
          category: {
            name: apiArticle.category?.name || 'General',
            slug: apiArticle.category?.slug || 'general',
            icon: apiArticle.category?.icon || '📝',
            color: apiArticle.category?.color || '#3B82F6'
          },
          tags: (apiArticle.tags || []).map((t: { name?: string; slug?: string; color?: string }) => ({
            name: t.name || '',
            slug: t.slug || '',
            color: t.color || '#6B7280'
          })),
          readTime: apiArticle.readTime || 5,
          views: apiArticle.views || 0,
          likes: apiArticle.likes || 0,
          dislikes: 0, // API might not have dislikes
          publishedAt: apiArticle.publishedAt,
          metaTitle: apiArticle.metaTitle,
          metaDescription: apiArticle.metaDescription,
          ogImage: apiArticle.ogImage,
          comments: (apiArticle.comments || []).map((c: BlogComment) => ({
            _id: c._id,
            user: {
              name: c.user?.name || 'Anonymous',
              username: c.user?.username || '',
              avatar: c.user?.avatar
            },
            content: c.content,
            likes: c.likes || 0,
            createdAt: c.createdAt,
            isEdited: c.isEdited || false,
            replies: (c.replies || []).map((r: BlogComment) => ({
              _id: r._id,
              user: {
                name: r.user?.name || 'Anonymous',
                username: r.user?.username || '',
                avatar: r.user?.avatar
              },
              content: r.content,
              likes: r.likes || 0,
              createdAt: r.createdAt,
              isEdited: r.isEdited || false
            }))
          }))
        });
        
        // Set related articles from API
        if (data.relatedArticles && data.relatedArticles.length > 0) {
          setRelatedArticles(data.relatedArticles.map((r: BlogArticle) => ({
            _id: r._id,
            title: r.title,
            slug: r.slug,
            excerpt: r.excerpt,
            featuredImage: r.featuredImage,
            category: {
              name: r.category?.name || 'General',
              slug: r.category?.slug || 'general',
              icon: r.category?.icon || '📝',
              color: r.category?.color || '#3B82F6'
            },
            readTime: r.readTime || 5
          })));
        } else {
          setRelatedArticles(relatedArticlesData);
        }
        
        // Fetch comments separately if not included
        if (!apiArticle.comments || apiArticle.comments.length === 0) {
          fetchComments(apiArticle._id);
        }
        
        setLoading(false);
        return;
      }
      
      // Fallback: check if we have sample data for this slug
      if (sampleArticlesData[slug]) {
        setArticle(sampleArticlesData[slug]);
        setRelatedArticles(relatedArticlesData);
        setLoading(false);
        return;
      }

      // Use a default article if not found
      if (error) {
        console.log('API returned error, using sample data:', error);
      }
      const defaultArticle = Object.values(sampleArticlesData)[0];
      if (defaultArticle) {
        setArticle({
          ...defaultArticle,
          slug: slug,
          title: slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
        });
        setRelatedArticles(relatedArticlesData);
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
  }, [params.slug]);

  const fetchComments = async (articleId: string) => {
    try {
      const { data } = await blogAPI.getComments(articleId);
      if (data && data.comments) {
        setArticle(prev => prev ? {
          ...prev,
          comments: data.comments.map((c: BlogComment) => ({
            _id: c._id,
            user: {
              name: c.user?.name || 'Anonymous',
              username: c.user?.username || '',
              avatar: c.user?.avatar
            },
            content: c.content,
            likes: c.likes || 0,
            createdAt: c.createdAt,
            isEdited: c.isEdited || false,
            replies: (c.replies || []).map((r: BlogComment) => ({
              _id: r._id,
              user: {
                name: r.user?.name || 'Anonymous',
                username: r.user?.username || '',
                avatar: r.user?.avatar
              },
              content: r.content,
              likes: r.likes || 0,
              createdAt: r.createdAt,
              isEdited: r.isEdited || false
            }))
          }))
        } : null);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleLikeArticle = async () => {
    if (!article) return;
    
    // Check if user is logged in
    if (!isAuthenticated) {
      setShowLoginPrompt(true);
      return;
    }

    // If already liked, remove like
    if (hasLiked) {
      setArticle({ ...article, likes: article.likes - 1 });
      setHasLiked(false);
    } else {
      // If disliked, remove dislike first
      if (hasDisliked) {
        setHasDisliked(false);
        setArticle({ ...article, likes: article.likes + 1, dislikes: article.dislikes - 1 });
      } else {
        setArticle({ ...article, likes: article.likes + 1 });
      }
      setHasLiked(true);
    }

    // Sync with backend only if valid ObjectId
    if (isValidObjectId(article._id)) {
      try {
        await blogAPI.toggleLike(article._id);
      } catch (error) {
        console.error('Error syncing like:', error);
      }
    }
  };

  const handleDislikeArticle = async () => {
    if (!article) return;
    
    // Check if user is logged in
    if (!isAuthenticated) {
      setShowLoginPrompt(true);
      return;
    }

    // If already disliked, remove dislike
    if (hasDisliked) {
      setArticle({ ...article, dislikes: article.dislikes - 1 });
      setHasDisliked(false);
    } else {
      // If liked, remove like first
      if (hasLiked) {
        setHasLiked(false);
        setArticle({ ...article, dislikes: article.dislikes + 1, likes: article.likes - 1 });
      } else {
        setArticle({ ...article, dislikes: article.dislikes + 1 });
      }
      setHasDisliked(true);
    }

    // Note: Dislike is client-side only as API doesn't have dislike endpoint
    // Could be added to backend if needed
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!article || !commentText.trim()) return;

    // Check if user is logged in
    if (!isAuthenticated || !user) {
      setShowLoginPrompt(true);
      return;
    }

    try {
      setSubmittingComment(true);

      // Create new comment object for immediate UI update
      const userName = user.name || user.email?.split('@')[0] || 'You';
      const tempId = `temp-${Date.now()}`;
      const newComment: Comment = {
        _id: tempId,
        user: {
          name: userName,
          username: user.email?.split('@')[0] || 'user',
          avatar: user.avatar || user.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userName}`
        },
        content: commentText.trim(),
        likes: 0,
        createdAt: new Date().toISOString(),
        isEdited: false
      };

      // Immediately add comment to UI
      setArticle(prev => prev ? {
        ...prev,
        comments: [...(prev.comments || []), newComment]
      } : null);
      setCommentText('');

      // Only save to backend if article has a valid MongoDB ObjectId
      if (isValidObjectId(article._id)) {
        const { data, error } = await blogAPI.createComment({
          article: article._id,
          content: newComment.content,
          parent: null
        });

        if (data && data._id) {
          // Update the temp comment with real ID from server
          setArticle(prev => prev ? {
            ...prev,
            comments: prev.comments?.map(c => 
              c._id === tempId ? { 
                ...c, 
                _id: data._id,
                user: {
                  name: data.user?.name || c.user.name,
                  username: data.user?.username || c.user.username,
                  avatar: data.user?.avatar || c.user.avatar
                }
              } : c
            )
          } : null);
        } else if (error) {
          console.error('Error saving comment to database:', error);
          // Comment is still shown in UI with temp ID
        }
      }
      // If sample data article, comment is only stored locally in state
    } catch (error) {
      console.error('Error submitting comment:', error);
      // Comment is already added to UI, so user sees it
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleSubmitReply = async (commentId: string) => {
    if (!article || !replyText.trim()) return;

    // Check if user is logged in
    if (!isAuthenticated || !user) {
      setShowLoginPrompt(true);
      return;
    }

    try {
      setSubmittingReply(true);

      // Create new reply object for immediate UI update
      const userName = user.name || user.email?.split('@')[0] || 'You';
      const tempId = `reply-${Date.now()}`;
      const newReply: Comment = {
        _id: tempId,
        user: {
          name: userName,
          username: user.email?.split('@')[0] || 'user',
          avatar: user.avatar || user.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userName}`
        },
        content: replyText.trim(),
        likes: 0,
        createdAt: new Date().toISOString(),
        isEdited: false
      };

      // Immediately add reply to UI
      setArticle(prev => prev ? {
        ...prev,
        comments: prev.comments?.map(c => 
          c._id === commentId 
            ? { ...c, replies: [...(c.replies || []), newReply] }
            : c
        )
      } : null);
      setReplyText('');
      setReplyingTo(null);

      // Only save to backend if both article and parent comment have valid MongoDB ObjectIds
      if (isValidObjectId(article._id) && isValidObjectId(commentId)) {
        const { data, error } = await blogAPI.createComment({
          article: article._id,
          content: newReply.content,
          parent: commentId
        });

        if (data && data._id) {
          // Update the temp reply with real ID from server
          setArticle(prev => prev ? {
            ...prev,
            comments: prev.comments?.map(c => 
              c._id === commentId 
                ? { 
                    ...c, 
                    replies: c.replies?.map(r => 
                      r._id === tempId ? { 
                        ...r, 
                        _id: data._id,
                        user: {
                          name: data.user?.name || r.user.name,
                          username: data.user?.username || r.user.username,
                          avatar: data.user?.avatar || r.user.avatar
                        }
                      } : r
                    )
                  }
                : c
            )
          } : null);
        } else if (error) {
          console.error('Error saving reply to database:', error);
        }
      }
      // If sample data, reply is only stored locally in state
    } catch (error) {
      console.error('Error submitting reply:', error);
    } finally {
      setSubmittingReply(false);
    }
  };

  const handleLikeComment = async (commentId: string) => {
    if (!isAuthenticated) {
      setShowLoginPrompt(true);
      return;
    }
    
    // Optimistic update
    setArticle(prev => prev ? {
      ...prev,
      comments: prev.comments?.map(c => 
        c._id === commentId ? { ...c, likes: c.likes + 1 } : c
      )
    } : null);

    // Sync with backend only if valid ObjectId
    if (isValidObjectId(commentId)) {
      try {
        await blogAPI.toggleCommentLike(commentId);
      } catch (error) {
        console.error('Error liking comment:', error);
      }
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Update useEffect to use the memoized fetchArticle
  useEffect(() => {
    if (params.slug) {
      fetchArticle();
    }
  }, [params.slug, fetchArticle]);

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
                <div className="flex flex-wrap items-center gap-6 text-gray-600 dark:text-gray-400 mb-4">
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
                  </div>
                </div>

                {/* Engagement Stats Bar */}
                <div className="flex flex-wrap items-center gap-4 mb-8 p-4 bg-gray-50 dark:bg-slate-800 rounded-xl">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                    <span className="text-lg">👁️</span>
                    <span className="font-semibold">{article.views.toLocaleString()}</span>
                    <span className="text-sm text-gray-500">views</span>
                  </div>
                  <div className="w-px h-6 bg-gray-300 dark:bg-slate-600"></div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                    <span className="text-lg">👍</span>
                    <span className="font-semibold">{article.likes}</span>
                    <span className="text-sm text-gray-500">likes</span>
                  </div>
                  <div className="w-px h-6 bg-gray-300 dark:bg-slate-600"></div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                    <span className="text-lg">👎</span>
                    <span className="font-semibold">{article.dislikes}</span>
                    <span className="text-sm text-gray-500">dislikes</span>
                  </div>
                  <div className="w-px h-6 bg-gray-300 dark:bg-slate-600"></div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                    <span className="text-lg">💬</span>
                    <span className="font-semibold">{article.comments?.length || 0}</span>
                    <span className="text-sm text-gray-500">comments</span>
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

                {/* Like, Dislike & Share */}
                <div className="flex flex-wrap items-center gap-3 pb-12 border-b border-gray-200 dark:border-slate-700">
                  {/* Like Button */}
                  <button
                    onClick={handleLikeArticle}
                    className={`px-5 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 shadow-md hover:shadow-lg ${
                      hasLiked 
                        ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white ring-2 ring-pink-300' 
                        : 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white'
                    }`}
                  >
                    <span className="text-lg">👍</span>
                    <span>Like</span>
                    <span className="bg-white/20 px-2 py-0.5 rounded-full text-sm">{article.likes}</span>
                  </button>
                  
                  {/* Dislike Button */}
                  <button
                    onClick={handleDislikeArticle}
                    className={`px-5 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 shadow-md hover:shadow-lg ${
                      hasDisliked 
                        ? 'bg-gray-700 text-white ring-2 ring-gray-400' 
                        : 'bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-200'
                    }`}
                  >
                    <span className="text-lg">👎</span>
                    <span>Dislike</span>
                    <span className={`px-2 py-0.5 rounded-full text-sm ${hasDisliked ? 'bg-white/20' : 'bg-gray-300 dark:bg-slate-600'}`}>{article.dislikes}</span>
                  </button>

                  <div className="flex-1"></div>

                  {/* Share Button */}
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="px-5 py-3 bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 rounded-xl font-semibold transition-colors flex items-center gap-2"
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
                <div id="comments-section" className="mt-12 scroll-mt-24">
                  <h3 className="text-2xl font-bold mb-6">Comments ({article.comments?.length || 0})</h3>

                  {/* Comment Form */}
                  <form onSubmit={handleSubmitComment} className="mb-8">
                    {!isAuthenticated && (
                      <div className="mb-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg flex items-center justify-between">
                        <span className="text-yellow-800 dark:text-yellow-200 text-sm">
                          🔒 Please login to post a comment
                        </span>
                        <Link href="/login" className="text-sm font-medium text-yellow-700 dark:text-yellow-300 hover:underline">
                          Login →
                        </Link>
                      </div>
                    )}
                    <textarea
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder={isAuthenticated ? "Share your thoughts..." : "Login to comment..."}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 min-h-[100px]"
                      disabled={!isAuthenticated}
                    />
                    <div className="mt-3 flex justify-end">
                      <button
                        type="submit"
                        disabled={submittingComment || !commentText.trim() || !isAuthenticated}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {submittingComment ? 'Posting...' : 'Post Comment'}
                      </button>
                    </div>
                  </form>

                  {/* Comments List */}
                  <div className="space-y-6">
                    {(!article.comments || article.comments.length === 0) && (
                      <div className="text-center py-8 bg-gray-50 dark:bg-slate-800 rounded-lg">
                        <div className="text-4xl mb-3">💬</div>
                        <p className="text-gray-500 dark:text-gray-400">No comments yet. Be the first to share your thoughts!</p>
                      </div>
                    )}
                    {article.comments?.map((comment) => (
                      <div key={comment._id} className="flex gap-4 animate-fadeIn">
                        <div className="w-10 h-10 rounded-full flex-shrink-0 bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold overflow-hidden">
                          {comment.user.avatar ? (
                            <img src={comment.user.avatar} alt={comment.user.name} className="w-full h-full object-cover" />
                          ) : (
                            comment.user.name.charAt(0).toUpperCase()
                          )}
                        </div>
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
                          
                          {/* Comment Actions */}
                          <div className="mt-2 flex items-center gap-4 text-sm">
                            <button 
                              onClick={() => handleLikeComment(comment._id)}
                              className="text-gray-600 dark:text-gray-400 hover:text-pink-500 transition-colors flex items-center gap-1"
                            >
                              ❤️ <span>{comment.likes}</span>
                            </button>
                            <button 
                              onClick={() => {
                                if (!isAuthenticated) {
                                  setShowLoginPrompt(true);
                                  return;
                                }
                                setReplyingTo(replyingTo === comment._id ? null : comment._id);
                                setReplyText('');
                              }}
                              className={`transition-colors flex items-center gap-1 ${
                                replyingTo === comment._id 
                                  ? 'text-blue-500 font-medium' 
                                  : 'text-gray-600 dark:text-gray-400 hover:text-blue-500'
                              }`}
                            >
                              💬 Reply
                            </button>
                          </div>

                          {/* Reply Form */}
                          {replyingTo === comment._id && (
                            <div className="mt-4 ml-4 border-l-2 border-blue-300 dark:border-blue-600 pl-4">
                              <div className="flex gap-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                                  {user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
                                </div>
                                <div className="flex-1">
                                  <textarea
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    placeholder={`Reply to ${comment.user.name}...`}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 min-h-[60px] resize-none"
                                    autoFocus
                                  />
                                  <div className="mt-2 flex items-center gap-2 justify-end">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setReplyingTo(null);
                                        setReplyText('');
                                      }}
                                      className="px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                                    >
                                      Cancel
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleSubmitReply(comment._id)}
                                      disabled={submittingReply || !replyText.trim()}
                                      className="px-4 py-1.5 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                      {submittingReply ? 'Posting...' : 'Reply'}
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Replies */}
                          {comment.replies && comment.replies.length > 0 && (
                            <div className="mt-4 ml-4 border-l-2 border-gray-200 dark:border-slate-700 pl-4 space-y-3">
                              {comment.replies.map((reply) => (
                                <div key={reply._id} className="flex gap-3">
                                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 overflow-hidden">
                                    {reply.user.avatar ? (
                                      <img src={reply.user.avatar} alt={reply.user.name} className="w-full h-full object-cover" />
                                    ) : (
                                      reply.user.name.charAt(0).toUpperCase()
                                    )}
                                  </div>
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
          <section className="bg-gray-50 dark:bg-slate-800 py-16 mb-16 md:mb-0">
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

        {/* Sticky Engagement Bar - Vertical on right for desktop, bottom for mobile */}
        {/* Desktop: Vertical bar on right */}
        <div className="hidden md:flex fixed right-6 top-1/2 -translate-y-1/2 z-50">
          <div className="flex flex-col items-center gap-3 px-3 py-4 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700">
            {/* Like Button */}
            <button
              onClick={handleLikeArticle}
              className={`flex flex-col items-center gap-1 p-3 rounded-xl font-medium transition-all ${
                hasLiked 
                  ? 'bg-pink-500 text-white' 
                  : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-200 hover:bg-pink-100 dark:hover:bg-pink-900/30'
              }`}
              title="Like"
            >
              <span className="text-xl">👍</span>
              <span className="text-xs font-bold">{article.likes}</span>
            </button>
            
            {/* Dislike Button */}
            <button
              onClick={handleDislikeArticle}
              className={`flex flex-col items-center gap-1 p-3 rounded-xl font-medium transition-all ${
                hasDisliked 
                  ? 'bg-gray-600 text-white' 
                  : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-slate-600'
              }`}
              title="Dislike"
            >
              <span className="text-xl">👎</span>
              <span className="text-xs font-bold">{article.dislikes}</span>
            </button>

            <div className="w-8 h-px bg-gray-300 dark:bg-slate-600"></div>

            {/* Comments */}
            <button
              onClick={() => document.getElementById('comments-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="flex flex-col items-center gap-1 p-3 rounded-xl font-medium bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all"
              title="Comments"
            >
              <span className="text-xl">💬</span>
              <span className="text-xs font-bold">{article.comments?.length || 0}</span>
            </button>

            <div className="w-8 h-px bg-gray-300 dark:bg-slate-600"></div>

            {/* Share Button */}
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="flex flex-col items-center gap-1 p-3 rounded-xl font-medium bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-200 hover:bg-green-100 dark:hover:bg-green-900/30 transition-all"
              title="Share"
            >
              <span className="text-xl">{copied ? '✓' : '🔗'}</span>
              <span className="text-xs font-bold">{copied ? 'Done' : 'Share'}</span>
            </button>

            <div className="w-8 h-px bg-gray-300 dark:bg-slate-600"></div>

            {/* Views */}
            <div className="flex flex-col items-center gap-1 p-2 text-gray-500 dark:text-gray-400" title="Views">
              <span className="text-xl">👁️</span>
              <span className="text-xs font-bold">{article.views.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Mobile: Horizontal bar at bottom */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 safe-area-bottom">
          <div className="flex items-center justify-around px-2 py-3 bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700 shadow-2xl">
            {/* Like Button */}
            <button
              onClick={handleLikeArticle}
              className={`flex flex-col items-center gap-0.5 px-4 py-1 rounded-lg font-medium transition-all ${
                hasLiked 
                  ? 'text-pink-500' 
                  : 'text-gray-600 dark:text-gray-300'
              }`}
            >
              <span className="text-xl">👍</span>
              <span className="text-xs font-bold">{article.likes}</span>
            </button>
            
            {/* Dislike Button */}
            <button
              onClick={handleDislikeArticle}
              className={`flex flex-col items-center gap-0.5 px-4 py-1 rounded-lg font-medium transition-all ${
                hasDisliked 
                  ? 'text-gray-800 dark:text-white' 
                  : 'text-gray-600 dark:text-gray-300'
              }`}
            >
              <span className="text-xl">👎</span>
              <span className="text-xs font-bold">{article.dislikes}</span>
            </button>

            {/* Comments */}
            <button
              onClick={() => document.getElementById('comments-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="flex flex-col items-center gap-0.5 px-4 py-1 rounded-lg font-medium text-gray-600 dark:text-gray-300"
            >
              <span className="text-xl">💬</span>
              <span className="text-xs font-bold">{article.comments?.length || 0}</span>
            </button>

            {/* Share Button */}
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="flex flex-col items-center gap-0.5 px-4 py-1 rounded-lg font-medium text-gray-600 dark:text-gray-300"
            >
              <span className="text-xl">{copied ? '✓' : '🔗'}</span>
              <span className="text-xs font-bold">{copied ? 'Done' : 'Share'}</span>
            </button>

            {/* Views */}
            <div className="flex flex-col items-center gap-0.5 px-4 py-1 text-gray-500 dark:text-gray-400">
              <span className="text-xl">👁️</span>
              <span className="text-xs font-bold">{article.views.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Login Prompt Modal */}
        {showLoginPrompt && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50" onClick={() => setShowLoginPrompt(false)}>
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-sm mx-4 shadow-2xl" onClick={e => e.stopPropagation()}>
              <div className="text-center">
                <div className="text-5xl mb-4">🔐</div>
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Login Required</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Please login to like, dislike, or comment on this article.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowLoginPrompt(false)}
                    className="flex-1 px-4 py-2 bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-200 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <Link
                    href="/login"
                    className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors text-center"
                  >
                    Login
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </Layout>
    </>
  );
}
