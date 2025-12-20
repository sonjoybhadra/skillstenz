const Resume = require('./Resume');
const Profile = require('../profiles/Profile');
const PDFDocument = require('pdfkit');
const { Document, Packer, Paragraph, TextRun } = require('docx');

exports.getResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({ userId: req.userId });
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }
    res.json(resume);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createResume = async (req, res) => {
  try {
    const resume = new Resume({ userId: req.userId, ...req.body });
    await resume.save();
    res.status(201).json({ message: 'Resume created', resume });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateResume = async (req, res) => {
  try {
    const resume = await Resume.findOneAndUpdate(
      { userId: req.userId },
      req.body,
      { new: true, upsert: true }
    );
    res.json({ message: 'Resume updated', resume });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.autoFillResume = async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.userId });
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    const sections = [
      {
        type: 'personal',
        title: 'Personal Information',
        content: {
          firstName: profile.personalDetails?.firstName,
          lastName: profile.personalDetails?.lastName,
          email: req.user.email,
          phone: profile.personalDetails?.phone,
          location: profile.personalDetails?.location
        }
      },
      {
        type: 'summary',
        title: 'Professional Summary',
        content: profile.personalDetails?.summary
      },
      {
        type: 'experience',
        title: 'Work Experience',
        content: profile.experience
      },
      {
        type: 'education',
        title: 'Education',
        content: profile.education
      },
      {
        type: 'skills',
        title: 'Skills',
        content: profile.skills
      },
      {
        type: 'certifications',
        title: 'Certifications',
        content: profile.certifications
      }
    ];

    let resume = await Resume.findOne({ userId: req.userId });
    if (resume) {
      resume.sections = sections;
      resume.autoFilled = true;
      await resume.save();
    } else {
      resume = new Resume({
        userId: req.userId,
        sections,
        autoFilled: true
      });
      await resume.save();
    }

    res.json({ message: 'Resume auto-filled', resume });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.exportPDF = async (req, res) => {
  try {
    const resume = await Resume.findOne({ userId: req.userId });
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=resume.pdf');
    
    doc.pipe(res);

    // Generate PDF content
    resume.sections.forEach(section => {
      if (section.visible) {
        doc.fontSize(16).text(section.title, { underline: true });
        doc.moveDown();
        
        // Add section content based on type
        if (section.type === 'personal' && section.content) {
          const personal = section.content;
          doc.fontSize(12).text(`${personal.firstName} ${personal.lastName}`);
          doc.text(personal.email);
          if (personal.phone) doc.text(personal.phone);
          if (personal.location) doc.text(personal.location);
        } else if (section.type === 'summary') {
          doc.fontSize(12).text(section.content);
        } else if (Array.isArray(section.content)) {
          section.content.forEach(item => {
            doc.fontSize(12).text(JSON.stringify(item, null, 2));
            doc.moveDown();
          });
        }
        
        doc.moveDown();
      }
    });

    doc.end();
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.exportDOCX = async (req, res) => {
  try {
    const resume = await Resume.findOne({ userId: req.userId });
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    const sections = resume.sections
      .filter(section => section.visible)
      .map(section => new Paragraph({
        children: [
          new TextRun({ text: section.title, bold: true, size: 32 }),
          new TextRun({ text: '\n' }),
          new TextRun({ text: JSON.stringify(section.content, null, 2), size: 24 })
        ]
      }));

    const doc = new Document({
      sections: [{
        properties: {},
        children: sections
      }]
    });

    const buffer = await Packer.toBuffer(doc);
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', 'attachment; filename=resume.docx');
    res.send(buffer);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.makePublic = async (req, res) => {
  try {
    const resume = await Resume.findOne({ userId: req.userId });
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    if (!resume.publicId) {
      resume.generatePublicId();
    }
    
    resume.isPublic = true;
    await resume.save();

    res.json({ message: 'Resume made public', publicUrl: `${process.env.FRONTEND_URL}/resume/${resume.publicId}` });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getPublicResume = async (req, res) => {
  try {
    const { publicId } = req.params;
    const resume = await Resume.findOne({ publicId, isPublic: true });
    
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    res.json(resume);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};