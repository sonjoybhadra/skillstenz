const nodemailer = require('nodemailer');

// Create transporter (configure with your email service)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Generate 6-digit OTP
exports.generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP email
exports.sendOTPEmail = async (email, otp, name = '') => {
  const mailOptions = {
    from: `"SkillStenz" <${process.env.SMTP_USER || 'noreply@skillstenz.com'}>`,
    to: email,
    subject: 'Verify Your Email - SkillStenz',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Verification</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f5;">
        <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <div style="background: white; border-radius: 16px; padding: 40px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <!-- Logo -->
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="margin: 0; font-size: 28px;">
                <span style="color: #10b981;">Tech</span><span style="color: #3b82f6;">Too</span><span style="color: #8b5cf6;">Talk</span>
              </h1>
              <p style="color: #6b7280; margin-top: 8px;">Learn • Build • Grow</p>
            </div>
            
            <!-- Content -->
            <div style="text-align: center;">
              <h2 style="color: #1f2937; margin-bottom: 16px;">Verify Your Email</h2>
              <p style="color: #4b5563; margin-bottom: 24px;">
                ${name ? `Hi ${name},` : 'Hi there,'}<br>
                Please use the following verification code to complete your registration:
              </p>
              
              <!-- OTP Box -->
              <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 12px; padding: 24px; margin: 24px 0;">
                <p style="color: white; font-size: 14px; margin: 0 0 8px 0; opacity: 0.9;">Your Verification Code</p>
                <p style="color: white; font-size: 36px; font-weight: bold; letter-spacing: 8px; margin: 0;">${otp}</p>
              </div>
              
              <p style="color: #6b7280; font-size: 14px; margin-bottom: 24px;">
                This code will expire in <strong>10 minutes</strong>.
              </p>
              
              <div style="border-top: 1px solid #e5e7eb; padding-top: 24px; margin-top: 24px;">
                <p style="color: #9ca3af; font-size: 13px;">
                  If you didn't request this code, please ignore this email.
                </p>
              </div>
            </div>
          </div>
          
          <!-- Footer -->
          <div style="text-align: center; margin-top: 24px;">
            <p style="color: #9ca3af; font-size: 12px;">
              © ${new Date().getFullYear()} SkillStenz. All rights reserved.
            </p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Email send error:', error);
    return false;
  }
};

// Send welcome email
exports.sendWelcomeEmail = async (email, name) => {
  const mailOptions = {
    from: `"SkillStenz" <${process.env.SMTP_USER || 'noreply@skillstenz.com'}>`,
    to: email,
    subject: 'Welcome to SkillStenz! 🎉',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f5;">
        <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <div style="background: white; border-radius: 16px; padding: 40px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="margin: 0; font-size: 28px; color: #2563eb;">
                SkillStenz
              </h1>
            </div>
            
            <div style="text-align: center;">
              <h2 style="color: #1f2937;">Welcome to SkillStenz! 🎉</h2>
              <p style="color: #4b5563; line-height: 1.6;">
                Hi ${name || 'there'},<br><br>
                Thank you for joining SkillStenz! We're excited to have you on board.
              </p>
              
              <div style="background: #f0fdf4; border-radius: 12px; padding: 20px; margin: 24px 0; text-align: left;">
                <h3 style="color: #166534; margin: 0 0 12px 0;">🚀 Get Started</h3>
                <ul style="color: #4b5563; margin: 0; padding-left: 20px; line-height: 1.8;">
                  <li>Explore our technology courses</li>
                  <li>Practice with interactive quizzes</li>
                  <li>Build your developer profile</li>
                  <li>Join hackathons and internships</li>
                </ul>
              </div>
              
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard" 
                 style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; margin-top: 16px;">
                Start Learning
              </a>
            </div>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Email send error:', error);
    return false;
  }
};
