'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Link from 'next/link';
import Layout from '@/components/Layout';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function UserProfilePage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'resume' | 'certificates' | 'settings'>('profile');
  const [certificates, setCertificates] = useState([]);
  
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    username: '',
    title: '',
    bio: '',
    phone: '',
    location: '',
    website: '',
    profileImage: '',
    skills: [] as string[],
    socialLinks: {
      github: '',
      linkedin: '',
      twitter: '',
      youtube: ''
    },
    isPublic: true
  });

  const [newSkill, setNewSkill] = useState('');

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        router.push('/login?redirect=/user/profile');
        return;
      }
      fetchProfile();
    }
  }, [isAuthenticated, authLoading]);

  const fetchCertificates = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${API_URL}/certificates/user/${user?._id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setCertificates(data.certificates || []);
      }
    } catch (error) {
      console.error('Failed to load certificates:', error);
    }
  };

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('accessToken');
        fetchCertificates();
      const response = await fetch(`${API_URL}/users/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setProfile({
          name: data.name || '',
          email: data.email || '',
          username: data.username || '',
          title: data.title || '',
          bio: data.bio || '',
          phone: data.phone || '',
          location: data.location || '',
          website: data.website || '',
          profileImage: data.profileImage || '',
          skills: data.skills || [],
          socialLinks: data.socialLinks || {},
          isPublic: data.isPublic !== false
        });
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${API_URL}/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profile)
      });

      if (response.ok) {
        toast.success('Profile updated successfully');
      } else {
        toast.error('Failed to update profile');
      }
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && !profile.skills.includes(newSkill.trim())) {
      setProfile({ ...profile, skills: [...profile.skills, newSkill.trim()] });
      setNewSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    setProfile({ ...profile, skills: profile.skills.filter(s => s !== skill) });
  };

  if (authLoading || loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <Link href="/dashboard" className="hover:text-emerald-600">Dashboard</Link>
            <span>/</span>
            <span>Profile</span>
          </div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">My Profile</h1>
          <p className="text-[var(--text-muted)]">Manage your profile and public resume</p>
        </div>

        {/* Profile Card */}
        <div className="card overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-violet-500 to-purple-600 p-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-xl bg-white/20 backdrop-blur-sm border-4 border-white/30 overflow-hidden flex items-center justify-center">
                  {profile.profileImage ? (
                    <img src={profile.profileImage} alt={profile.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-4xl font-bold text-white">
                      {(profile.name || profile.email).charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:bg-gray-100">
                  📷
                </button>
              </div>
              <div className="text-white flex-1">
                <h2 className="text-2xl font-bold">{profile.name || 'Your Name'}</h2>
                <p className="text-white/80">@{profile.username || 'username'}</p>
                {profile.title && <p className="text-white/90 mt-1">{profile.title}</p>}
              </div>
              {profile.username && (
                <Link
                  href={`/u/${profile.username}`}
                  target="_blank"
                  className="px-4 py-2 bg-white/20 text-white rounded-lg font-medium hover:bg-white/30 transition-colors flex items-center gap-2"
                >
                  <span>👁️</span> View Public Profile
                </Link>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-[var(--border-primary)]">
            <nav className="flex">
              {[
                { id: 'profile', label: 'Profile', icon: '👤' },
                { id: 'resume', label: 'Resume', icon: '📄' },
                                { id: 'certificates', label: 'Certificates', icon: '🏆' },
                { id: 'settings', label: 'Settings', icon: '⚙️' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-violet-600 text-violet-600'
                      : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
                  }`}
                >
                  <span>{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Full Name</label>
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      className="w-full px-4 py-2 border border-[var(--border-primary)] rounded-lg bg-[var(--bg-primary)] focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Username</label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 border border-r-0 border-[var(--border-primary)] bg-[var(--bg-secondary)] rounded-l-lg text-[var(--text-muted)]">@</span>
                      <input
                        type="text"
                        value={profile.username}
                        onChange={(e) => setProfile({ ...profile, username: e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, '') })}
                        className="flex-1 px-4 py-2 border border-[var(--border-primary)] rounded-r-lg bg-[var(--bg-primary)] focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                      />
                    </div>
                    <p className="text-xs text-[var(--text-muted)] mt-1">Your public profile: skillstenz.com/{profile.username || 'username'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Title / Role</label>
                    <input
                      type="text"
                      value={profile.title}
                      onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                      placeholder="e.g., Full Stack Developer"
                      className="w-full px-4 py-2 border border-[var(--border-primary)] rounded-lg bg-[var(--bg-primary)] focus:ring-2 focus:ring-violet-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Location</label>
                    <input
                      type="text"
                      value={profile.location}
                      onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                      placeholder="City, Country"
                      className="w-full px-4 py-2 border border-[var(--border-primary)] rounded-lg bg-[var(--bg-primary)] focus:ring-2 focus:ring-violet-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Bio</label>
                  <textarea
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    rows={3}
                    placeholder="Tell us about yourself..."
                    className="w-full px-4 py-2 border border-[var(--border-primary)] rounded-lg bg-[var(--bg-primary)] focus:ring-2 focus:ring-violet-500"
                  />
                </div>

                {/* Skills */}
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Skills</label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {profile.skills.map((skill, i) => (
                      <span key={i} className="inline-flex items-center gap-1 px-3 py-1 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 rounded-full text-sm">
                        {skill}
                        <button onClick={() => removeSkill(skill)} className="hover:text-red-500">×</button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                      placeholder="Add a skill..."
                      className="flex-1 px-4 py-2 border border-[var(--border-primary)] rounded-lg bg-[var(--bg-primary)]"
                    />
                    <button
                      onClick={addSkill}
                      className="px-4 py-2 bg-violet-600 text-white rounded-lg font-medium hover:bg-violet-700"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Social Links */}
                <div className="border-t border-[var(--border-primary)] pt-6">
                  <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Social Links</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <span className="w-10 h-10 flex items-center justify-center bg-[var(--bg-secondary)] rounded-lg">🐙</span>
                      <input
                        type="url"
                        value={profile.socialLinks.github || ''}
                        onChange={(e) => setProfile({ ...profile, socialLinks: { ...profile.socialLinks, github: e.target.value } })}
                        placeholder="GitHub URL"
                        className="flex-1 px-4 py-2 border border-[var(--border-primary)] rounded-lg bg-[var(--bg-primary)]"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-10 h-10 flex items-center justify-center bg-[var(--bg-secondary)] rounded-lg">💼</span>
                      <input
                        type="url"
                        value={profile.socialLinks.linkedin || ''}
                        onChange={(e) => setProfile({ ...profile, socialLinks: { ...profile.socialLinks, linkedin: e.target.value } })}
                        placeholder="LinkedIn URL"
                        className="flex-1 px-4 py-2 border border-[var(--border-primary)] rounded-lg bg-[var(--bg-primary)]"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-10 h-10 flex items-center justify-center bg-[var(--bg-secondary)] rounded-lg">🐦</span>
                      <input
                        type="url"
                        value={profile.socialLinks.twitter || ''}
                        onChange={(e) => setProfile({ ...profile, socialLinks: { ...profile.socialLinks, twitter: e.target.value } })}
                        placeholder="Twitter/X URL"
                        className="flex-1 px-4 py-2 border border-[var(--border-primary)] rounded-lg bg-[var(--bg-primary)]"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-10 h-10 flex items-center justify-center bg-[var(--bg-secondary)] rounded-lg">🌐</span>
                      <input
                        type="url"
                        value={profile.website || ''}
                        onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                        placeholder="Personal Website"
                        className="flex-1 px-4 py-2 border border-[var(--border-primary)] rounded-lg bg-[var(--bg-primary)]"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    onClick={handleSaveProfile}
                    disabled={saving}
                    className="px-6 py-2 bg-violet-600 text-white rounded-lg font-medium hover:bg-violet-700 disabled:opacity-50 transition-colors"
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            )}

            {/* Resume Tab */}
            {activeTab === 'resume' && (
              <div className="space-y-6">
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <h3 className="font-medium text-blue-800 dark:text-blue-200 flex items-center gap-2">
                    <span>📄</span> Build Your Resume
                  </h3>
                  <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                    Add your experience, education, and projects to create a professional resume.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <Link
                    href="/resume-builder"
                    className="p-6 border-2 border-dashed border-[var(--border-primary)] rounded-xl hover:border-violet-500 hover:bg-violet-50 dark:hover:bg-violet-900/10 transition-colors group"
                  >
                    <div className="text-3xl mb-3">💼</div>
                    <h4 className="font-semibold text-[var(--text-primary)] group-hover:text-violet-600">Experience</h4>
                    <p className="text-sm text-[var(--text-muted)]">Add your work experience</p>
                  </Link>
                  <Link
                    href="/resume-builder"
                    className="p-6 border-2 border-dashed border-[var(--border-primary)] rounded-xl hover:border-violet-500 hover:bg-violet-50 dark:hover:bg-violet-900/10 transition-colors group"
                  >
                    <div className="text-3xl mb-3">🎓</div>
                    <h4 className="font-semibold text-[var(--text-primary)] group-hover:text-violet-600">Education</h4>
                    <p className="text-sm text-[var(--text-muted)]">Add your education background</p>
                  </Link>
                  <Link
                    href="/resume-builder"
                    className="p-6 border-2 border-dashed border-[var(--border-primary)] rounded-xl hover:border-violet-500 hover:bg-violet-50 dark:hover:bg-violet-900/10 transition-colors group"
                  >
                    <div className="text-3xl mb-3">🚀</div>
                    <h4 className="font-semibold text-[var(--text-primary)] group-hover:text-violet-600">Projects</h4>
                    <p className="text-sm text-[var(--text-muted)]">Showcase your best work</p>
                  </Link>
                  <Link
                    href="/resume-builder"
                    className="p-6 border-2 border-dashed border-[var(--border-primary)] rounded-xl hover:border-violet-500 hover:bg-violet-50 dark:hover:bg-violet-900/10 transition-colors group"
                  >
                    <div className="text-3xl mb-3">🏆</div>
                    <h4 className="font-semibold text-[var(--text-primary)] group-hover:text-violet-600">Certifications</h4>
                    <p className="text-sm text-[var(--text-muted)]">Add your certifications</p>
                  </Link>
                </div>

                <div className="flex justify-center">
                  <Link
                    href="/resume-builder"
                    className="px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-lg font-medium hover:from-violet-700 hover:to-purple-700 transition-colors flex items-center gap-2"
                  >
                    <span>✨</span> Open Resume Builder
                  </Link>
                </div>
              </div>
            )}

            {/* Certificates Tab */}
            {activeTab === 'certificates' && (
              <div className="space-y-6">
                {certificates.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🏆</div>
                    <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
                      No Certificates Yet
                    </h3>
                    <p className="text-[var(--text-muted)] mb-6">
                      Complete courses and pass tests to earn certificates!
                    </p>
                    <Link
                      href="/courses"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-violet-600 text-white rounded-lg font-medium hover:bg-violet-700"
                    >
                      Browse Courses
                    </Link>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-6">
                    {certificates.map((cert: any) => (
                      <div key={cert._id} className="card hover:shadow-lg transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-2xl">🏆</span>
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                cert.certificateType === 'course' 
                                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                                  : cert.certificateType === 'test'
                                  ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                                  : 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                              }`}>
                                {cert.certificateType}
                              </span>
                            </div>
                            <h4 className="font-semibold text-[var(--text-primary)] mb-1">
                              {cert.title}
                            </h4>
                            <p className="text-sm text-[var(--text-muted)] line-clamp-2">
                              {cert.description}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 mb-4 text-sm">
                          <div className="flex items-center gap-1">
                            <span className="font-semibold text-green-600">{cert.score}%</span>
                            <span className="text-[var(--text-muted)]">Score</span>
                          </div>
                          <div className="w-px h-4 bg-[var(--border-primary)]"></div>
                          <div className="flex items-center gap-1">
                            <span className="font-semibold text-yellow-600">{cert.grade}</span>
                            <span className="text-[var(--text-muted)]">Grade</span>
                          </div>
                          <div className="w-px h-4 bg-[var(--border-primary)]"></div>
                          <span className="text-[var(--text-muted)]">
                            {new Date(cert.issueDate).toLocaleDateString()}
                          </span>
                        </div>

                        <div className="flex gap-2">
                          <Link
                            href={`/verify-certificate/${cert.certificateId}`}
                            target="_blank"
                            className="flex-1 px-4 py-2 bg-violet-600 text-white rounded-lg text-center font-medium hover:bg-violet-700"
                          >
                            View Certificate
                          </Link>
                          <button
                            onClick={() => {
                              const url = `${window.location.origin}/verify-certificate/${cert.certificateId}`;
                              navigator.clipboard.writeText(url);
                              toast.success('Link copied!');
                            }}
                            className="px-4 py-2 border border-[var(--border-primary)] rounded-lg hover:bg-[var(--bg-hover)]"
                            title="Copy link"
                          >
                            🔗
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                {/* Profile Visibility */}
                <div className="flex items-center justify-between p-4 bg-[var(--bg-secondary)] rounded-lg">
                  <div>
                    <h4 className="font-medium text-[var(--text-primary)]">Public Profile</h4>
                    <p className="text-sm text-[var(--text-muted)]">Allow others to view your profile at /u/{profile.username}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={profile.isPublic}
                      onChange={(e) => setProfile({ ...profile, isPublic: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-violet-300 dark:peer-focus:ring-violet-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-violet-600"></div>
                  </label>
                </div>

                {/* Account Links */}
                <div className="space-y-3">
                  <Link
                    href="/settings/security"
                    className="flex items-center justify-between p-4 bg-[var(--bg-secondary)] rounded-lg hover:bg-[var(--bg-hover)] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">🔒</span>
                      <div>
                        <h4 className="font-medium text-[var(--text-primary)]">Security Settings</h4>
                        <p className="text-sm text-[var(--text-muted)]">Password, 2FA, sessions</p>
                      </div>
                    </div>
                    <span className="text-[var(--text-muted)]">→</span>
                  </Link>
                  <Link
                    href="/settings/notifications"
                    className="flex items-center justify-between p-4 bg-[var(--bg-secondary)] rounded-lg hover:bg-[var(--bg-hover)] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">🔔</span>
                      <div>
                        <h4 className="font-medium text-[var(--text-primary)]">Notifications</h4>
                        <p className="text-sm text-[var(--text-muted)]">Email and push notifications</p>
                      </div>
                    </div>
                    <span className="text-[var(--text-muted)]">→</span>
                  </Link>
                  <Link
                    href="/settings/privacy"
                    className="flex items-center justify-between p-4 bg-[var(--bg-secondary)] rounded-lg hover:bg-[var(--bg-hover)] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">👁️</span>
                      <div>
                        <h4 className="font-medium text-[var(--text-primary)]">Privacy</h4>
                        <p className="text-sm text-[var(--text-muted)]">Manage your data and privacy</p>
                      </div>
                    </div>
                    <span className="text-[var(--text-muted)]">→</span>
                  </Link>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    onClick={handleSaveProfile}
                    disabled={saving}
                    className="px-6 py-2 bg-violet-600 text-white rounded-lg font-medium hover:bg-violet-700 disabled:opacity-50 transition-colors"
                  >
                    {saving ? 'Saving...' : 'Save Settings'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
