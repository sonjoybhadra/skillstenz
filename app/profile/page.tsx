'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Layout from '@/components/Layout';

interface SocialLinks {
  github?: string;
  linkedin?: string;
  twitter?: string;
  youtube?: string;
}

interface UserProfile {
  _id: string;
  username: string;
  name: string;
  email: string;
  profileImage?: string;
  userType: 'fresher' | 'experienced';
  title?: string;
  location?: string;
  phone?: string;
  website?: string;
  bio?: string;
  streak: number;
  completedCourses: number;
  totalPoints: number;
  skills: string[];
  interests: string[];
  socialLinks?: SocialLinks;
  certifications: { name: string; issuer: string; date: string; link?: string }[];
  resumeTemplate?: string;
  isPublic: boolean;
}

interface Hackathon {
  id: string;
  title: string;
  organizer: string;
  startDate: string;
  endDate: string;
  mode: 'online' | 'offline' | 'hybrid';
  prize: string;
  skillsRequired: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  registrationLink: string;
  description: string;
}

interface Internship {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'remote' | 'onsite' | 'hybrid';
  duration: string;
  stipend: string;
  skillsRequired: string[];
  applyLink: string;
  deadline: string;
}

interface InterviewTopic {
  id: string;
  title: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  questionsCount: number;
  completedCount: number;
  icon: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const fallbackHackathons: Hackathon[] = [
  {
    id: '1',
    title: 'AI Innovation Challenge 2025',
    organizer: 'Google Developer Groups',
    startDate: '2025-01-15',
    endDate: '2025-01-17',
    mode: 'online',
    prize: '$10,000',
    skillsRequired: ['Python', 'Machine Learning', 'TensorFlow'],
    difficulty: 'intermediate',
    registrationLink: '#',
    description: 'Build innovative AI solutions to solve real-world problems.',
  },
];

const fallbackInternships: Internship[] = [
  {
    id: '1',
    title: 'AI/ML Engineering Intern',
    company: 'Microsoft',
    location: 'Remote',
    type: 'remote',
    duration: '3 months',
    stipend: '$3,000/month',
    skillsRequired: ['Python', 'PyTorch', 'Machine Learning'],
    applyLink: '#',
    deadline: '2025-02-15',
  },
];

const fallbackInterviewTopics: InterviewTopic[] = [
  { id: '1', title: 'Arrays & Strings', category: 'Data Structures', difficulty: 'easy', questionsCount: 15, completedCount: 0, icon: '📊' },
  { id: '2', title: 'Trees & Graphs', category: 'Data Structures', difficulty: 'medium', questionsCount: 20, completedCount: 0, icon: '🌳' },
];

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'hackathons' | 'internships' | 'interview'>('overview');
  const [editForm, setEditForm] = useState({
    name: '',
    title: '',
    location: '',
    phone: '',
    website: '',
    bio: '',
    skills: '',
    interests: '',
    github: '',
    linkedin: '',
    twitter: '',
    isPublic: true,
  });

  const [matchingHackathons, setMatchingHackathons] = useState<Hackathon[]>(fallbackHackathons);
  const [matchingInternships, setMatchingInternships] = useState<Internship[]>(fallbackInternships);
  const [interviewTopics, setInterviewTopics] = useState<InterviewTopic[]>(fallbackInterviewTopics);
  const [loadingData, setLoadingData] = useState({ profile: true, hackathons: false, internships: false, interview: false });

  // Image upload states
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();

