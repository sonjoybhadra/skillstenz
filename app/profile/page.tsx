'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Layout from '@/components/Layout';

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  profileImage?: string;
  avatar?: string;
  userType: 'fresher' | 'experienced';
  location?: string;
  streak: number;
  completedCourses: number;
  totalPoints: number;
  skills: string[];
  bio?: string;
  github?: string;
  linkedin?: string;
  website?: string;
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
  description?: string;
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

const sampleHackathons: Hackathon[] = [
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
  {
    id: '2',
    title: 'Web3 DeFi Hackathon',
    organizer: 'Ethereum Foundation',
    startDate: '2025-02-01',
    endDate: '2025-02-03',
    mode: 'hybrid',
    prize: '$25,000',
    skillsRequired: ['Solidity', 'React', 'Web3.js'],
    difficulty: 'advanced',
    registrationLink: '#',
    description: 'Create the next generation of decentralized finance applications.',
  },
];

const sampleInternships: Internship[] = [
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
  {
    id: '2',
    title: 'Full Stack Developer Intern',
    company: 'Google',
    location: 'Mountain View, CA',
    type: 'onsite',
    duration: '6 months',
    stipend: '$4,500/month',
    skillsRequired: ['React', 'Node.js', 'MongoDB'],
    applyLink: '#',
    deadline: '2025-02-10',
  },
];

