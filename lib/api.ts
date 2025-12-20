// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Types
export interface Technology {
  _id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  accessType: 'free' | 'paid' | 'mixed';
  courseCount: number;
  featured: boolean;
  order: number;
  courses?: Course[];
  categories?: Category[];
}

export interface Course {
  _id: string;
  title: string;
  slug: string;
  description: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  topics: number;
  lessons: number;
  image?: string;
  featured: boolean;
  price: 'free' | 'paid';
  instructor?: {
    name: string;
    title: string;
    avatar?: string;
    bio?: string;
    rating?: number;
    students?: number;
    courses?: number;
  };
  rating: number;
  studentsCount: number;
  tags: string[];
  learningObjectives?: string[];
  prerequisites?: string[];
  content?: string;
  technology?: string;
  technologyName?: string;
  technologyId?: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  topics: Topic[];
}

export interface Topic {
  _id: string;
  name: string;
  slug: string;
  description: string;
  subtopics: Subtopic[];
}

export interface Subtopic {
  _id: string;
  name: string;
  slug: string;
  description: string;
}

export interface User {
  _id: string;
  email: string;
  role: 'admin' | 'student';
  userType: 'fresher' | 'experienced';
  accountStatus?: 'active' | 'blocked';
  createdAt?: string;
  lastLogin?: string;
}

// Helper function to get auth headers
const getAuthHeaders = (): HeadersInit => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

// Token refresh helper
let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  if (typeof window === 'undefined') return null;
  
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) return null;
  
  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });
    
    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('accessToken', data.accessToken);
      return data.accessToken;
    } else {
      // Refresh token is also invalid, clear auth
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      return null;
    }
  } catch {
    return null;
  }
}

// Generic API request function with auto token refresh
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  retryOnAuthError = true
): Promise<{ data: T | null; error: string | null; status: number }> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...getAuthHeaders(),
        ...options.headers,
      },
    });

    const data = await response.json();

    // Handle token expiration (401 or 403)
    if ((response.status === 401 || response.status === 403) && retryOnAuthError) {
      const errorMessage = data.message?.toLowerCase() || '';
      if (errorMessage.includes('expired') || errorMessage.includes('invalid')) {
        // Try to refresh the token
        if (!isRefreshing) {
          isRefreshing = true;
          refreshPromise = refreshAccessToken();
        }
        
        const newToken = await refreshPromise;
        isRefreshing = false;
        refreshPromise = null;
        
        if (newToken) {
          // Retry the request with new token
          return apiRequest<T>(endpoint, options, false);
        } else {
          // Redirect to login if refresh failed
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
        }
      }
    }

    if (!response.ok) {
      return {
        data: null,
        error: data.message || 'Something went wrong',
        status: response.status,
      };
    }

    return { data, error: null, status: response.status };
  } catch (error) {
    console.error('API Error:', error);
    return {
      data: null,
      error: 'Network error. Please check your connection.',
      status: 0,
    };
  }
}

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    return apiRequest<{
      accessToken: string;
      refreshToken: string;
      user: {
        id: string;
        email: string;
        userType: string;
        role: string;
      };
      message: string;
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  register: async (data: {
    name?: string;
    email: string;
    password: string;
    userType: string;
  }) => {
    return apiRequest<{
      accessToken: string;
      refreshToken: string;
      user: {
        id: string;
        email: string;
        userType: string;
        role: string;
      };
      message: string;
    }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  logout: async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    return apiRequest('/auth/logout', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
  },

  refreshToken: async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    return apiRequest<{
      accessToken: string;
    }>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
  },
};

// Technologies API
export const technologiesAPI = {
  getAll: async (params?: { featured?: boolean; accessType?: string; limit?: number }) => {
    const queryParams = new URLSearchParams();
    if (params?.featured) queryParams.append('featured', 'true');
    if (params?.accessType) queryParams.append('accessType', params.accessType);
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
    const response = await apiRequest<{ technologies: Technology[]; pagination: { total: number } }>(`/technologies${query}`);
    // Transform the response to return the technologies array directly for backward compatibility
    if (response.data && 'technologies' in response.data) {
      return { data: response.data.technologies, error: response.error, status: response.status };
    }
    return response as { data: Technology[] | null; error: string | null; status: number };
  },

  getBySlug: async (slug: string) => {
    const response = await apiRequest<{ technology: Technology } | Technology>(`/technologies/slug/${slug}`);
    if (response.data && 'technology' in response.data) {
      return { data: response.data.technology, error: response.error, status: response.status };
    }
    return response as { data: Technology | null; error: string | null; status: number };
  },
  
  getById: async (id: string) => {
    return apiRequest<Technology>(`/technologies/${id}`);
  },
  
  getCourses: async (params?: {
    technology?: string;
    level?: string;
    price?: string;
    featured?: boolean;
    search?: string;
    page?: number;
    limit?: number;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.technology) queryParams.append('technology', params.technology);
    if (params?.level) queryParams.append('level', params.level);
    if (params?.price) queryParams.append('price', params.price);
    if (params?.featured) queryParams.append('featured', 'true');
    if (params?.search) queryParams.append('search', params.search);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return apiRequest<{ courses: Course[]; total: number; page: number; totalPages: number }>(`/technologies/courses${query}`);
  },
  
  getCourseBySlug: async (techSlug: string, courseSlug: string) => {
    return apiRequest<Course>(`/technologies/slug/${techSlug}/courses/${courseSlug}`);
  },
};

