'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../../lib/auth';
import { useSettings } from '../../lib/settings';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginMethod, setLoginMethod] = useState<'password' | 'otp'>('password');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const { settings } = useSettings();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        login(data.accessToken, data.refreshToken, data.user);
        toast.success(`Welcome back, ${data.user.name || data.user.email}!`);
        
        const redirect = searchParams.get('redirect');
        if (redirect) {
          router.push(redirect);
        } else if (data.user.role === 'admin') {
          router.push('/admin');
        } else {
          router.push('/dashboard');
        }
      } else {
        toast.error(data.message || 'Login failed. Please check your credentials.');
      }
    } catch {
      toast.error('Unable to connect to server. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async () => {
    if (!formData.email) {
      toast.error('Please enter your email address');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email }),
      });
      if (response.ok) {
        setOtpSent(true);
        toast.success('OTP sent to your email!');
      } else {
        const data = await response.json();
        toast.error(data.message || 'Failed to send OTP');
      }
    } catch {
      toast.error('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, otp }),
      });
      const data = await response.json();
      if (response.ok) {
        login(data.accessToken, data.refreshToken, data.user);
        toast.success('Login successful!');
        router.push('/dashboard');
      } else {
        toast.error(data.message || 'Invalid OTP');
      }
    } catch {
      toast.error('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
          margin-bottom: 20px;
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
        .form-input {
          width: 100%;
          padding: 12px 16px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-size: 15px;
          color: #1e293b;
          background: #fff;
          transition: all 0.2s;
        }
        .form-input:focus {
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
        .forgot-link {
          display: block;
          text-align: right;
          font-size: 14px;
          color: #0968c6;
          font-weight: 500;
          margin-top: 8px;
          text-decoration: none;
        }
        .forgot-link:hover {
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
        .otp-link {
          display: block;
          text-align: center;
          margin-top: 16px;
          font-size: 14px;
          color: #0968c6;
          font-weight: 500;
          cursor: pointer;
          background: none;
          border: none;
        }
        .otp-link:hover {
          text-decoration: underline;
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
        .demo-box {
          margin-top: 24px;
          padding: 16px;
          background: rgba(9, 104, 198, 0.05);
          border: 1px solid rgba(9, 104, 198, 0.1);
          border-radius: 8px;
        }
        .demo-title {
          font-size: 13px;
          font-weight: 600;
          color: #0968c6;
          margin-bottom: 8px;
        }
        .demo-text {
          font-size: 13px;
          color: #64748b;
          line-height: 1.6;
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
      `}</style>

      {/* Left Side - Image */}
      <div className="auth-left">
        <Image
          src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80"
          alt="Learning"
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
            <div className="auth-promo-stat">10K+</div>
            <div className="auth-promo-label">Active Learners</div>
            <div className="auth-promo-text">
              {settings.siteName || 'TechTooTalk'} accelerates your learning 3X faster with smart AI-powered courses that connect you with the right content instantly for seamless, efficient skill development.
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="auth-right">
        <div className="auth-form-wrapper">
          <h1 className="auth-title">Welcome To {settings.siteName || 'TechTooTalk'}</h1>
          <p className="auth-subtitle">Your next big opportunity awaits start exploring now!</p>

          {/* Social Login Buttons */}
          <div className="social-buttons">
            <button type="button" className="social-btn">
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Login with Google
            </button>
            <button type="button" className="social-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#0A66C2">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              Login with LinkedIn
            </button>
          </div>

          {/* Divider */}
          <div className="divider">
            <div className="divider-line"></div>
            <span className="divider-text">or login with</span>
            <div className="divider-line"></div>
          </div>

          {/* Login Form */}
          {loginMethod === 'password' ? (
            <form onSubmit={handleSubmit}>
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

              <div className="form-group">
                <label className="form-label">Password<span>*</span></label>
                <div className="password-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    required
                    placeholder="Enter your password"
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
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    )}
                  </button>
                </div>
                <Link href="/forgot-password" className="forgot-link">
                  Forgot password?
                </Link>
              </div>

              <button type="submit" disabled={loading} className="submit-btn">
                {loading ? <span className="spinner"></span> : null}
                {loading ? 'Signing in...' : 'Login'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleOtpLogin}>
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
                  disabled={otpSent}
                />
              </div>

              {otpSent && (
                <div className="form-group">
                  <label className="form-label">Enter OTP<span>*</span></label>
                  <input
                    type="text"
                    required
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="form-input"
                    maxLength={6}
                  />
                </div>
              )}

              <button
                type={otpSent ? 'submit' : 'button'}
                onClick={otpSent ? undefined : handleSendOtp}
                disabled={loading}
                className="submit-btn"
              >
                {loading ? <span className="spinner"></span> : null}
                {loading ? 'Please wait...' : (otpSent ? 'Verify & Login' : 'Send OTP')}
              </button>
            </form>
          )}

          <button
            type="button"
            onClick={() => {
              setLoginMethod(loginMethod === 'password' ? 'otp' : 'password');
              setOtpSent(false);
              setOtp('');
            }}
            className="otp-link"
          >
            {loginMethod === 'password' ? 'Use OTP to Login' : 'Use Password to Login'}
          </button>

          <p className="auth-footer">
            Don&apos;t have an account? <Link href="/register">Create an account</Link>
          </p>

          {/* Demo Credentials */}
          <div className="demo-box">
            <div className="demo-title">🔑 Demo Credentials</div>
            <div className="demo-text">
              <strong>Admin:</strong> admin@techtootalk.com / admin123<br />
              <strong>User:</strong> Register a new account
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
