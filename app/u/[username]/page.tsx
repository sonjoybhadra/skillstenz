'use client';

import { useParams, useSearchParams } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface PublicProfile {
  _id: string;
  username: string;
  name: string;
  profileImage?: string;
  bio?: string;
  title?: string;
  location?: string;
  phone?: string;
  website?: string;
  interests?: string[];
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
  resumeTemplate?: string;
}

type TemplateType = 'modern' | 'classic' | 'minimal' | 'creative' | 'professional' | 'elegant';

interface TemplateColors {
  primary: string;
  gradient: string;
  bgLight: string;
  bgDark: string;
  textLight: string;
  textDark: string;
  border: string;
  borderDark: string;
  dot: string;
  avatarText: string;
  headerBg: string;
  sectionTitle: string;
}

const templateColorClasses: Record<TemplateType, TemplateColors> = {
  modern: {
    primary: 'text-emerald-600',
    gradient: 'from-emerald-600 via-teal-600 to-cyan-600',
    bgLight: 'bg-emerald-100',
    bgDark: 'dark:bg-emerald-900/30',
    textLight: 'text-emerald-700',
    textDark: 'dark:text-emerald-300',
    border: 'border-emerald-600',
    borderDark: 'border-emerald-200 dark:border-emerald-800',
    dot: 'bg-emerald-500',
    avatarText: 'text-emerald-600',
    headerBg: 'bg-emerald-600',
    sectionTitle: 'border-emerald-500',
  },
  classic: {
    primary: 'text-blue-600',
    gradient: 'from-blue-600 via-blue-700 to-indigo-700',
    bgLight: 'bg-blue-100',
    bgDark: 'dark:bg-blue-900/30',
    textLight: 'text-blue-700',
    textDark: 'dark:text-blue-300',
    border: 'border-blue-600',
    borderDark: 'border-blue-200 dark:border-blue-800',
    dot: 'bg-blue-500',
    avatarText: 'text-blue-600',
    headerBg: 'bg-blue-600',
    sectionTitle: 'border-blue-500',
  },
  minimal: {
    primary: 'text-gray-700 dark:text-gray-300',
    gradient: 'from-gray-700 via-gray-800 to-gray-900',
    bgLight: 'bg-gray-200',
    bgDark: 'dark:bg-gray-700/30',
    textLight: 'text-gray-700',
    textDark: 'dark:text-gray-300',
    border: 'border-gray-700',
    borderDark: 'border-gray-300 dark:border-gray-700',
    dot: 'bg-gray-600',
    avatarText: 'text-gray-700',
    headerBg: 'bg-gray-800',
    sectionTitle: 'border-gray-500',
  },
  creative: {
    primary: 'text-purple-600',
    gradient: 'from-purple-600 via-pink-600 to-rose-500',
    bgLight: 'bg-purple-100',
    bgDark: 'dark:bg-purple-900/30',
    textLight: 'text-purple-700',
    textDark: 'dark:text-purple-300',
    border: 'border-purple-600',
    borderDark: 'border-purple-200 dark:border-purple-800',
    dot: 'bg-purple-500',
    avatarText: 'text-purple-600',
    headerBg: 'bg-purple-600',
    sectionTitle: 'border-purple-500',
  },
  professional: {
    primary: 'text-slate-700 dark:text-slate-300',
    gradient: 'from-slate-700 via-slate-800 to-slate-900',
    bgLight: 'bg-slate-100',
    bgDark: 'dark:bg-slate-800/30',
    textLight: 'text-slate-700',
    textDark: 'dark:text-slate-300',
    border: 'border-slate-600',
    borderDark: 'border-slate-200 dark:border-slate-700',
    dot: 'bg-slate-600',
    avatarText: 'text-slate-700',
    headerBg: 'bg-slate-700',
    sectionTitle: 'border-slate-500',
  },
  elegant: {
    primary: 'text-rose-600',
    gradient: 'from-rose-600 via-rose-700 to-rose-800',
    bgLight: 'bg-rose-100',
    bgDark: 'dark:bg-rose-900/30',
    textLight: 'text-rose-700',
    textDark: 'dark:text-rose-300',
    border: 'border-rose-600',
    borderDark: 'border-rose-200 dark:border-rose-800',
    dot: 'bg-rose-500',
    avatarText: 'text-rose-600',
    headerBg: 'bg-rose-600',
    sectionTitle: 'border-rose-500',
  },
};

