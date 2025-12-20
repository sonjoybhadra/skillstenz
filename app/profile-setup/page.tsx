'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/Layout';

export default function ProfileSetupPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    displayName: '',
    bio: '',
    interests: [] as string[],
    experience: '',
    goals: [] as string[],
    preferredLanguages: [] as string[],
  });

  const interests = ['Web Development', 'Mobile Development', 'Data Science', 'Machine Learning', 'DevOps', 'Cybersecurity', 'Game Development', 'Cloud Computing'];
  const goals = ['Get a job', 'Switch careers', 'Learn for fun', 'Build projects', 'Get certified', 'Freelance'];
  const languages = ['JavaScript', 'Python', 'Java', 'C++', 'TypeScript', 'Go', 'Rust', 'C#', 'PHP', 'Ruby'];
  const experienceLevels = ['Complete Beginner', 'Some Experience', 'Intermediate', 'Advanced', 'Expert'];

  const toggleSelection = (array: string[], item: string, field: 'interests' | 'goals' | 'preferredLanguages') => {
    if (array.includes(item)) {
      setFormData({ ...formData, [field]: array.filter(i => i !== item) });
    } else {
      setFormData({ ...formData, [field]: [...array, item] });
    }
  };

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
    else handleSubmit();
  };

  const handleSubmit = () => {
    console.log('Profile data:', formData);
    router.push('/dashboard');
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Progress */}
        <div className="flex items-center justify-between mb-8">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${
                s <= step ? 'bg-[var(--primary)] text-white' : 'bg-[var(--muted)] text-[var(--muted-foreground)]'
              }`}>
                {s < step ? '✓' : s}
              </div>
              {s < 4 && <div className={`w-16 md:w-24 h-1 ${s < step ? 'bg-[var(--primary)]' : 'bg-[var(--muted)]'}`} />}
            </div>
          ))}
        </div>

        <div className="card">
          {/* Step 1: Basic Info */}
          {step === 1 && (
            <>
              <h2 className="text-2xl font-bold text-[var(--foreground)] mb-6">Let&apos;s set up your profile</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-2">Display Name</label>
                  <input
                    type="text"
                    value={formData.displayName}
                    onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                    placeholder="How should we call you?"
                    className="w-full px-4 py-2 border border-[var(--border)] rounded-lg bg-[var(--background)] text-[var(--foreground)]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-2">Bio (optional)</label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="Tell us about yourself..."
                    rows={3}
                    className="w-full px-4 py-2 border border-[var(--border)] rounded-lg bg-[var(--background)] text-[var(--foreground)]"
                  />
                </div>
              </div>
            </>
          )}

          {/* Step 2: Interests */}
          {step === 2 && (
            <>
              <h2 className="text-2xl font-bold text-[var(--foreground)] mb-2">What are you interested in?</h2>
              <p className="text-[var(--muted-foreground)] mb-6">Select all that apply</p>
              <div className="flex flex-wrap gap-3">
                {interests.map((interest) => (
                  <button
                    key={interest}
                    onClick={() => toggleSelection(formData.interests, interest, 'interests')}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      formData.interests.includes(interest)
                        ? 'bg-[var(--primary)] text-white'
                        : 'bg-[var(--muted)] text-[var(--foreground)] hover:bg-[var(--border)]'
                    }`}
                  >
                    {interest}
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Step 3: Experience & Goals */}
          {step === 3 && (
            <>
              <h2 className="text-2xl font-bold text-[var(--foreground)] mb-6">Your experience & goals</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-3">Experience Level</label>
                  <div className="flex flex-wrap gap-2">
                    {experienceLevels.map((level) => (
                      <button
                        key={level}
                        onClick={() => setFormData({ ...formData, experience: level })}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          formData.experience === level
                            ? 'bg-[var(--primary)] text-white'
                            : 'bg-[var(--muted)] text-[var(--foreground)] hover:bg-[var(--border)]'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-3">What are your goals?</label>
                  <div className="flex flex-wrap gap-2">
                    {goals.map((goal) => (
                      <button
                        key={goal}
                        onClick={() => toggleSelection(formData.goals, goal, 'goals')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          formData.goals.includes(goal)
                            ? 'bg-[var(--primary)] text-white'
                            : 'bg-[var(--muted)] text-[var(--foreground)] hover:bg-[var(--border)]'
                        }`}
                      >
                        {goal}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Step 4: Preferred Languages */}
          {step === 4 && (
            <>
              <h2 className="text-2xl font-bold text-[var(--foreground)] mb-2">Preferred Programming Languages</h2>
              <p className="text-[var(--muted-foreground)] mb-6">Select the languages you want to learn or improve</p>
              <div className="flex flex-wrap gap-3">
                {languages.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => toggleSelection(formData.preferredLanguages, lang, 'preferredLanguages')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      formData.preferredLanguages.includes(lang)
                        ? 'bg-[var(--primary)] text-white'
                        : 'bg-[var(--muted)] text-[var(--foreground)] hover:bg-[var(--border)]'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            {step > 1 ? (
              <button onClick={() => setStep(step - 1)} className="btn-secondary">Back</button>
            ) : (
              <div />
            )}
            <button onClick={handleNext} className="btn-primary">
              {step === 4 ? 'Complete Setup' : 'Continue'}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
