'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import toast from 'react-hot-toast';
import Layout from '@/components/Layout';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface ResumeData {
  _id?: string;
  template: string;
  title: string;
  subtitle: string;
  fullName: string;
  profileImage: string;
  contact: {
    email: string;
    phone: string;
    location: string;
    website: string;
    linkedin: string;
    github: string;
  };
  summary: string;
  experience: {
    id: string;
    company: string;
    position: string;
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
  }[];
  education: {
    id: string;
    institution: string;
    degree: string;
    field: string;
    location: string;
    startDate: string;
    endDate: string;
    gpa?: string;
  }[];
  skills: {
    category: string;
    items: string[];
  }[];
}

const resumeTemplates = [
  { id: 'modern', name: 'Modern', preview: '📄', color: '#2563eb' },
  { id: 'classic', name: 'Classic', preview: '📃', color: '#1e293b' },
  { id: 'minimal', name: 'Minimal', preview: '📝', color: '#64748b' },
  { id: 'creative', name: 'Creative', preview: '🎨', color: '#8b5cf6' },
  { id: 'professional', name: 'Professional', preview: '💼', color: '#059669' },
  { id: 'elegant', name: 'Elegant', preview: '✨', color: '#dc2626' },
];

const defaultResume: ResumeData = {
  template: 'modern',
  title: 'Software Developer',
  subtitle: 'Building great software solutions',
  fullName: '',
  profileImage: '',
  contact: {
    email: '',
    phone: '',
    location: '',
    website: '',
    linkedin: '',
    github: ''
  },
  summary: '',
  experience: [],
  education: [],
  skills: []
};

