'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Layout from '@/components/Layout';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  username: string;
  title: string;
  bio: string;
  phone: string;
  location: string;
  website: string;
  profileImage: string;
  skills: string[];
  socialLinks: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    youtube?: string;
  };
  twoFactorEnabled: boolean;
}

export default function MyProfilePage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications'>('profile');
  const [uploadingImage, setUploadingImage] = useState(false);
  
  const [profile, setProfile] = useState<UserProfile>({
    _id: '',
    name: '',
    email: '',
    username: '',
    title: '',
    bio: '',
    phone: '',
    location: '',
    website: '',
    profileImage: '',
    skills: [],
    socialLinks: {},
    twoFactorEnabled: false
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);

  const [newSkill, setNewSkill] = useState('');

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        router.push('/login?redirect=/my-profile');
        return;
      }
      fetchProfile();
    }
  }, [isAuthenticated, authLoading, router]);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${API_URL}/users/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setProfile({
          _id: data._id || '',
          name: data.name || '',
          email: data.email || '',
          username: data.username || '',
          title: data.title || '',
          bio: data.bio || '',
          phone: data.phone || '',
          location: data.location || '',
          website: data.website || '',
          profileImage: data.profileImage || data.avatar || '',
          skills: data.skills || [],
          socialLinks: data.socialLinks || {},
          twoFactorEnabled: data.twoFactorEnabled || false
        });
        setTwoFactorEnabled(data.twoFactorEnabled || false);
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

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
        setProfile({ ...profile, profileImage: data.imageUrl || data.profileImage });
        toast.success('Profile image updated');
      } else {
        toast.error('Failed to upload image');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploadingImage(false);
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
        body: JSON.stringify({
          name: profile.name,
          username: profile.username,
          title: profile.title,
          bio: profile.bio,
          phone: profile.phone,
          location: profile.location,
          website: profile.website,
          skills: profile.skills,
          socialLinks: profile.socialLinks
        })
      });

      if (response.ok) {
        toast.success('Profile updated successfully');
      } else {
        const data = await response.json();
        toast.error(data.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    setSaving(true);
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${API_URL}/auth/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        })
      });

      if (response.ok) {
        toast.success('Password changed successfully');
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        const data = await response.json();
        toast.error(data.message || 'Failed to change password');
      }
    } catch (error) {
      console.error('Password change error:', error);
      toast.error('Failed to change password');
    } finally {
      setSaving(false);
    }
  };

  const handleEnable2FA = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${API_URL}/auth/2fa/setup`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setQrCodeUrl(data.qrCodeUrl || data.qrCode);
        setBackupCodes(data.backupCodes || []);
        setShowQRCode(true);
      } else {
        toast.error('Failed to setup 2FA');
      }
    } catch (error) {
      console.error('2FA setup error:', error);
      toast.error('Failed to setup 2FA');
    }
  };

  const handleVerify2FA = async () => {
    if (verificationCode.length !== 6) {
      toast.error('Please enter a 6-digit code');
      return;
    }

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${API_URL}/auth/2fa/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ code: verificationCode })
      });

      if (response.ok) {
        setTwoFactorEnabled(true);
        setShowQRCode(false);
        setVerificationCode('');
        toast.success('Two-factor authentication enabled');
      } else {
        toast.error('Invalid verification code');
      }
    } catch (error) {
      console.error('2FA verify error:', error);
      toast.error('Failed to verify code');
    }
  };

  const handleDisable2FA = async () => {
    if (!confirm('Are you sure you want to disable two-factor authentication?')) return;

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${API_URL}/auth/2fa/disable`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        setTwoFactorEnabled(false);
        toast.success('Two-factor authentication disabled');
      } else {
        toast.error('Failed to disable 2FA');
      }
    } catch (error) {
      console.error('2FA disable error:', error);
      toast.error('Failed to disable 2FA');
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

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
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

  return (
    <Layout showSidebar>
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">My Profile</h1>
          <p className="text-[var(--text-secondary)] mt-2">Manage your account settings and preferences</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-[var(--border-primary)]">
          {[
            { id: 'profile', label: 'Profile', icon: '👤' },
            { id: 'security', label: 'Security', icon: '🔒' },
            { id: 'notifications', label: 'Notifications', icon: '🔔' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-3 font-medium transition-all border-b-2 -mb-[2px] ${
                activeTab === tab.id
                  ? 'border-[var(--bg-accent)] text-[var(--text-accent)]'
                  : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="space-y-8">
            {/* Profile Image Section */}
            <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-primary)] p-6">
              <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-6">Profile Picture</h2>
              <div className="flex items-center gap-6">
                <div className="relative">
                  {profile.profileImage ? (
                    <img
                      src={profile.profileImage}
                      alt={profile.name}
                      className="w-24 h-24 rounded-full object-cover border-4 border-[var(--border-primary)]"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-[var(--bg-accent)] flex items-center justify-center text-white text-2xl font-bold border-4 border-[var(--border-primary)]">
                      {getInitials(profile.name || 'U')}
                    </div>
                  )}
                  {uploadingImage && (
                    <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent"></div>
                    </div>
                  )}
                </div>
                <div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingImage}
                    className="btn btn-secondary"
                  >
                    {uploadingImage ? 'Uploading...' : 'Change Photo'}
                  </button>
                  <p className="text-sm text-[var(--text-muted)] mt-2">JPG, PNG or GIF. Max size 5MB.</p>
                </div>
              </div>
            </div>

            {/* Basic Info */}
            <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-primary)] p-6">
              <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-6">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Full Name</label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-[var(--bg-accent)]"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Username</label>
                  <input
                    type="text"
                    value={profile.username}
                    onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                    className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-[var(--bg-accent)]"
                    placeholder="johndoe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Email</label>
                  <input
                    type="email"
                    value={profile.email}
                    disabled
                    className="w-full px-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-muted)] cursor-not-allowed"
                  />
                  <p className="text-xs text-[var(--text-muted)] mt-1">Email cannot be changed</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Professional Title</label>
                  <input
                    type="text"
                    value={profile.title}
                    onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                    className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-[var(--bg-accent)]"
                    placeholder="Full Stack Developer"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Bio</label>
                  <textarea
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-[var(--bg-accent)] resize-none"
                    placeholder="Tell us about yourself..."
                  />
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-primary)] p-6">
              <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-6">Contact Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Phone</label>
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-[var(--bg-accent)]"
                    placeholder="+1 234 567 8900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Location</label>
                  <input
                    type="text"
                    value={profile.location}
                    onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                    className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-[var(--bg-accent)]"
                    placeholder="New York, USA"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Website</label>
                  <input
                    type="url"
                    value={profile.website}
                    onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                    className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-[var(--bg-accent)]"
                    placeholder="https://yourwebsite.com"
                  />
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-primary)] p-6">
              <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-6">Social Links</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">GitHub</label>
                  <input
                    type="url"
                    value={profile.socialLinks.github || ''}
                    onChange={(e) => setProfile({ ...profile, socialLinks: { ...profile.socialLinks, github: e.target.value } })}
                    className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-[var(--bg-accent)]"
                    placeholder="https://github.com/username"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">LinkedIn</label>
                  <input
                    type="url"
                    value={profile.socialLinks.linkedin || ''}
                    onChange={(e) => setProfile({ ...profile, socialLinks: { ...profile.socialLinks, linkedin: e.target.value } })}
                    className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-[var(--bg-accent)]"
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Twitter</label>
                  <input
                    type="url"
                    value={profile.socialLinks.twitter || ''}
                    onChange={(e) => setProfile({ ...profile, socialLinks: { ...profile.socialLinks, twitter: e.target.value } })}
                    className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-[var(--bg-accent)]"
                    placeholder="https://twitter.com/username"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">YouTube</label>
                  <input
                    type="url"
                    value={profile.socialLinks.youtube || ''}
                    onChange={(e) => setProfile({ ...profile, socialLinks: { ...profile.socialLinks, youtube: e.target.value } })}
                    className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-[var(--bg-accent)]"
                    placeholder="https://youtube.com/@channel"
                  />
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-primary)] p-6">
              <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-6">Skills</h2>
              <div className="flex flex-wrap gap-2 mb-4">
                {profile.skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--bg-accent)]/10 text-[var(--text-accent)] rounded-full text-sm"
                  >
                    {skill}
                    <button
                      onClick={() => removeSkill(skill)}
                      className="hover:text-red-500"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addSkill()}
                  className="flex-1 px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-[var(--bg-accent)]"
                  placeholder="Add a skill..."
                />
                <button onClick={addSkill} className="btn btn-primary">
                  Add
                </button>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <button
                onClick={handleSaveProfile}
                disabled={saving}
                className="btn btn-primary btn-lg"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="space-y-8">
            {/* Change Password */}
            <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-primary)] p-6">
              <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-6">Change Password</h2>
              <div className="space-y-4 max-w-md">
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Current Password</label>
                  <input
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                    className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-[var(--bg-accent)]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">New Password</label>
                  <input
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-[var(--bg-accent)]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Confirm New Password</label>
                  <input
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-[var(--bg-accent)]"
                  />
                </div>
                <button
                  onClick={handleChangePassword}
                  disabled={saving || !passwordForm.currentPassword || !passwordForm.newPassword}
                  className="btn btn-primary"
                >
                  {saving ? 'Changing...' : 'Change Password'}
                </button>
              </div>
            </div>

            {/* Two-Factor Authentication */}
            <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-primary)] p-6">
              <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-2">Two-Factor Authentication</h2>
              <p className="text-[var(--text-secondary)] mb-6">Add an extra layer of security to your account</p>

              {!showQRCode ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${twoFactorEnabled ? 'bg-green-500/10 text-green-500' : 'bg-[var(--bg-tertiary)] text-[var(--text-muted)]'}`}>
                      {twoFactorEnabled ? '✓' : '🔐'}
                    </div>
                    <div>
                      <p className="font-medium text-[var(--text-primary)]">
                        {twoFactorEnabled ? 'Enabled' : 'Not Enabled'}
                      </p>
                      <p className="text-sm text-[var(--text-secondary)]">
                        {twoFactorEnabled 
                          ? 'Your account is protected with 2FA' 
                          : 'Protect your account with authenticator app'}
                      </p>
                    </div>
                  </div>
                  {twoFactorEnabled ? (
                    <button onClick={handleDisable2FA} className="btn btn-secondary text-red-500">
                      Disable 2FA
                    </button>
                  ) : (
                    <button onClick={handleEnable2FA} className="btn btn-primary">
                      Enable 2FA
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex flex-col items-center">
                    <p className="text-[var(--text-secondary)] mb-4 text-center">
                      Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)
                    </p>
                    {qrCodeUrl && (
                      <img src={qrCodeUrl} alt="2FA QR Code" className="w-48 h-48 border rounded-lg" />
                    )}
                  </div>

                  {backupCodes.length > 0 && (
                    <div className="bg-[var(--bg-tertiary)] rounded-lg p-4">
                      <p className="font-medium text-[var(--text-primary)] mb-2">Backup Codes</p>
                      <p className="text-sm text-[var(--text-secondary)] mb-3">
                        Save these codes in a secure place. You can use them to access your account if you lose your phone.
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        {backupCodes.map((code, i) => (
                          <code key={i} className="bg-[var(--bg-secondary)] px-3 py-2 rounded text-sm font-mono">
                            {code}
                          </code>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="max-w-xs mx-auto">
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2 text-center">
                      Enter 6-digit verification code
                    </label>
                    <input
                      type="text"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)] text-center text-2xl tracking-widest focus:outline-none focus:border-[var(--bg-accent)]"
                      placeholder="000000"
                      maxLength={6}
                    />
                    <div className="flex gap-2 mt-4">
                      <button onClick={() => setShowQRCode(false)} className="btn btn-secondary flex-1">
                        Cancel
                      </button>
                      <button onClick={handleVerify2FA} className="btn btn-primary flex-1">
                        Verify
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Active Sessions */}
            <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-primary)] p-6">
              <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-6">Active Sessions</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-[var(--bg-secondary)] rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-[var(--bg-accent)]/10 flex items-center justify-center text-xl">
                      💻
                    </div>
                    <div>
                      <p className="font-medium text-[var(--text-primary)]">Current Session</p>
                      <p className="text-sm text-[var(--text-secondary)]">Windows • Chrome • Active now</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-green-500/10 text-green-500 rounded-full text-sm">Current</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-primary)] p-6">
            <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-6">Notification Preferences</h2>
            <div className="space-y-6">
              {[
                { id: 'email', label: 'Email Notifications', desc: 'Receive email updates about your account' },
                { id: 'course', label: 'Course Updates', desc: 'Get notified about new lessons and courses' },
                { id: 'marketing', label: 'Marketing', desc: 'Receive tips, product updates and promotions' },
                { id: 'security', label: 'Security Alerts', desc: 'Get notified about security events' }
              ].map((item) => (
                <div key={item.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-[var(--text-primary)]">{item.label}</p>
                    <p className="text-sm text-[var(--text-secondary)]">{item.desc}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-11 h-6 bg-[var(--bg-tertiary)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--bg-accent)]"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
