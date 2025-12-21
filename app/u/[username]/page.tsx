'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface PublicProfile {
  _id: string;
  username: string;
  name: string;
  profileImage?: string;
  bio?: string;
  title?: string;
  location?: string;
  website?: string;
  socialLinks?: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    youtube?: string;
  };
  skills?: string[];
  experience?: {
    title: string;
    company: string;
    location: string;
    startDate: string;
    endDate?: string;
    current: boolean;
    description: string;
  }[];
  education?: {
    degree: string;
    school: string;
    field: string;
    startYear: number;
    endYear?: number;
  }[];
  projects?: {
    title: string;
    description: string;
    technologies: string[];
    link?: string;
    github?: string;
    image?: string;
  }[];
  certifications?: {
    name: string;
    issuer: string;
    date: string;
    link?: string;
  }[];
  achievements?: string[];
  completedCourses?: number;
  totalPoints?: number;
  badges?: { name: string; icon: string }[];
  isPublic: boolean;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function PublicProfilePage() {
  const params = useParams();
  const username = params.username as string;
  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'about' | 'projects' | 'experience' | 'education'>('about');

  useEffect(() => {
    fetchProfile();
  }, [username]);

  const fetchProfile = async () => {
    try {
      const response = await fetch(`${API_URL}/users/public/${username}`);
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
      } else if (response.status === 404) {
        setError('Profile not found');
      } else {
        setError('Failed to load profile');
      }
    } catch (err) {
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-6xl mb-6">👤</div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Profile Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            The profile @{username} doesn&apos;t exist or is set to private.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header Banner */}
      <div className="h-48 md:h-64 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 relative">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      {/* Profile Content */}
      <div className="max-w-5xl mx-auto px-4 -mt-24 relative z-10 pb-16">
        {/* Profile Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Profile Header */}
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-400 p-1 shadow-lg">
                  <div className="w-full h-full rounded-xl bg-white dark:bg-gray-800 overflow-hidden flex items-center justify-center">
                    {profile.profileImage ? (
                      <img
                        src={profile.profileImage}
                        alt={profile.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-5xl md:text-6xl font-bold text-emerald-600">
                        {(profile.name || profile.username).charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                      {profile.name || profile.username}
                    </h1>
                    <p className="text-emerald-600 font-medium">@{profile.username}</p>
                    {profile.title && (
                      <p className="text-lg text-gray-600 dark:text-gray-400 mt-1">{profile.title}</p>
                    )}
                    {profile.location && (
                      <p className="flex items-center gap-1 text-gray-500 dark:text-gray-400 mt-2">
                        <span>📍</span> {profile.location}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    {profile.socialLinks?.github && (
                      <a
                        href={profile.socialLinks.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                      </a>
                    )}
                    {profile.socialLinks?.linkedin && (
                      <a
                        href={profile.socialLinks.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-blue-900/30 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                      </a>
                    )}
                    {profile.socialLinks?.twitter && (
                      <a
                        href={profile.socialLinks.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-sky-100 hover:text-sky-500 dark:hover:bg-sky-900/30 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                      </a>
                    )}
                    {profile.website && (
                      <a
                        href={profile.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-emerald-100 hover:text-emerald-600 dark:hover:bg-emerald-900/30 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 21a9 9 0 100-18 9 9 0 000 18z"/><path d="M3.6 9h16.8M3.6 15h16.8M12 3a15 15 0 014 9 15 15 0 01-4 9 15 15 0 01-4-9 15 15 0 014-9z"/></svg>
                      </a>
                    )}
                    <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                      Download Resume
                    </button>
                  </div>
                </div>

                {/* Bio */}
                {profile.bio && (
                  <p className="mt-4 text-gray-600 dark:text-gray-400 leading-relaxed">
                    {profile.bio}
                  </p>
                )}

                {/* Stats */}
                <div className="flex flex-wrap gap-6 mt-6">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">📚</span>
                    <div>
                      <div className="text-xl font-bold text-gray-900 dark:text-white">{profile.completedCourses || 0}</div>
                      <div className="text-sm text-gray-500">Courses</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">⭐</span>
                    <div>
                      <div className="text-xl font-bold text-gray-900 dark:text-white">{profile.totalPoints || 0}</div>
                      <div className="text-sm text-gray-500">Points</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🏆</span>
                    <div>
                      <div className="text-xl font-bold text-gray-900 dark:text-white">{profile.badges?.length || 0}</div>
                      <div className="text-sm text-gray-500">Badges</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">📜</span>
                    <div>
                      <div className="text-xl font-bold text-gray-900 dark:text-white">{profile.certifications?.length || 0}</div>
                      <div className="text-sm text-gray-500">Certificates</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-t border-gray-200 dark:border-gray-700">
            <nav className="flex overflow-x-auto">
              {[
                { id: 'about', label: 'About', icon: '👤' },
                { id: 'projects', label: 'Projects', icon: '💼' },
                { id: 'experience', label: 'Experience', icon: '🏢' },
                { id: 'education', label: 'Education', icon: '🎓' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? 'border-emerald-600 text-emerald-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
                  }`}
                >
                  <span>{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6 md:p-8">
            {/* About Tab */}
            {activeTab === 'about' && (
              <div className="space-y-8">
                {/* Skills */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <span>🎯</span> Skills
                  </h3>
                  {profile.skills && profile.skills.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {profile.skills.map((skill, i) => (
                        <span
                          key={i}
                          className="px-4 py-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-full text-sm font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400">No skills listed</p>
                  )}
                </div>

                {/* Certifications */}
                {profile.certifications && profile.certifications.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <span>📜</span> Certifications
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {profile.certifications.map((cert, i) => (
                        <div key={i} className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl">
                          <h4 className="font-medium text-gray-900 dark:text-white">{cert.name}</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{cert.issuer}</p>
                          <p className="text-xs text-gray-400 mt-1">{cert.date}</p>
                          {cert.link && (
                            <a href={cert.link} target="_blank" rel="noopener noreferrer" className="text-sm text-emerald-600 hover:underline mt-2 inline-block">
                              View Certificate →
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Achievements */}
                {profile.achievements && profile.achievements.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <span>🏅</span> Achievements
                    </h3>
                    <ul className="space-y-2">
                      {profile.achievements.map((achievement, i) => (
                        <li key={i} className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                          <span className="text-emerald-500">✓</span>
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Projects Tab */}
            {activeTab === 'projects' && (
              <div>
                {profile.projects && profile.projects.length > 0 ? (
                  <div className="grid md:grid-cols-2 gap-6">
                    {profile.projects.map((project, i) => (
                      <div key={i} className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                        {project.image && (
                          <div className="h-40 bg-gray-100 dark:bg-gray-700">
                            <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                          </div>
                        )}
                        <div className="p-5">
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{project.title}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">{project.description}</p>
                          <div className="flex flex-wrap gap-1.5 mb-4">
                            {project.technologies.map((tech, j) => (
                              <span key={j} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded text-xs">
                                {tech}
                              </span>
                            ))}
                          </div>
                          <div className="flex gap-3">
                            {project.link && (
                              <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-sm text-emerald-600 hover:underline">
                                Live Demo →
                              </a>
                            )}
                            {project.github && (
                              <a href={project.github} target="_blank" rel="noopener noreferrer" className="text-sm text-gray-600 dark:text-gray-400 hover:underline">
                                GitHub
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <span className="text-4xl mb-4 block">💼</span>
                    <p className="text-gray-500 dark:text-gray-400">No projects to display</p>
                  </div>
                )}
              </div>
            )}

            {/* Experience Tab */}
            {activeTab === 'experience' && (
              <div>
                {profile.experience && profile.experience.length > 0 ? (
                  <div className="space-y-6">
                    {profile.experience.map((exp, i) => (
                      <div key={i} className="relative pl-8 pb-6 border-l-2 border-emerald-200 dark:border-emerald-800 last:pb-0">
                        <div className="absolute left-[-9px] top-0 w-4 h-4 bg-emerald-500 rounded-full border-4 border-white dark:border-gray-800"></div>
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{exp.title}</h4>
                          {exp.current && (
                            <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-xs rounded-full">Current</span>
                          )}
                        </div>
                        <p className="text-emerald-600 font-medium">{exp.company}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                          {exp.location} • {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                        </p>
                        <p className="text-gray-600 dark:text-gray-400">{exp.description}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <span className="text-4xl mb-4 block">🏢</span>
                    <p className="text-gray-500 dark:text-gray-400">No experience to display</p>
                  </div>
                )}
              </div>
            )}

            {/* Education Tab */}
            {activeTab === 'education' && (
              <div>
                {profile.education && profile.education.length > 0 ? (
                  <div className="space-y-6">
                    {profile.education.map((edu, i) => (
                      <div key={i} className="relative pl-8 pb-6 border-l-2 border-cyan-200 dark:border-cyan-800 last:pb-0">
                        <div className="absolute left-[-9px] top-0 w-4 h-4 bg-cyan-500 rounded-full border-4 border-white dark:border-gray-800"></div>
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{edu.degree}</h4>
                        <p className="text-cyan-600 font-medium">{edu.school}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {edu.field} • {edu.startYear} - {edu.endYear || 'Present'}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <span className="text-4xl mb-4 block">🎓</span>
                    <p className="text-gray-500 dark:text-gray-400">No education to display</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Powered by <Link href="/" className="text-emerald-600 hover:underline">SkillStenz</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
