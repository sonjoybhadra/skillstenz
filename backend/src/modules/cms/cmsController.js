const CmsPage = require('../../models/CmsPage');
const ContactMessage = require('../../models/ContactMessage');
const nodemailer = require('nodemailer');

// Create email transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

// Public: Get CMS page by slug
exports.getPage = async (req, res) => {
  try {
    const page = await CmsPage.findOne({ slug: req.params.slug, isActive: true });
    if (!page) {
      return res.status(404).json({ error: 'Page not found' });
    }
    res.json({ page });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch page' });
  }
};

// Public: Submit contact form
exports.submitContactForm = async (req, res) => {
  try {
    const { name, email, subject, category, message } = req.body;
    
    const contact = new ContactMessage({
      name,
      email,
      subject,
      category,
      message,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });
    
    await contact.save();
    
    // Send email notification
    try {
      const transporter = createTransporter();
      await transporter.sendMail({
        from: process.env.SMTP_FROM || 'noreply@techtootalk.com',
        to: process.env.CONTACT_EMAIL || 'support@techtootalk.com',
        subject: `New Contact Form: ${subject || 'General Inquiry'}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Category:</strong> ${category || 'General'}</p>
          <p><strong>Subject:</strong> ${subject || 'N/A'}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
        `
      });
    } catch (emailError) {
      console.error('Failed to send email notification:', emailError);
    }
    
    res.json({ success: true, message: 'Thank you for contacting us! We will get back to you soon.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit contact form' });
  }
};

// Admin: Get all CMS pages
exports.getAllPages = async (req, res) => {
  try {
    const pages = await CmsPage.find().sort({ createdAt: -1 });
    res.json({ pages });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch pages' });
  }
};

// Admin: Create/Update CMS page
exports.savePage = async (req, res) => {
  try {
    const { slug } = req.params;
    const pageData = { ...req.body, lastUpdatedBy: req.user.id };
    
    const page = await CmsPage.findOneAndUpdate(
      { slug },
      pageData,
      { new: true, upsert: true }
    );
    
    res.json({ page, message: 'Page saved successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save page' });
  }
};

// Admin: Delete CMS page
exports.deletePage = async (req, res) => {
  try {
    await CmsPage.findOneAndDelete({ slug: req.params.slug });
    res.json({ message: 'Page deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete page' });
  }
};

// Admin: Get all contact messages
exports.getContactMessages = async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const filter = {};
    if (status && status !== 'all') filter.status = status;
    
    const messages = await ContactMessage.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate('repliedBy', 'name email');
    
    const total = await ContactMessage.countDocuments(filter);
    
    res.json({
      messages,
      pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};

// Admin: Update message status
exports.updateMessageStatus = async (req, res) => {
  try {
    const { status, replyMessage } = req.body;
    const updateData = { status };
    
    if (status === 'replied' && replyMessage) {
      updateData.replyMessage = replyMessage;
      updateData.repliedAt = new Date();
      updateData.repliedBy = req.user.id;
      
      // Send reply email
      const message = await ContactMessage.findById(req.params.id);
      if (message) {
        try {
          const transporter = createTransporter();
          await transporter.sendMail({
            from: process.env.SMTP_FROM || 'support@techtootalk.com',
            to: message.email,
            subject: `Re: ${message.subject || 'Your inquiry'}`,
            html: `
              <p>Dear ${message.name},</p>
              <p>${replyMessage}</p>
              <br/>
              <p>Best regards,<br/>TechTooTalk Support Team</p>
            `
          });
        } catch (emailError) {
          console.error('Failed to send reply email:', emailError);
        }
      }
    }
    
    const updated = await ContactMessage.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json({ message: updated, success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update message' });
  }
};

// Admin: Delete message
exports.deleteMessage = async (req, res) => {
  try {
    await ContactMessage.findByIdAndDelete(req.params.id);
    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete message' });
  }
};