  // Fetch profile data
  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        router.push('/login');
      } else {
        fetchProfile();
        fetchHackathons();
        fetchInternships();
        fetchInterviewTopics();
      }
    }
  }, [isAuthenticated, authLoading, router]);

  const fetchProfile = async () => {
    try {
      setLoadingData(prev => ({ ...prev, profile: true }));
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${API_URL}/users/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
        setEditForm({
          name: data.name || '',
          title: data.title || '',
          location: data.location || '',
          phone: data.phone || '',
          website: data.website || '',
          bio: data.bio || '',
          skills: data.skills?.join(', ') || '',
          interests: data.interests?.join(', ') || '',
          github: data.socialLinks?.github || '',
          linkedin: data.socialLinks?.linkedin || '',
          twitter: data.socialLinks?.twitter || '',
          isPublic: data.isPublic !== false,
        });
      }
    } catch (err) {
      console.error('Failed to fetch profile:', err);
      toast.error('Failed to load profile');
    } finally {
      setLoadingData(prev => ({ ...prev, profile: false }));
    }
  };

  const fetchHackathons = async () => {
    try {
      setLoadingData(prev => ({ ...prev, hackathons: true }));
      const response = await fetch(`${API_URL}/hackathons`);
      if (response.ok) {
        const data = await response.json();
        if (data.hackathons && data.hackathons.length > 0) {
          setMatchingHackathons(data.hackathons.map((h: { _id: string; title: string; organizer: string; startDate: string; endDate: string; mode: string; prize: string; skillsRequired: string[]; difficulty: string; registrationLink: string; description: string }) => ({
            id: h._id, title: h.title, organizer: h.organizer, startDate: h.startDate,
            endDate: h.endDate, mode: h.mode, prize: h.prize, skillsRequired: h.skillsRequired || [],
            difficulty: h.difficulty, registrationLink: h.registrationLink, description: h.description,
          })));
        }
      }
    } catch (err) {
      console.error('Failed to fetch hackathons:', err);
    } finally {
      setLoadingData(prev => ({ ...prev, hackathons: false }));
    }
  };

  const fetchInternships = async () => {
    try {
      setLoadingData(prev => ({ ...prev, internships: true }));
      const response = await fetch(`${API_URL}/internships`);
      if (response.ok) {
        const data = await response.json();
        if (data.internships && data.internships.length > 0) {
          setMatchingInternships(data.internships.map((i: { _id: string; title: string; company: string; location: string; type: string; duration: string; stipend: string; skillsRequired: string[]; applyLink: string; deadline: string }) => ({
            id: i._id, title: i.title, company: i.company, location: i.location,
            type: i.type, duration: i.duration, stipend: i.stipend, skillsRequired: i.skillsRequired || [],
            applyLink: i.applyLink, deadline: i.deadline,
          })));
        }
      }
    } catch (err) {
      console.error('Failed to fetch internships:', err);
    } finally {
      setLoadingData(prev => ({ ...prev, internships: false }));
    }
  };

  const fetchInterviewTopics = async () => {
    try {
      setLoadingData(prev => ({ ...prev, interview: true }));
      const response = await fetch(`${API_URL}/interview/topics`);
      if (response.ok) {
        const data = await response.json();
        if (data.topics && data.topics.length > 0) {
          setInterviewTopics(data.topics.map((t: { _id: string; title: string; category: string; difficulty: string; questions?: { question: string }[]; icon: string }) => ({
            id: t._id, title: t.title, category: t.category, difficulty: t.difficulty,
            questionsCount: t.questions?.length || 0, completedCount: 0, icon: t.icon || '📝',
          })));
        }
      }
    } catch (err) {
      console.error('Failed to fetch interview topics:', err);
    } finally {
      setLoadingData(prev => ({ ...prev, interview: false }));
    }
  };

  const handleSaveProfile = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${API_URL}/users/profile`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: editForm.name,
          title: editForm.title,
          location: editForm.location,
          phone: editForm.phone,
          website: editForm.website,
          bio: editForm.bio,
          skills: editForm.skills.split(',').map(s => s.trim()).filter(Boolean),
          interests: editForm.interests.split(',').map(s => s.trim()).filter(Boolean),
          socialLinks: {
            github: editForm.github,
            linkedin: editForm.linkedin,
            twitter: editForm.twitter,
          },
          isPublic: editForm.isPublic,
        }),
      });

      if (!response.ok) throw new Error('Failed to update profile');
      const data = await response.json();
      setProfile(data.user);
      setEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
      console.error(error);
    }
  };

  // Image handling functions
  const handleFileSelect = (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
      setShowImageModal(true);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleFileSelect(file);
    } else {
      toast.error('Please drop an image file');
    }
  };

  const handleImageUpload = async () => {
    if (!imagePreview) return;
    
    try {
      setUploadingImage(true);
      const token = localStorage.getItem('accessToken');
      
      const response = await fetch(imagePreview);
      const blob = await response.blob();
      
      const formData = new FormData();
      formData.append('image', blob, 'profile-image.jpg');
      
      const uploadResponse = await fetch(`${API_URL}/users/profile/image`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      });
      
      if (!uploadResponse.ok) throw new Error('Upload failed');
      
      const data = await uploadResponse.json();
      setProfile(prev => prev ? { ...prev, profileImage: data.imageUrl } : null);
      setShowImageModal(false);
      setImagePreview(null);
      toast.success('Profile image updated!');
    } catch (err) {
      toast.error('Failed to upload image');
      console.error(err);
    } finally {
      setUploadingImage(false);
    }
  };

  if (authLoading || loadingData.profile) {
    return (
      <Layout showSidebar>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full"></div>
        </div>
      </Layout>
    );
  }

  if (!profile) {
    return (
      <Layout showSidebar>
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-gray-500">Failed to load profile</p>
        </div>
      </Layout>
    );
  }

  const profileImageUrl = profile.profileImage 
    ? (profile.profileImage.startsWith('http') ? profile.profileImage : `${API_URL.replace('/api', '')}${profile.profileImage}`)
    : null;

  return (
    <Layout showSidebar>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Image Upload Modal */}
        {showImageModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Preview Profile Image</h3>
              <div className="relative w-48 h-48 mx-auto rounded-full overflow-hidden border-4 border-violet-500">
                {imagePreview && <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />}
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => { setShowImageModal(false); setImagePreview(null); }}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  disabled={uploadingImage}
                >
                  Cancel
                </button>
                <button
                  onClick={handleImageUpload}
                  disabled={uploadingImage}
                  className="flex-1 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {uploadingImage ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Uploading...
                    </>
                  ) : 'Save Image'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Header Banner */}
        <div className="bg-gradient-to-r from-violet-600 to-purple-600 pt-20 pb-32">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
              {/* Profile Image with Upload */}
              <div 
                className="relative cursor-pointer group"
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className={`w-32 h-32 rounded-2xl bg-white/20 backdrop-blur-sm border-4 ${isDragging ? 'border-white' : 'border-white/30'} overflow-hidden flex items-center justify-center transition-all`}>
                  {profileImageUrl ? (
                    <img src={profileImageUrl} alt={profile.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-5xl font-bold text-white">{(profile.name || profile.email).charAt(0).toUpperCase()}</span>
                  )}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl">
                    <span className="text-white text-sm font-medium">Change Photo</span>
                  </div>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                />
              </div>

              <div className="flex-1 text-white">
                <h1 className="text-3xl font-bold mb-1">{profile.name || 'Add Your Name'}</h1>
                {profile.title && <p className="text-white/90 text-lg mb-1">{profile.title}</p>}
                <p className="text-white/80 mb-3">@{profile.username} • {profile.email}</p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
                    {profile.userType === 'fresher' ? '🎓 Fresher' : '💼 Experienced'}
                  </span>
                  {profile.location && <span className="px-3 py-1 bg-white/20 rounded-full text-sm">📍 {profile.location}</span>}
                  <span className="px-3 py-1 bg-white/20 rounded-full text-sm">🔥 {profile.streak || 0} day streak</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setEditing(!editing)}
                  className="px-4 py-2 bg-white text-violet-600 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                >
                  {editing ? 'Cancel' : 'Edit Profile'}
                </button>
                <Link href={`/u/${profile.username}`} target="_blank" className="px-4 py-2 bg-white/20 text-white rounded-lg font-medium hover:bg-white/30 transition-colors">
                  👁️ View Public
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 -mt-20">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Courses Completed', value: profile.completedCourses || 0, icon: '📚' },
              { label: 'Total Points', value: profile.totalPoints || 0, icon: '⭐' },
              { label: 'Skills', value: profile.skills?.length || 0, icon: '🎯' },
              { label: 'Certificates', value: profile.certifications?.length || 0, icon: '🏆' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="text-2xl mb-2">{stat.icon}</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="border-b border-gray-200 dark:border-gray-700">
              <nav className="flex overflow-x-auto">
                {[
                  { id: 'overview', label: 'Overview', icon: '👤' },
                  { id: 'hackathons', label: 'Hackathons', icon: '🚀' },
                  { id: 'internships', label: 'Internships', icon: '💼' },
                  { id: 'interview', label: 'Interview Prep', icon: '📝' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as typeof activeTab)}
                    className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                      activeTab === tab.id
                        ? 'border-violet-600 text-violet-600 dark:text-violet-400'
                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-violet-600'
                    }`}
                  >
                    <span>{tab.icon}</span> {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-6">
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {editing ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                          <input type="text" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 focus:ring-2 focus:ring-violet-500" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title/Role</label>
                          <input type="text" value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} placeholder="e.g. Full Stack Developer" className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 focus:ring-2 focus:ring-violet-500" />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location</label>
                          <input type="text" value={editForm.location} onChange={(e) => setEditForm({ ...editForm, location: e.target.value })} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 focus:ring-2 focus:ring-violet-500" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
                          <input type="tel" value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 focus:ring-2 focus:ring-violet-500" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bio</label>
                        <textarea value={editForm.bio} onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })} rows={3} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 focus:ring-2 focus:ring-violet-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Skills (comma separated)</label>
                        <input type="text" value={editForm.skills} onChange={(e) => setEditForm({ ...editForm, skills: e.target.value })} placeholder="Python, JavaScript, React" className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 focus:ring-2 focus:ring-violet-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Interests (comma separated)</label>
                        <input type="text" value={editForm.interests} onChange={(e) => setEditForm({ ...editForm, interests: e.target.value })} placeholder="Web Development, AI/ML, Cloud Computing" className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 focus:ring-2 focus:ring-violet-500" />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">GitHub URL</label>
                          <input type="url" value={editForm.github} onChange={(e) => setEditForm({ ...editForm, github: e.target.value })} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 focus:ring-2 focus:ring-violet-500" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">LinkedIn URL</label>
                          <input type="url" value={editForm.linkedin} onChange={(e) => setEditForm({ ...editForm, linkedin: e.target.value })} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 focus:ring-2 focus:ring-violet-500" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Twitter/X URL</label>
                          <input type="url" value={editForm.twitter} onChange={(e) => setEditForm({ ...editForm, twitter: e.target.value })} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 focus:ring-2 focus:ring-violet-500" />
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <input type="checkbox" id="isPublic" checked={editForm.isPublic} onChange={(e) => setEditForm({ ...editForm, isPublic: e.target.checked })} className="w-4 h-4 text-violet-600" />
                        <label htmlFor="isPublic" className="text-sm text-gray-700 dark:text-gray-300">Make my profile public</label>
                      </div>
                      <button onClick={handleSaveProfile} className="px-6 py-2 bg-violet-600 text-white rounded-lg font-medium hover:bg-violet-700 transition-colors">
                        Save Changes
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">About</h3>
                        <p className="text-gray-600 dark:text-gray-400">{profile.bio || 'No bio added yet. Click Edit Profile to add one.'}</p>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Skills</h3>
                        {profile.skills?.length ? (
                          <div className="flex flex-wrap gap-2">
                            {profile.skills.map((skill, i) => (
                              <span key={i} className="px-3 py-1.5 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 rounded-full text-sm font-medium">{skill}</span>
                            ))}
                          </div>
                        ) : <p className="text-gray-500">No skills added yet</p>}
                      </div>
                      {profile.interests && profile.interests.length > 0 && (
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Interests</h3>
                          <div className="flex flex-wrap gap-2">
                            {profile.interests.map((interest, i) => (
                              <span key={i} className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm">{interest}</span>
                            ))}
                          </div>
                        </div>
                      )}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Links</h3>
                        <div className="flex gap-4">
                          {profile.socialLinks?.github && (
                            <a href={profile.socialLinks.github} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900 dark:hover:text-white">
                              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                            </a>
                          )}
                          {profile.socialLinks?.linkedin && (
                            <a href={profile.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600">
                              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                            </a>
                          )}
                          {profile.socialLinks?.twitter && (
                            <a href={profile.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-sky-500">
                              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                            </a>
                          )}
                          {profile.website && (
                            <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-violet-600">
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 21a9 9 0 100-18 9 9 0 000 18z"/><path d="M3.6 9h16.8M3.6 15h16.8M12 3a15 15 0 014 9 15 15 0 01-4 9 15 15 0 01-4-9 15 15 0 014-9z"/></svg>
                            </a>
                          )}
                        </div>
                      </div>
                      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex flex-wrap gap-3">
                          <Link href="/resume-builder" className="px-4 py-2 bg-violet-600 text-white rounded-lg text-sm hover:bg-violet-700 transition-colors">📄 Resume Builder</Link>
                          <Link href="/settings" className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">⚙️ Settings</Link>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Hackathons Tab */}
              {activeTab === 'hackathons' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recommended Hackathons</h3>
                  {loadingData.hackathons ? (
                    <div className="flex justify-center py-8"><div className="animate-spin w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full"></div></div>
                  ) : (
                    <div className="grid gap-4">
                      {matchingHackathons.map((h) => (
                        <div key={h.id} className="border border-gray-200 dark:border-gray-700 rounded-xl p-5 hover:shadow-lg transition-shadow">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{h.title}</h4>
                              <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">{h.description}</p>
                              <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-2">
                                <span>🏢 {h.organizer}</span>
                                <span>📅 {new Date(h.startDate).toLocaleDateString()}</span>
                                <span>🏆 {h.prize}</span>
                              </div>
                              <div className="flex flex-wrap gap-1.5">
                                {h.skillsRequired.map((s, i) => <span key={i} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded text-xs">{s}</span>)}
                              </div>
                            </div>
                            <a href={h.registrationLink} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-violet-600 text-white rounded-lg text-sm font-medium hover:bg-violet-700 whitespace-nowrap">Register →</a>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Internships Tab */}
              {activeTab === 'internships' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Online Internships</h3>
                  {loadingData.internships ? (
                    <div className="flex justify-center py-8"><div className="animate-spin w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full"></div></div>
                  ) : (
                    <div className="grid gap-4">
                      {matchingInternships.map((int) => (
                        <div key={int.id} className="border border-gray-200 dark:border-gray-700 rounded-xl p-5 hover:shadow-lg transition-shadow">
                          <div className="flex items-start gap-4">
                            <div className="w-14 h-14 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center text-2xl">💼</div>
                            <div className="flex-1">
                              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{int.title}</h4>
                              <p className="text-violet-600 font-medium">{int.company}</p>
                              <div className="flex flex-wrap gap-4 text-sm text-gray-500 mt-2">
                                <span>📍 {int.location}</span>
                                <span>⏱️ {int.duration}</span>
                                <span>💰 {int.stipend}</span>
                              </div>
                              <div className="flex flex-wrap gap-1.5 mt-2">
                                {int.skillsRequired.map((s, i) => <span key={i} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded text-xs">{s}</span>)}
                              </div>
                            </div>
                            <a href={int.applyLink} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-violet-600 text-white rounded-lg text-sm font-medium hover:bg-violet-700 whitespace-nowrap">Apply →</a>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Interview Prep Tab */}
              {activeTab === 'interview' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Interview Preparation</h3>
                  <div className="bg-gradient-to-r from-violet-500 to-purple-600 rounded-xl p-6 text-white">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="text-xl font-bold">Your Interview Readiness</h4>
                        <p className="text-white/80 text-sm">Complete practice questions</p>
                      </div>
                      <div className="text-right">
                        <div className="text-4xl font-bold">0%</div>
                        <div className="text-sm text-white/80">Ready</div>
                      </div>
                    </div>
                  </div>
                  {loadingData.interview ? (
                    <div className="flex justify-center py-8"><div className="animate-spin w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full"></div></div>
                  ) : (
                    <div className="grid md:grid-cols-2 gap-4">
                      {interviewTopics.map((t) => (
                        <Link key={t.id} href={`/interview-prep/${t.id}`} className="border border-gray-200 dark:border-gray-700 rounded-xl p-5 hover:shadow-lg transition-shadow">
                          <div className="flex items-start gap-3">
                            <div className="text-2xl">{t.icon}</div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900 dark:text-white">{t.title}</h4>
                              <p className="text-sm text-gray-500">{t.category}</p>
                              <p className="text-sm text-gray-500 mt-1">{t.completedCount}/{t.questionsCount} completed</p>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
