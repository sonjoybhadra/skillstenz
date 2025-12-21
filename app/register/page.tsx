'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../../lib/auth';
import { useSettings } from '../../lib/settings';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: 'fresher'
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const router = useRouter();
  const { login } = useAuth();
  const { settings } = useSettings();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    if (!agreedToTerms) {
      toast.error('Please agree to the Terms of Service and Privacy Policy');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          userType: formData.userType
        }),
      });

      const data = await response.json();

      if (response.ok) {
        login(data.accessToken, data.refreshToken, data.user);
        toast.success('Account created successfully! Welcome to SkillStenz!');
        router.push('/profile-setup');
      } else {
        toast.error(data.message || 'Registration failed. Please try again.');
      }
    } catch {
      toast.error('Unable to connect to server. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="auth-container">
      <style jsx>{`
        .auth-container {
          display: flex;
          min-height: 100vh;
          background: #fff;
        }
        .auth-left {
          flex: 0 0 45%;
          position: relative;
          display: none;
          background: linear-gradient(135deg, #0968c6 0%, #0756a3 100%);
          overflow: hidden;
        }
        @media (min-width: 1024px) {
          .auth-left { display: block; }
        }
        .auth-left-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, rgba(9, 104, 198, 0.3) 0%, rgba(7, 86, 163, 0.7) 100%);
        }
        .auth-left-content {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 40px;
          color: white;
        }
        .auth-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 24px;
          font-weight: 700;
        }
        .auth-logo-icon {
          width: 40px;
          height: 40px;
          background: rgba(255,255,255,0.2);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
        }
        .auth-promo {
          background: rgba(0,0,0,0.3);
          backdrop-filter: blur(10px);
          border-radius: 16px;
          padding: 24px;
        }
        .auth-promo-stat {
          font-size: 48px;
          font-weight: 800;
          margin-bottom: 4px;
        }
        .auth-promo-label {
          font-size: 16px;
          opacity: 0.9;
          margin-bottom: 12px;
        }
        .auth-promo-text {
          font-size: 14px;
          opacity: 0.8;
          line-height: 1.6;
        }
        .auth-right {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 24px;
          background: #fafbfc;
          overflow-y: auto;
        }
        .auth-form-wrapper {
          width: 100%;
          max-width: 420px;
        }
        .auth-title {
          font-size: 28px;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 8px;
        }
        .auth-subtitle {
          font-size: 15px;
          color: #64748b;
          margin-bottom: 32px;
        }
        .social-buttons {
          display: flex;
          gap: 12px;
          margin-bottom: 24px;
        }
        .social-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 12px 16px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          background: #fff;
          font-size: 14px;
          font-weight: 500;
          color: #374151;
          cursor: pointer;
          transition: all 0.2s;
        }
        .social-btn:hover {
          background: #f8fafc;
          border-color: #cbd5e1;
        }
        .divider {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 24px;
        }
        .divider-line {
          flex: 1;
          height: 1px;
          background: #e2e8f0;
        }
        .divider-text {
          font-size: 13px;
          color: #94a3b8;
        }
        .form-group {
          margin-bottom: 16px;
        }
        .form-label {
          display: block;
          font-size: 14px;
          font-weight: 500;
          color: #374151;
          margin-bottom: 8px;
        }
        .form-label span {
          color: #ef4444;
        }
        .form-input, .form-select {
          width: 100%;
          padding: 12px 16px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-size: 15px;
          color: #1e293b;
          background: #fff;
          transition: all 0.2s;
        }
        .form-input:focus, .form-select:focus {
          outline: none;
          border-color: #0968c6;
          box-shadow: 0 0 0 3px rgba(9, 104, 198, 0.1);
        }
        .form-input::placeholder {
          color: #9ca3af;
        }
        .password-wrapper {
          position: relative;
        }
        .password-toggle {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: #9ca3af;
          padding: 0;
        }
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        .checkbox-group {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          margin-bottom: 20px;
        }
        .checkbox-group input {
          width: 18px;
          height: 18px;
          margin-top: 2px;
          cursor: pointer;
        }
        .checkbox-label {
          font-size: 14px;
          color: #64748b;
          line-height: 1.5;
        }
        .checkbox-label a {
          color: #0968c6;
          text-decoration: none;
        }
        .checkbox-label a:hover {
          text-decoration: underline;
        }
        .submit-btn {
          width: 100%;
          padding: 14px;
          background: linear-gradient(135deg, #0968c6 0%, #0756a3 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .submit-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(9, 104, 198, 0.3);
        }
        .submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        .auth-footer {
          text-align: center;
          margin-top: 24px;
          font-size: 15px;
          color: #64748b;
        }
        .auth-footer a {
          color: #1e293b;
          font-weight: 600;
          text-decoration: none;
        }
        .auth-footer a:hover {
          text-decoration: underline;
        }
        .spinner {
          width: 20px;
          height: 20px;
          border: 2px solid white;
          border-top-color: transparent;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .user-type-cards {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 20px;
        }
        .user-type-card {
          padding: 16px;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s;
          text-align: center;
        }
        .user-type-card.active {
          border-color: #0968c6;
          background: rgba(9, 104, 198, 0.05);
        }
        .user-type-card:hover {
          border-color: #0968c6;
        }
        .user-type-icon {
          font-size: 28px;
          margin-bottom: 8px;
        }
        .user-type-title {
          font-size: 14px;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 4px;
        }
        .user-type-desc {
          font-size: 12px;
          color: #64748b;
        }
      `}</style>

      {/* Left Side - Image */}
      <div className="auth-left">
        <Image
          src="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&q=80"
          alt="Join Us"
          fill
          style={{ objectFit: 'cover', opacity: 0.9 }}
          priority
        />
        <div className="auth-left-overlay"></div>
        <div className="auth-left-content">
          <div className="auth-logo">
            <div className="auth-logo-icon">
              {settings.logo ? (
                <img src={settings.logo} alt={settings.siteName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                settings.logoIcon || 'T'
              )}
            </div>
            <span>
              {settings.logoText?.replace(settings.logoAccentText, '') || 'TechToo'}
              <span style={{ opacity: 1 }}>{settings.logoAccentText || 'Talk'}</span>
            </span>
          </div>
          <div className="auth-promo">
            <div className="auth-promo-stat">50+</div>
            <div className="auth-promo-label">AI & Tech Courses</div>
            <div className="auth-promo-text">
              Join thousands of learners mastering cutting-edge technologies. From AI fundamentals to advanced machine learning - we&apos;ve got you covered with expert-led courses.
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="auth-right">
        <div className="auth-form-wrapper">
          <h1 className="auth-title">Create Your Account</h1>
          <p className="auth-subtitle">Start your journey to mastering AI and modern technologies</p>

          {/* Social Signup Buttons */}
          <div className="social-buttons">
            <button type="button" className="social-btn">
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sign up with Google
            </button>
            <button type="button" className="social-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#0A66C2">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              Sign up with LinkedIn
            </button>
          </div>

          {/* Divider */}
          <div className="divider">
            <div className="divider-line"></div>
            <span className="divider-text">or sign up with email</span>
            <div className="divider-line"></div>
          </div>

          {/* Register Form */}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name<span>*</span></label>
              <input
                type="text"
                name="name"
                required
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address<span>*</span></label>
              <input
                type="email"
                name="email"
                required
                placeholder="Enter your email address"
                value={formData.email}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Password<span>*</span></label>
                <div className="password-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    required
                    placeholder="Create password"
                    value={formData.password}
                    onChange={handleChange}
                    className="form-input"
                    style={{ paddingRight: '44px' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="password-toggle"
                  >
                    {showPassword ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Confirm Password<span>*</span></label>
                <div className="password-wrapper">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    required
                    placeholder="Confirm password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="form-input"
                    style={{ paddingRight: '44px' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="password-toggle"
                  >
                    {showConfirmPassword ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* User Type Selection */}
            <div className="form-group">
              <label className="form-label">I am a<span>*</span></label>
              <div className="user-type-cards">
                <div 
                  className={`user-type-card ${formData.userType === 'fresher' ? 'active' : ''}`}
                  onClick={() => setFormData({...formData, userType: 'fresher'})}
                >
                  <div className="user-type-icon">🎓</div>
                  <div className="user-type-title">Fresher</div>
                  <div className="user-type-desc">New to the field</div>
                </div>
                <div 
                  className={`user-type-card ${formData.userType === 'experienced' ? 'active' : ''}`}
                  onClick={() => setFormData({...formData, userType: 'experienced'})}
                >
                  <div className="user-type-icon">💼</div>
                  <div className="user-type-title">Experienced</div>
                  <div className="user-type-desc">Working professional</div>
                </div>
              </div>
            </div>

            {/* Terms Checkbox */}
            <div className="checkbox-group">
              <input
                type="checkbox"
                id="terms"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
              />
              <label htmlFor="terms" className="checkbox-label">
                I agree to the <Link href="/terms">Terms of Service</Link> and <Link href="/privacy">Privacy Policy</Link>
              </label>
            </div>

            <button type="submit" disabled={loading} className="submit-btn">
              {loading ? <span className="spinner"></span> : null}
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="auth-footer">
            Already have an account? <Link href="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