const sampleInterviewTopics: InterviewTopic[] = [
  { id: '1', title: 'Arrays & Strings', category: 'Data Structures', difficulty: 'easy', questionsCount: 15, completedCount: 0, icon: '📊' },
  { id: '2', title: 'Trees & Graphs', category: 'Data Structures', difficulty: 'medium', questionsCount: 20, completedCount: 0, icon: '🌳' },
  { id: '3', title: 'Dynamic Programming', category: 'Algorithms', difficulty: 'hard', questionsCount: 25, completedCount: 0, icon: '⚙️' },
  { id: '4', title: 'System Design', category: 'System Design', difficulty: 'hard', questionsCount: 10, completedCount: 0, icon: '🏗️' },
];

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile>({
    _id: '',
    name: '',
    email: '',
    userType: 'fresher',
    streak: 0,
    completedCourses: 0,
    totalPoints: 0,
    skills: [],
  });

  const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'hackathons' | 'internships' | 'interview'>('overview');
  const [editForm, setEditForm] = useState({
    name: '',
    location: '',
    bio: '',
    skills: '',
    github: '',
    linkedin: '',
    website: '',
  });

  const [matchingHackathons] = useState<Hackathon[]>(sampleHackathons);
  const [matchingInternships] = useState<Internship[]>(sampleInternships);
  const [interviewTopics] = useState<InterviewTopic[]>(sampleInterviewTopics);

  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    setProfile(prev => ({
      ...prev,
      _id: user.id || '',
      name: user.name || '',
      email: user.email || '',
      userType: user.userType || 'fresher',
    }));

    setEditForm({
      name: user.name || '',
      location: user.location || '',
      bio: user.bio || '',
      skills: user.skills?.join(', ') || '',
      github: user.github || '',
      linkedin: user.linkedin || '',
      website: user.website || '',
    });
  }, [user, router]);

  const handleSaveProfile = async () => {
    try {
      const response = await fetch(`${API_URL}/users/${profile._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editForm.name,
          location: editForm.location,
          bio: editForm.bio,
          skills: editForm.skills.split(',').map(s => s.trim()),
          github: editForm.github,
          linkedin: editForm.linkedin,
          website: editForm.website,
        }),
      });

      if (!response.ok) throw new Error('Failed to update profile');
      const updated = await response.json();
      setProfile(updated);
      setEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
      console.error(error);
    }
  };

  return (
    <Layout showSidebar>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="bg-gradient-to-r from-violet-600 to-purple-600 pt-20 pb-32">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
              <div className="relative">
                <div className="w-32 h-32 rounded-2xl bg-white/20 backdrop-blur-sm border-4 border-white/30 overflow-hidden flex items-center justify-center">
                  {profile.profileImage || profile.avatar ? (
                    <img src={profile.profileImage || profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-5xl font-bold text-white">{(profile.name || profile.email).charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <button className="absolute bottom-0 right-0 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors">
                  📷
                </button>
              </div>

              <div className="flex-1 text-white">
                <h1 className="text-3xl font-bold mb-2">{profile.name || 'Add Your Name'}</h1>
                <p className="text-white/80 mb-3">{profile.email}</p>
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
                <Link href="/settings" className="px-4 py-2 bg-white/20 text-white rounded-lg font-medium hover:bg-white/30 transition-colors">
                  ⚙️ Settings
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 -mt-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Courses Completed', value: profile.completedCourses || 0, icon: '📚' },
              { label: 'Total Points', value: profile.totalPoints || 0, icon: '⭐' },
              { label: 'Skills', value: profile.skills?.length || 0, icon: '🎯' },
              { label: 'Certificates', value: 0, icon: '🏆' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="text-2xl mb-2">{stat.icon}</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>

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
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location</label>
                          <input type="text" value={editForm.location} onChange={(e) => setEditForm({ ...editForm, location: e.target.value })} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 focus:ring-2 focus:ring-violet-500" />
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
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">GitHub</label>
                          <input type="url" value={editForm.github} onChange={(e) => setEditForm({ ...editForm, github: e.target.value })} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 focus:ring-2 focus:ring-violet-500" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">LinkedIn</label>
                          <input type="url" value={editForm.linkedin} onChange={(e) => setEditForm({ ...editForm, linkedin: e.target.value })} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 focus:ring-2 focus:ring-violet-500" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Website</label>
                          <input type="url" value={editForm.website} onChange={(e) => setEditForm({ ...editForm, website: e.target.value })} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 focus:ring-2 focus:ring-violet-500" />
                        </div>
                      </div>
                      <button onClick={handleSaveProfile} className="px-6 py-2 bg-violet-600 text-white rounded-lg font-medium hover:bg-violet-700 transition-colors">
                        Save Changes
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">About</h3>
                        <p className="text-gray-600 dark:text-gray-400">{profile.bio || 'No bio added yet.'}</p>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Skills</h3>
                        {profile.skills?.length ? (
                          <div className="flex flex-wrap gap-2">
                            {profile.skills.map((skill, i) => (
                              <span key={i} className="px-3 py-1.5 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 rounded-full text-sm font-medium">
                                {skill}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500">No skills added yet</p>
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Links</h3>
                        <div className="flex gap-4">
                          {profile.github && (
                            <a href={profile.github} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900">
                              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                              </svg>
                            </a>
                          )}
                          {profile.linkedin && (
                            <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600">
                              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                              </svg>
                            </a>
                          )}
                          {profile.website && (
                            <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-violet-600">
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path d="M12 21a9 9 0 100-18 9 9 0 000 18z" />
                                <path d="M3.6 9h16.8M3.6 15h16.8M12 3a15 15 0 014 9 15 15 0 01-4 9 15 15 0 01-4-9 15 15 0 014-9z" />
                              </svg>
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'hackathons' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recommended Hackathons</h3>
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
                              {h.skillsRequired.map((s, i) => (
                                <span key={i} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded text-xs">
                                  {s}
                                </span>
                              ))}
                            </div>
                          </div>
                          <a href={h.registrationLink} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-violet-600 text-white rounded-lg text-sm font-medium hover:bg-violet-700 whitespace-nowrap">
                            Register →
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'internships' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Online Internships</h3>
                  <div className="grid gap-4">
                    {matchingInternships.map((int) => (
                      <div key={int.id} className="border border-gray-200 dark:border-gray-700 rounded-xl p-5 hover:shadow-lg transition-shadow">
                        <div className="flex items-start gap-4">
                          <div className="w-14 h-14 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center text-2xl">
                            💼
                          </div>
                          <div className="flex-1">
                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{int.title}</h4>
                            <p className="text-violet-600 font-medium">{int.company}</p>
                            <div className="flex flex-wrap gap-4 text-sm text-gray-500 mt-2">
                              <span>📍 {int.location}</span>
                              <span>⏱️ {int.duration}</span>
                              <span>💰 {int.stipend}</span>
                            </div>
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              {int.skillsRequired.map((s, i) => (
                                <span key={i} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded text-xs">
                                  {s}
                                </span>
                              ))}
                            </div>
                          </div>
                          <a href={int.applyLink} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-violet-600 text-white rounded-lg text-sm font-medium hover:bg-violet-700 whitespace-nowrap">
                            Apply →
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

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
                  <div className="grid md:grid-cols-2 gap-4">
                    {interviewTopics.map((t) => (
                      <Link key={t.id} href={`/interview-prep/${t.id}`} className="border border-gray-200 dark:border-gray-700 rounded-xl p-5 hover:shadow-lg transition-shadow">
                        <div className="flex items-start gap-3">
                          <div className="text-2xl">{t.icon}</div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 dark:text-white">{t.title}</h4>
                            <p className="text-sm text-gray-500">{t.category}</p>
                            <p className="text-sm text-gray-500 mt-1">
                              {t.completedCount}/{t.questionsCount} completed
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}