// Courses API - New MongoDB-backed API
export const coursesAPI = {
  getAll: async (params?: {
    technology?: string;
    level?: string;
    featured?: boolean;
    search?: string;
    page?: number;
    limit?: number;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.technology) queryParams.append('technology', params.technology);
    if (params?.level) queryParams.append('level', params.level);
    if (params?.featured) queryParams.append('featured', 'true');
    if (params?.search) queryParams.append('search', params.search);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return apiRequest<{ courses: Course[]; pagination: { total: number; page: number; pages: number } }>(`/courses${query}`);
  },

  getBySlug: async (slug: string) => {
    const response = await apiRequest<{ course: Course } | Course>(`/courses/slug/${slug}`);
    if (response.data && 'course' in response.data) {
      return { data: response.data.course, error: response.error, status: response.status };
    }
    return response as { data: Course | null; error: string | null; status: number };
  },

  getById: async (id: string) => {
    return apiRequest<Course>(`/courses/${id}`);
  },

  // Legacy methods for backward compatibility
  getByTechnology: async (technologySlug: string) => {
    return apiRequest<{
      topics: Array<{
        _id: string;
        slug: string;
        title: string;
        description: string;
        order: number;
      }>;
    }>(`/topics/technology/${technologySlug}`);
  },

  getTopicContent: async (topicId: string) => {
    return apiRequest<{
      content: {
        _id: string;
        title: string;
        content: string;
        codeExamples: Array<{
          language: string;
          code: string;
          description: string;
        }>;
      };
    }>(`/content/topic/${topicId}`);
  },
};

// User API
export const userAPI = {
  getProfile: async () => {
    return apiRequest<{
      user: {
        id: string;
        email: string;
        userType: string;
        role: string;
        profile?: {
          fullName: string;
          avatar: string;
          bio: string;
        };
      };
    }>('/users/me');
  },

  updateProfile: async (data: {
    fullName?: string;
    bio?: string;
    skills?: string[];
  }) => {
    return apiRequest('/profiles', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
};

// Progress API
export const progressAPI = {
  markComplete: async (topicId: string) => {
    return apiRequest('/users/progress', {
      method: 'POST',
      body: JSON.stringify({ topicId, completed: true }),
    });
  },

  getProgress: async () => {
    return apiRequest<{
      progress: Array<{
        topicId: string;
        completed: boolean;
        completedAt: string;
      }>;
    }>('/users/progress');
  },
};

// Auth helpers
export const authHelpers = {
  isLoggedIn: (): boolean => {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('accessToken');
  },

  getUser: () => {
    if (typeof window === 'undefined') return null;
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  setTokens: (accessToken: string, refreshToken: string) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  },

  setUser: (user: object) => {
    localStorage.setItem('user', JSON.stringify(user));
  },

  clearAuth: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  },
  
  isAdmin: (): boolean => {
    const user = authHelpers.getUser();
    return user?.role === 'admin';
  },
};

// Admin API
export const adminAPI = {
  // Dashboard
  getDashboardStats: async () => {
    return apiRequest<{
      totalUsers: number;
      activeMemberships: number;
      revenue: number;
      aiStats: { totalQueries: number; totalTokens: number };
      recentUsers: User[];
    }>('/admin/dashboard');
  },

  // Users
  getUsers: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    userType?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.role) queryParams.append('role', params.role);
    if (params?.userType) queryParams.append('userType', params.userType);
    const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return apiRequest<{ users: User[]; total: number; currentPage: number; totalPages: number }>(`/admin/users${query}`);
  },

  updateUser: async (userId: string, data: Partial<User>) => {
    return apiRequest<{ message: string; user: User }>(`/admin/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  deleteUser: async (userId: string) => {
    return apiRequest<{ message: string }>(`/admin/users/${userId}`, {
      method: 'DELETE',
    });
  },

  // Technologies
  getTechnologies: async (params?: { page?: number; limit?: number; search?: string }) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return apiRequest<{ technologies: Technology[]; total: number; currentPage: number; totalPages: number }>(`/admin/technologies${query}`);
  },

  getTechnology: async (id: string) => {
    return apiRequest<Technology>(`/admin/technologies/${id}`);
  },

  createTechnology: async (data: Partial<Technology>) => {
    return apiRequest<{ message: string; technology: Technology }>('/admin/technologies', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateTechnology: async (id: string, data: Partial<Technology>) => {
    return apiRequest<{ message: string; technology: Technology }>(`/admin/technologies/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  deleteTechnology: async (id: string) => {
    return apiRequest<{ message: string }>(`/admin/technologies/${id}`, {
      method: 'DELETE',
    });
  },

  // Courses
  getCourses: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    technology?: string;
    level?: string;
    price?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.technology) queryParams.append('technology', params.technology);
    if (params?.level) queryParams.append('level', params.level);
    if (params?.price) queryParams.append('price', params.price);
    const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return apiRequest<{ courses: Course[]; total: number; currentPage: number; totalPages: number }>(`/admin/courses${query}`);
  },

  addCourse: async (techId: string, data: Partial<Course>) => {
    return apiRequest<{ message: string; course: Course }>(`/admin/technologies/${techId}/courses`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateCourse: async (techId: string, courseId: string, data: Partial<Course>) => {
    return apiRequest<{ message: string; course: Course }>(`/admin/technologies/${techId}/courses/${courseId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  deleteCourse: async (techId: string, courseId: string) => {
    return apiRequest<{ message: string }>(`/admin/technologies/${techId}/courses/${courseId}`, {
      method: 'DELETE',
    });
  },

  // Membership Stats
  getMembershipStats: async () => {
    return apiRequest<{ _id: string; count: number; active: number }[]>('/admin/membership-stats');
  },
};

const api = {
  auth: authAPI,
  technologies: technologiesAPI,
  courses: coursesAPI,
  user: userAPI,
  progress: progressAPI,
  admin: adminAPI,
};

export default api;