export default function ResumeBuilderPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [resume, setResume] = useState<ResumeData>(defaultResume);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'contact' | 'professional' | 'education' | 'skills' | 'experience'>('contact');
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        router.push('/login?redirect=/resume-builder');
        return;
      }
      fetchResume();
    }
  }, [isAuthenticated, authLoading, router]);

  const fetchResume = useCallback(async () => {
    try {
      const token = localStorage.getItem('accessToken');
      
      const profileResponse = await fetch(`${API_URL}/users/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      let userData = null;
      if (profileResponse.ok) {
        userData = await profileResponse.json();
      }

      const response = await fetch(`${API_URL}/resume`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setResume({
          ...defaultResume,
          ...data,
          fullName: data.fullName || userData?.name || '',
          profileImage: data.profileImage || userData?.profileImage || userData?.avatar || '',
          contact: {
            email: data.contact?.email || userData?.email || '',
            phone: data.contact?.phone || userData?.phone || '',
            location: data.contact?.location || userData?.location || '',
            website: data.contact?.website || userData?.website || '',
            linkedin: data.contact?.linkedin || userData?.socialLinks?.linkedin || '',
            github: data.contact?.github || userData?.socialLinks?.github || ''
          }
        });
      } else if (response.status === 404) {
        setResume({
          ...defaultResume,
          fullName: userData?.name || '',
          profileImage: userData?.profileImage || userData?.avatar || '',
          contact: {
            email: userData?.email || '',
            phone: userData?.phone || '',
            location: userData?.location || '',
            website: userData?.website || '',
            linkedin: userData?.socialLinks?.linkedin || '',
            github: userData?.socialLinks?.github || ''
          },
          skills: userData?.skills?.length ? [{ category: 'Technical', items: userData.skills }] : []
        });
      }
    } catch (error) {
      console.error('Failed to fetch resume:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }

    setUploadingImage(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${API_URL}/users/profile/image`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        setResume({ ...resume, profileImage: data.imageUrl || data.profileImage });
        toast.success('Image uploaded');
      } else {
        toast.error('Failed to upload image');
      }
    } catch {
      toast.error('Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('accessToken');
      const method = resume._id ? 'PUT' : 'POST';
      const response = await fetch(`${API_URL}/resume`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(resume)
      });

      if (response.ok) {
        const data = await response.json();
        setResume(data);
        toast.success('Resume saved successfully');
      } else {
        toast.error('Failed to save resume');
      }
    } catch {
      toast.error('Failed to save resume');
    } finally {
      setSaving(false);
    }
  };

  const handleExport = async (format: 'pdf' | 'docx') => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${API_URL}/resume/export/${format}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${resume.fullName || 'resume'}.${format}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        toast.success(`Resume exported as ${format.toUpperCase()}`);
      } else {
        toast.error('Failed to export resume');
      }
    } catch {
      toast.error('Failed to export resume');
    }
  };

  const addExperience = () => {
    setResume({
      ...resume,
      experience: [...resume.experience, {
        id: Date.now().toString(),
        company: '',
        position: '',
        location: '',
        startDate: '',
        endDate: '',
        current: false,
        description: ''
      }]
    });
  };

  const updateExperience = (id: string, field: string, value: string | boolean) => {
    setResume({
      ...resume,
      experience: resume.experience.map(exp => 
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    });
  };

  const removeExperience = (id: string) => {
    setResume({
      ...resume,
      experience: resume.experience.filter(exp => exp.id !== id)
    });
  };

  const addEducation = () => {
    setResume({
      ...resume,
      education: [...resume.education, {
        id: Date.now().toString(),
        institution: '',
        degree: '',
        field: '',
        location: '',
        startDate: '',
        endDate: '',
        gpa: ''
      }]
    });
  };

  const updateEducation = (id: string, field: string, value: string) => {
    setResume({
      ...resume,
      education: resume.education.map(edu => 
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    });
  };

  const removeEducation = (id: string) => {
    setResume({
      ...resume,
      education: resume.education.filter(edu => edu.id !== id)
    });
  };

  const addSkillCategory = () => {
    setResume({
      ...resume,
      skills: [...resume.skills, { category: 'New Category', items: [] }]
    });
  };

  const updateSkillCategory = (index: number, category: string) => {
    const newSkills = [...resume.skills];
    newSkills[index].category = category;
    setResume({ ...resume, skills: newSkills });
  };

  const addSkillItem = (categoryIndex: number, skill: string) => {
    if (!skill.trim()) return;
    const newSkills = [...resume.skills];
    if (!newSkills[categoryIndex].items.includes(skill.trim())) {
      newSkills[categoryIndex].items.push(skill.trim());
      setResume({ ...resume, skills: newSkills });
    }
  };

  const removeSkillItem = (categoryIndex: number, skill: string) => {
    const newSkills = [...resume.skills];
    newSkills[categoryIndex].items = newSkills[categoryIndex].items.filter(s => s !== skill);
    setResume({ ...resume, skills: newSkills });
  };

  const removeSkillCategory = (index: number) => {
    setResume({
      ...resume,
      skills: resume.skills.filter((_, i) => i !== index)
    });
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  if (authLoading || loading) {
    return (
      <Layout showSidebar>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[var(--border-primary)] border-t-[var(--bg-accent)]"></div>
        </div>
      </Layout>
    );
  }

  const selectedTemplate = resumeTemplates.find(t => t.id === resume.template) || resumeTemplates[0];

  return (
    <Layout showSidebar>
      <div className="min-h-screen">
        <div className="bg-[var(--bg-card)] border-b border-[var(--border-primary)] sticky top-[64px] z-10">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-[var(--text-primary)]">Resume Builder</h1>
                <p className="text-[var(--text-secondary)]">Create and customize your professional resume</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button onClick={handleSave} disabled={saving} className="btn btn-primary">
                  {saving ? 'Saving...' : 'Save Resume'}
                </button>
                <button onClick={() => handleExport('pdf')} className="btn btn-secondary">
                  Export PDF
                </button>
                <button onClick={() => handleExport('docx')} className="btn btn-secondary">
                  Export DOCX
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 order-2 lg:order-1">
              <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-primary)] overflow-hidden sticky top-[180px]">
                <div className="p-6 text-center border-b border-[var(--border-primary)]" style={{ backgroundColor: selectedTemplate.color + '10' }}>
                  <div className="relative inline-block mb-4">
                    {resume.profileImage ? (
                      <img
                        src={resume.profileImage}
                        alt={resume.fullName}
                        className="w-24 h-24 rounded-full object-cover border-4 mx-auto"
                        style={{ borderColor: selectedTemplate.color }}
                      />
                    ) : (
                      <div 
                        className="w-24 h-24 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto"
                        style={{ backgroundColor: selectedTemplate.color }}
                      >
                        {getInitials(resume.fullName || 'JD')}
                      </div>
                    )}
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[var(--bg-accent)] text-white flex items-center justify-center text-sm hover:bg-[var(--bg-accent-hover)] transition-colors"
                      disabled={uploadingImage}
                    >
                      {uploadingImage ? '...' : '📷'}
                    </button>
                  </div>
                  <h2 className="text-xl font-bold text-[var(--text-primary)]">{resume.fullName || 'Your Name'}</h2>
                  <p className="text-[var(--text-accent)] font-medium">{resume.title || 'Professional Title'}</p>
                  <p className="text-[var(--text-secondary)] text-sm mt-1">{resume.subtitle}</p>
                </div>

                <div className="p-4 border-b border-[var(--border-primary)]">
                  <h3 className="text-sm font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3">Contact</h3>
                  <div className="space-y-2 text-sm">
                    {resume.contact.email && <p className="text-[var(--text-secondary)]">📧 {resume.contact.email}</p>}
                    {resume.contact.phone && <p className="text-[var(--text-secondary)]">📱 {resume.contact.phone}</p>}
                    {resume.contact.location && <p className="text-[var(--text-secondary)]">📍 {resume.contact.location}</p>}
                    {resume.contact.website && <p className="text-[var(--text-secondary)]">🌐 {resume.contact.website}</p>}
                  </div>
                </div>

                {resume.skills.length > 0 && (
                  <div className="p-4 border-b border-[var(--border-primary)]">
                    <h3 className="text-sm font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3">Skills</h3>
                    {resume.skills.map((skillGroup, i) => (
                      <div key={i} className="mb-3">
                        <p className="text-xs font-medium text-[var(--text-primary)] mb-1">{skillGroup.category}</p>
                        <div className="flex flex-wrap gap-1">
                          {skillGroup.items.slice(0, 5).map((skill, j) => (
                            <span key={j} className="px-2 py-0.5 bg-[var(--bg-tertiary)] text-[var(--text-secondary)] rounded text-xs">
                              {skill}
                            </span>
                          ))}
                          {skillGroup.items.length > 5 && (
                            <span className="text-xs text-[var(--text-muted)]">+{skillGroup.items.length - 5} more</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="p-4">
                  <h3 className="text-sm font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3">Choose Theme</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {resumeTemplates.map((template) => (
                      <button
                        key={template.id}
                        onClick={() => setResume({ ...resume, template: template.id })}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          resume.template === template.id
                            ? 'border-[var(--bg-accent)] bg-[var(--bg-accent)]/10'
                            : 'border-[var(--border-primary)] hover:border-[var(--border-secondary)]'
                        }`}
                      >
                        <div className="text-2xl mb-1">{template.preview}</div>
                        <div className="text-xs text-[var(--text-secondary)]">{template.name}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 order-1 lg:order-2">
              <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                {[
                  { id: 'contact', label: 'Contact Info', icon: '📧' },
                  { id: 'professional', label: 'Professional', icon: '💼' },
                  { id: 'education', label: 'Education', icon: '🎓' },
                  { id: 'skills', label: 'Skills', icon: '⚡' },
                  { id: 'experience', label: 'Experience', icon: '📋' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as typeof activeTab)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium whitespace-nowrap transition-all ${
                      activeTab === tab.id
                        ? 'bg-[var(--bg-accent)] text-white'
                        : 'bg-[var(--bg-card)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] border border-[var(--border-primary)]'
                    }`}
                  >
                    <span>{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </div>

              {activeTab === 'contact' && (
                <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-primary)] p-6">
                  <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-6">Contact Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Full Name</label>
                      <input
                        type="text"
                        value={resume.fullName}
                        onChange={(e) => setResume({ ...resume, fullName: e.target.value })}
                        className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-[var(--bg-accent)]"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Email</label>
                      <input
                        type="email"
                        value={resume.contact.email}
                        onChange={(e) => setResume({ ...resume, contact: { ...resume.contact, email: e.target.value } })}
                        className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-[var(--bg-accent)]"
                        placeholder="john@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Phone</label>
                      <input
                        type="tel"
                        value={resume.contact.phone}
                        onChange={(e) => setResume({ ...resume, contact: { ...resume.contact, phone: e.target.value } })}
                        className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-[var(--bg-accent)]"
                        placeholder="+1 234 567 8900"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Location</label>
                      <input
                        type="text"
                        value={resume.contact.location}
                        onChange={(e) => setResume({ ...resume, contact: { ...resume.contact, location: e.target.value } })}
                        className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-[var(--bg-accent)]"
                        placeholder="New York, USA"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Website</label>
                      <input
                        type="url"
                        value={resume.contact.website}
                        onChange={(e) => setResume({ ...resume, contact: { ...resume.contact, website: e.target.value } })}
                        className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-[var(--bg-accent)]"
                        placeholder="https://yourwebsite.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">LinkedIn</label>
                      <input
                        type="url"
                        value={resume.contact.linkedin}
                        onChange={(e) => setResume({ ...resume, contact: { ...resume.contact, linkedin: e.target.value } })}
                        className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-[var(--bg-accent)]"
                        placeholder="https://linkedin.com/in/username"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">GitHub</label>
                      <input
                        type="url"
                        value={resume.contact.github}
                        onChange={(e) => setResume({ ...resume, contact: { ...resume.contact, github: e.target.value } })}
                        className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-[var(--bg-accent)]"
                        placeholder="https://github.com/username"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'professional' && (
                <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-primary)] p-6">
                  <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-6">Professional Information</h2>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Professional Title</label>
                      <input
                        type="text"
                        value={resume.title}
                        onChange={(e) => setResume({ ...resume, title: e.target.value })}
                        className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-[var(--bg-accent)]"
                        placeholder="Senior Software Developer"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Subtitle / Tagline</label>
                      <input
                        type="text"
                        value={resume.subtitle}
                        onChange={(e) => setResume({ ...resume, subtitle: e.target.value })}
                        className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-[var(--bg-accent)]"
                        placeholder="Building scalable solutions with modern technologies"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Professional Summary</label>
                      <textarea
                        value={resume.summary}
                        onChange={(e) => setResume({ ...resume, summary: e.target.value })}
                        rows={6}
                        className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-[var(--bg-accent)] resize-none"
                        placeholder="Write a compelling summary about your professional background..."
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'education' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-[var(--text-primary)]">Education</h2>
                    <button onClick={addEducation} className="btn btn-primary btn-sm">+ Add Education</button>
                  </div>
                  {resume.education.length === 0 ? (
                    <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-primary)] p-12 text-center">
                      <div className="text-4xl mb-4">🎓</div>
                      <h3 className="text-lg font-medium text-[var(--text-primary)] mb-2">No education added</h3>
                      <p className="text-[var(--text-secondary)] mb-4">Add your educational background</p>
                      <button onClick={addEducation} className="btn btn-primary">Add Education</button>
                    </div>
                  ) : (
                    resume.education.map((edu) => (
                      <div key={edu.id} className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-primary)] p-6">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="font-medium text-[var(--text-primary)]">Education Entry</h3>
                          <button onClick={() => removeEducation(edu.id)} className="text-red-500 hover:text-red-600 text-sm">Remove</button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Institution</label>
                            <input type="text" value={edu.institution} onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)} className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-[var(--bg-accent)]" placeholder="University Name" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Degree</label>
                            <input type="text" value={edu.degree} onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)} className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-[var(--bg-accent)]" placeholder="Bachelor's Degree" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Field of Study</label>
                            <input type="text" value={edu.field} onChange={(e) => updateEducation(edu.id, 'field', e.target.value)} className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-[var(--bg-accent)]" placeholder="Computer Science" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Start Date</label>
                            <input type="month" value={edu.startDate} onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)} className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-[var(--bg-accent)]" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">End Date</label>
                            <input type="month" value={edu.endDate} onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)} className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-[var(--bg-accent)]" />
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeTab === 'skills' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-[var(--text-primary)]">Skills</h2>
                    <button onClick={addSkillCategory} className="btn btn-primary btn-sm">+ Add Category</button>
                  </div>
                  {resume.skills.length === 0 ? (
                    <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-primary)] p-12 text-center">
                      <div className="text-4xl mb-4">⚡</div>
                      <h3 className="text-lg font-medium text-[var(--text-primary)] mb-2">No skills added</h3>
                      <p className="text-[var(--text-secondary)] mb-4">Add skill categories</p>
                      <button onClick={addSkillCategory} className="btn btn-primary">Add Skill Category</button>
                    </div>
                  ) : (
                    resume.skills.map((skillGroup, index) => (
                      <div key={index} className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-primary)] p-6">
                        <div className="flex justify-between items-center mb-4">
                          <input type="text" value={skillGroup.category} onChange={(e) => updateSkillCategory(index, e.target.value)} className="text-lg font-medium bg-transparent text-[var(--text-primary)] focus:outline-none border-b border-transparent focus:border-[var(--bg-accent)]" placeholder="Category Name" />
                          <button onClick={() => removeSkillCategory(index)} className="text-red-500 hover:text-red-600 text-sm">Remove</button>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {skillGroup.items.map((skill) => (
                            <span key={skill} className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--bg-accent)]/10 text-[var(--text-accent)] rounded-full text-sm">
                              {skill}
                              <button onClick={() => removeSkillItem(index, skill)} className="hover:text-red-500">×</button>
                            </span>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <input type="text" placeholder="Add a skill..." className="flex-1 px-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-[var(--bg-accent)]" onKeyDown={(e) => { if (e.key === 'Enter') { addSkillItem(index, (e.target as HTMLInputElement).value); (e.target as HTMLInputElement).value = ''; } }} />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeTab === 'experience' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-[var(--text-primary)]">Work Experience</h2>
                    <button onClick={addExperience} className="btn btn-primary btn-sm">+ Add Experience</button>
                  </div>
                  {resume.experience.length === 0 ? (
                    <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-primary)] p-12 text-center">
                      <div className="text-4xl mb-4">💼</div>
                      <h3 className="text-lg font-medium text-[var(--text-primary)] mb-2">No experience added</h3>
                      <p className="text-[var(--text-secondary)] mb-4">Add your work experience</p>
                      <button onClick={addExperience} className="btn btn-primary">Add Experience</button>
                    </div>
                  ) : (
                    resume.experience.map((exp) => (
                      <div key={exp.id} className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-primary)] p-6">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="font-medium text-[var(--text-primary)]">Work Experience</h3>
                          <button onClick={() => removeExperience(exp.id)} className="text-red-500 hover:text-red-600 text-sm">Remove</button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Company</label>
                            <input type="text" value={exp.company} onChange={(e) => updateExperience(exp.id, 'company', e.target.value)} className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-[var(--bg-accent)]" placeholder="Company Name" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Position</label>
                            <input type="text" value={exp.position} onChange={(e) => updateExperience(exp.id, 'position', e.target.value)} className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-[var(--bg-accent)]" placeholder="Job Title" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Location</label>
                            <input type="text" value={exp.location} onChange={(e) => updateExperience(exp.id, 'location', e.target.value)} className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-[var(--bg-accent)]" placeholder="City, Country" />
                          </div>
                          <div className="flex items-center gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input type="checkbox" checked={exp.current} onChange={(e) => updateExperience(exp.id, 'current', e.target.checked)} className="w-4 h-4" />
                              <span className="text-sm text-[var(--text-secondary)]">Currently working here</span>
                            </label>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Start Date</label>
                            <input type="month" value={exp.startDate} onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)} className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-[var(--bg-accent)]" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">End Date</label>
                            <input type="month" value={exp.endDate} onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)} disabled={exp.current} className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-[var(--bg-accent)] disabled:opacity-50" />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Description</label>
                            <textarea value={exp.description} onChange={(e) => updateExperience(exp.id, 'description', e.target.value)} rows={4} className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-[var(--bg-accent)] resize-none" placeholder="Describe your responsibilities..." />
                          </div>
                        </div>
                      </div>
                    ))
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
