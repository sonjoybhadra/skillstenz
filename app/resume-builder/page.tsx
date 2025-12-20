'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface PersonalContent {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
}

interface ResumeSection {
  type: string;
  title: string;
  content: PersonalContent | string | string[];
  order: number;
  visible: boolean;
}

interface Resume {
  _id: string;
  template: string;
  sections: ResumeSection[];
}

export default function ResumeBuilder() {
  const [resume, setResume] = useState<Resume | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const fetchResume = useCallback(async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('http://localhost:5000/api/resume', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setResume(data);
      } else if (response.status === 404) {
        // Create new resume
        await createNewResume();
      }
    } catch {
      console.error('Failed to fetch resume');
    } finally {
      setLoading(false);
    }
  }, []);

  const createNewResume = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('http://localhost:5000/api/resume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          template: 'basic',
          sections: [
            {
              type: 'personal',
              title: 'Personal Information',
              content: {},
              order: 1,
              visible: true
            },
            {
              type: 'summary',
              title: 'Professional Summary',
              content: '',
              order: 2,
              visible: true
            },
            {
              type: 'experience',
              title: 'Work Experience',
              content: [],
              order: 3,
              visible: true
            },
            {
              type: 'education',
              title: 'Education',
              content: [],
              order: 4,
              visible: true
            },
            {
              type: 'skills',
              title: 'Skills',
              content: [],
              order: 5,
              visible: true
            }
          ]
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setResume(data);
      }
    } catch {
      console.error('Failed to create resume');
    }
  };

  const handleAutoFill = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('http://localhost:5000/api/resume/autofill', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setResume(data);
      }
    } catch {
      console.error('Failed to auto-fill resume');
    }
  };

  const handleSave = async () => {
    if (!resume) return;

    setSaving(true);
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('http://localhost:5000/api/resume', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(resume),
      });

      if (response.ok) {
        alert('Resume saved successfully!');
      }
    } catch {
      console.error('Failed to save resume');
    } finally {
      setSaving(false);
    }
  };

  const handleExport = async (format: 'pdf' | 'docx') => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`http://localhost:5000/api/resume/export/${format}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `resume.${format}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch {
      console.error('Failed to export resume');
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchResume();
  }, [router, fetchResume]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <button
                onClick={() => router.push('/dashboard')}
                className="mr-4 text-gray-600 hover:text-gray-900"
              >
                ← Back to Dashboard
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Resume Builder</h1>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handleAutoFill}
                className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700"
              >
                Auto-Fill from Profile
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={() => handleExport('pdf')}
                className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700"
              >
                Export PDF
              </button>
              <button
                onClick={() => handleExport('docx')}
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
              >
                Export DOCX
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6">
          {resume ? (
            <div className="space-y-6">
              {resume.sections.map((section, index) => (
                <div key={index} className="border-b pb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">{section.title}</h3>
                  
                  {section.type === 'personal' && (
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="First Name"
                        className="border border-gray-300 rounded-md px-3 py-2"
                        value={(section.content as PersonalContent)?.firstName || ''}
                        onChange={(e) => {
                          const newSections = [...resume.sections];
                          newSections[index].content = {
                            ...(newSections[index].content as PersonalContent),
                            firstName: e.target.value
                          };
                          setResume({ ...resume, sections: newSections });
                        }}
                      />
                      <input
                        type="text"
                        placeholder="Last Name"
                        className="border border-gray-300 rounded-md px-3 py-2"
                        value={(section.content as PersonalContent)?.lastName || ''}
                        onChange={(e) => {
                          const newSections = [...resume.sections];
                          newSections[index].content = {
                            ...(newSections[index].content as PersonalContent),
                            lastName: e.target.value
                          };
                          setResume({ ...resume, sections: newSections });
                        }}
                      />
                      <input
                        type="email"
                        placeholder="Email"
                        className="border border-gray-300 rounded-md px-3 py-2"
                        value={(section.content as PersonalContent)?.email || ''}
                        onChange={(e) => {
                          const newSections = [...resume.sections];
                          newSections[index].content = {
                            ...(newSections[index].content as PersonalContent),
                            email: e.target.value
                          };
                          setResume({ ...resume, sections: newSections });
                        }}
                      />
                      <input
                        type="text"
                        placeholder="Phone"
                        className="border border-gray-300 rounded-md px-3 py-2"
                        value={(section.content as PersonalContent)?.phone || ''}
                        onChange={(e) => {
                          const newSections = [...resume.sections];
                          newSections[index].content = {
                            ...(newSections[index].content as PersonalContent),
                            phone: e.target.value
                          };
                          setResume({ ...resume, sections: newSections });
                        }}
                      />
                    </div>
                  )}

                  {section.type === 'summary' && (
                    <textarea
                      placeholder="Write your professional summary..."
                      className="w-full border border-gray-300 rounded-md px-3 py-2 h-24"
                      value={(section.content as string) || ''}
                      onChange={(e) => {
                        const newSections = [...resume.sections];
                        newSections[index].content = e.target.value;
                        setResume({ ...resume, sections: newSections });
                      }}
                    />
                  )}

                  {section.type === 'skills' && (
                    <input
                      type="text"
                      placeholder="Enter skills separated by commas"
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      value={Array.isArray(section.content) ? (section.content as string[]).join(', ') : ''}
                      onChange={(e) => {
                        const newSections = [...resume.sections];
                        newSections[index].content = e.target.value.split(',').map(s => s.trim());
                        setResume({ ...resume, sections: newSections });
                      }}
                    />
                  )}

                  {/* Add more section types as needed */}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">Loading resume...</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}