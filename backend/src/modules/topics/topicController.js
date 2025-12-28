const Topic = require('./Topic'); // LegacyTopic model
const Technology = require('../technologies/Technology');

exports.getTopicsByTechnology = async (req, res) => {
  try {
    const { technologyId } = req.params;
    const topics = await Topic.find({ technologyId }).sort('order');
    res.json(topics);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getTopic = async (req, res) => {
  try {
    const { id } = req.params;
    const topic = await Topic.findById(id).populate('technologyId', 'name accessType');
    
    if (!topic) {
      return res.status(404).json({ message: 'Topic not found' });
    }

    res.json(topic);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createTopic = async (req, res) => {
  try {
    const topic = new Topic(req.body);
    await topic.save();
    res.status(201).json({ message: 'Topic created', topic });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateTopic = async (req, res) => {
  try {
    const { id } = req.params;
    const topic = await Topic.findByIdAndUpdate(id, req.body, { new: true });
    
    if (!topic) {
      return res.status(404).json({ message: 'Topic not found' });
    }

    res.json({ message: 'Topic updated', topic });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteTopic = async (req, res) => {
  try {
    const { id } = req.params;
    const topic = await Topic.findByIdAndDelete(id);
    
    if (!topic) {
      return res.status(404).json({ message: 'Topic not found' });
    }

    res.json({ message: 'Topic deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.approveContent = async (req, res) => {
  try {
    const { id, subtopicIndex, contentIndex } = req.params;
    const topic = await Topic.findById(id);
    
    if (!topic) {
      return res.status(404).json({ message: 'Topic not found' });
    }

    if (!topic.subtopics[subtopicIndex] || !topic.subtopics[subtopicIndex].content[contentIndex]) {
      return res.status(404).json({ message: 'Content not found' });
    }

    topic.subtopics[subtopicIndex].content[contentIndex].approved = true;
    topic.subtopics[subtopicIndex].content[contentIndex].approvedBy = req.userId;
    topic.subtopics[subtopicIndex].content[contentIndex].approvedAt = new Date();

    await topic.save();
    res.json({ message: 'Content approved' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};