const templates: { id: TemplateType; name: string; preview: string }[] = [
  { id: 'modern', name: 'Modern', preview: '🌿' },
  { id: 'classic', name: 'Classic', preview: '📘' },
  { id: 'minimal', name: 'Minimal', preview: '⚪' },
  { id: 'creative', name: 'Creative', preview: '🎨' },
  { id: 'professional', name: 'Professional', preview: '💼' },
  { id: 'elegant', name: 'Elegant', preview: '✨' },
];

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function PublicProfilePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const username = params.username as string;
  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const resumeRef = useRef<HTMLDivElement>(null);
  
  const templateFromUrl = searchParams.get('template') as TemplateType;
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>(templateFromUrl || 'modern');

  useEffect(() => {
    fetchProfile();
  }, [username]);

  useEffect(() => {
    if (profile?.resumeTemplate && !templateFromUrl) {
      setSelectedTemplate(profile.resumeTemplate as TemplateType);
    }
  }, [profile, templateFromUrl]);

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
    } catch {
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const colors = templateColorClasses[selectedTemplate];

  const profileImageUrl = profile?.profileImage 
    ? (profile.profileImage.startsWith('http') ? profile.profileImage : `${API_URL.replace('/api', '')}${profile.profileImage}`)
    : null;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading resume...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-6xl mb-6">👤</div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Profile Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            The profile @{username} doesn&apos;t exist or is set to private.
          </p>
          <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-200 dark:bg-gray-900 print:bg-white">
      {/* Controls - Hidden on Print */}
      <div className="fixed top-4 right-4 z-50 flex gap-2 print:hidden">
        <button
          onClick={handlePrint}
          className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-2 text-gray-700 dark:text-gray-300"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Print / PDF
        </button>
        <button
          onClick={() => setShowTemplateSelector(!showTemplateSelector)}
          className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-2 text-gray-700 dark:text-gray-300"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
          </svg>
          Templates
        </button>
      </div>

      {/* Template Selector */}
      {showTemplateSelector && (
        <div className="fixed top-16 right-4 z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl p-4 w-64 print:hidden">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Choose Template</h3>
          <div className="space-y-2">
            {templates.map((template) => (
              <button
                key={template.id}
                onClick={() => {
                  setSelectedTemplate(template.id);
                  setShowTemplateSelector(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  selectedTemplate === template.id
                    ? 'bg-gray-100 dark:bg-gray-700'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${templateColorClasses[template.id].gradient}`}></div>
                <span className="text-gray-700 dark:text-gray-300">{template.name}</span>
                {selectedTemplate === template.id && (
                  <svg className="w-5 h-5 ml-auto text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Resume Document */}
      <div className="max-w-4xl mx-auto py-8 px-4 print:py-0 print:px-0 print:max-w-none">
        <div 
          ref={resumeRef}
          className="bg-white dark:bg-gray-800 shadow-2xl print:shadow-none rounded-lg print:rounded-none overflow-hidden"
        >
          {/* Header Section */}
          <div className={`bg-gradient-to-r ${colors.gradient} p-8 md:p-12 print:p-10`}>
            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
              {/* Profile Photo */}
              <div className="flex-shrink-0">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-white/20 backdrop-blur-sm border-4 border-white/40 overflow-hidden flex items-center justify-center">
                  {profileImageUrl ? (
                    <img src={profileImageUrl} alt={profile.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-5xl md:text-6xl font-bold text-white">
                      {(profile.name || profile.username).charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
              </div>

              {/* Name & Contact */}
              <div className="flex-1 text-center md:text-left text-white">
                <h1 className="text-3xl md:text-4xl font-bold mb-2">{profile.name || profile.username}</h1>
                {profile.title && (
                  <p className="text-xl md:text-2xl text-white/90 font-medium mb-4">{profile.title}</p>
                )}
                
                {/* Contact Grid */}
                <div className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2 text-sm text-white/90">
                  {profile.location && (
                    <div className="flex items-center gap-1.5">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {profile.location}
                    </div>
                  )}
                  {profile.phone && (
                    <div className="flex items-center gap-1.5">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      {profile.phone}
                    </div>
                  )}
                  {profile.website && (
                    <a href={profile.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-white">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                      </svg>
                      Portfolio
                    </a>
                  )}
                  {profile.socialLinks?.linkedin && (
                    <a href={profile.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-white">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                      LinkedIn
                    </a>
                  )}
                  {profile.socialLinks?.github && (
                    <a href={profile.socialLinks.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-white">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                      GitHub
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 md:p-12 print:p-10 space-y-8">
            {/* Professional Summary */}
            {profile.bio && (
              <section>
                <h2 className={`text-lg font-bold text-gray-900 dark:text-white uppercase tracking-wide mb-4 pb-2 border-b-2 ${colors.sectionTitle}`}>
                  Professional Summary
                </h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{profile.bio}</p>
              </section>
            )}

            {/* Two Column Layout for Skills & Experience */}
            <div className="grid md:grid-cols-3 gap-8">
              {/* Left Column - Skills & Education */}
              <div className="space-y-8">
                {/* Skills */}
                {profile.skills && profile.skills.length > 0 && (
                  <section>
                    <h2 className={`text-lg font-bold text-gray-900 dark:text-white uppercase tracking-wide mb-4 pb-2 border-b-2 ${colors.sectionTitle}`}>
                      Skills
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {profile.skills.map((skill, i) => (
                        <span
                          key={i}
                          className={`px-3 py-1.5 ${colors.bgLight} ${colors.bgDark} ${colors.textLight} ${colors.textDark} rounded-md text-sm font-medium`}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </section>
                )}

                {/* Education */}
                {profile.education && profile.education.length > 0 && (
                  <section>
                    <h2 className={`text-lg font-bold text-gray-900 dark:text-white uppercase tracking-wide mb-4 pb-2 border-b-2 ${colors.sectionTitle}`}>
                      Education
                    </h2>
                    <div className="space-y-4">
                      {profile.education.map((edu, i) => (
                        <div key={i}>
                          <h3 className="font-semibold text-gray-900 dark:text-white">{edu.degree}</h3>
                          <p className={`${colors.primary} font-medium text-sm`}>{edu.school}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{edu.field}</p>
                          <p className="text-xs text-gray-400">{edu.startYear} - {edu.endYear || 'Present'}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Certifications */}
                {profile.certifications && profile.certifications.length > 0 && (
                  <section>
                    <h2 className={`text-lg font-bold text-gray-900 dark:text-white uppercase tracking-wide mb-4 pb-2 border-b-2 ${colors.sectionTitle}`}>
                      Certifications
                    </h2>
                    <div className="space-y-3">
                      {profile.certifications.map((cert, i) => (
                        <div key={i}>
                          <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{cert.name}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{cert.issuer}</p>
                          <p className="text-xs text-gray-400">{cert.date}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Interests */}
                {profile.interests && profile.interests.length > 0 && (
                  <section>
                    <h2 className={`text-lg font-bold text-gray-900 dark:text-white uppercase tracking-wide mb-4 pb-2 border-b-2 ${colors.sectionTitle}`}>
                      Interests
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {profile.interests.map((interest, i) => (
                        <span key={i} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded text-sm">
                          {interest}
                        </span>
                      ))}
                    </div>
                  </section>
                )}
              </div>

              {/* Right Column - Experience & Projects */}
              <div className="md:col-span-2 space-y-8">
                {/* Work Experience */}
                {profile.experience && profile.experience.length > 0 && (
                  <section>
                    <h2 className={`text-lg font-bold text-gray-900 dark:text-white uppercase tracking-wide mb-4 pb-2 border-b-2 ${colors.sectionTitle}`}>
                      Work Experience
                    </h2>
                    <div className="space-y-6">
                      {profile.experience.map((exp, i) => (
                        <div key={i} className="relative pl-4 border-l-2 border-gray-200 dark:border-gray-700">
                          <div className={`absolute -left-[5px] top-1 w-2 h-2 ${colors.dot} rounded-full`}></div>
                          <div className="flex flex-wrap items-baseline gap-2 mb-1">
                            <h3 className="font-bold text-gray-900 dark:text-white">{exp.title}</h3>
                            {exp.current && (
                              <span className={`px-2 py-0.5 ${colors.bgLight} ${colors.bgDark} ${colors.textLight} ${colors.textDark} text-xs rounded-full`}>Current</span>
                            )}
                          </div>
                          <p className={`${colors.primary} font-medium`}>{exp.company}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                            {exp.location} | {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                          </p>
                          <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{exp.description}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Projects */}
                {profile.projects && profile.projects.length > 0 && (
                  <section>
                    <h2 className={`text-lg font-bold text-gray-900 dark:text-white uppercase tracking-wide mb-4 pb-2 border-b-2 ${colors.sectionTitle}`}>
                      Projects
                    </h2>
                    <div className="space-y-5">
                      {profile.projects.map((project, i) => (
                        <div key={i} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                          <div className="flex justify-between items-start gap-2 mb-2">
                            <h3 className="font-bold text-gray-900 dark:text-white">{project.title}</h3>
                            <div className="flex gap-2">
                              {project.link && (
                                <a href={project.link} target="_blank" rel="noopener noreferrer" className={`text-xs ${colors.primary} hover:underline`}>
                                  Live Demo
                                </a>
                              )}
                              {project.github && (
                                <a href={project.github} target="_blank" rel="noopener noreferrer" className="text-xs text-gray-500 hover:underline">
                                  GitHub
                                </a>
                              )}
                            </div>
                          </div>
                          <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">{project.description}</p>
                          <div className="flex flex-wrap gap-1.5">
                            {project.technologies.map((tech, j) => (
                              <span key={j} className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded text-xs">
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Achievements */}
                {profile.achievements && profile.achievements.length > 0 && (
                  <section>
                    <h2 className={`text-lg font-bold text-gray-900 dark:text-white uppercase tracking-wide mb-4 pb-2 border-b-2 ${colors.sectionTitle}`}>
                      Achievements
                    </h2>
                    <ul className="space-y-2">
                      {profile.achievements.map((achievement, i) => (
                        <li key={i} className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                          <span className={colors.primary}>✓</span>
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  </section>
                )}
              </div>
            </div>

            {/* Platform Stats - Only for Online View */}
            <section className="print:hidden pt-6 border-t border-gray-200 dark:border-gray-700">
              <h2 className={`text-lg font-bold text-gray-900 dark:text-white uppercase tracking-wide mb-4 pb-2 border-b-2 ${colors.sectionTitle}`}>
                Learning Stats
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <div className="text-2xl mb-1">📚</div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{profile.completedCourses || 0}</div>
                  <div className="text-sm text-gray-500">Courses</div>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <div className="text-2xl mb-1">⭐</div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{profile.totalPoints || 0}</div>
                  <div className="text-sm text-gray-500">Points</div>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <div className="text-2xl mb-1">🏆</div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{profile.badges?.length || 0}</div>
                  <div className="text-sm text-gray-500">Badges</div>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <div className="text-2xl mb-1">📜</div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{profile.certifications?.length || 0}</div>
                  <div className="text-sm text-gray-500">Certificates</div>
                </div>
              </div>
            </section>
          </div>

          {/* Footer */}
          <div className="px-8 py-4 bg-gray-50 dark:bg-gray-900 text-center print:hidden">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Powered by <Link href="/" className={`${colors.primary} hover:underline`}>TechTooTalk</Link>
            </p>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4;
            margin: 0;
          }
          body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .dark {
            --tw-bg-opacity: 1;
            background-color: white !important;
          }
          .dark\\:bg-gray-800 {
            background-color: white !important;
          }
          .dark\\:bg-gray-900 {
            background-color: white !important;
          }
          .dark\\:text-white {
            color: black !important;
          }
          .dark\\:text-gray-300, .dark\\:text-gray-400 {
            color: #4b5563 !important;
          }
        }
      `}</style>
    </div>
  );
}
