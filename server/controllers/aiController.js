import AIKnowledge from '../models/AIKnowledge.js';

const DEFAULT_RESPONSE = {
  content: "I'm AVIOX AI, your career development assistant! I can help you with information about our programs, sessions, booking, career guidance, internships, and more. What would you like to know?",
  actionButtons: [
    { label: 'Explore Programs', action: 'navigate', url: '/#programs' },
    { label: 'Book a Session', action: 'whatsapp', url: 'https://wa.me/918921757960?text=Hi%20AVIOX!%20I%20would%20like%20to%20book%20a%20session.' },
    { label: 'Contact AVIOX', action: 'navigate', url: '/#contact' },
  ],
};

const tokenize = (text) => text.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(Boolean);

const scoreMatch = (query, knowledge) => {
  const queryTokens = tokenize(query);
  let score = 0;
  for (const token of queryTokens) {
    for (const keyword of knowledge.keywords) {
      if (keyword.includes(token) || token.includes(keyword)) {
        score += keyword === token ? 3 : 1;
      }
    }
    if (knowledge.topic.toLowerCase().includes(token)) score += 2;
    if (knowledge.content.toLowerCase().includes(token)) score += 0.5;
  }
  score += knowledge.priority * 0.1;
  return score;
};

export const chat = async (req, res, next) => {
  try {
    const { message } = req.body;
    if (!message?.trim()) {
      return res.status(400).json({ success: false, message: 'Message is required.' });
    }

    const knowledgeBase = await AIKnowledge.find({ isActive: true });
    
    let bestMatch = null;
    let highestScore = 0;

    for (const kb of knowledgeBase) {
      const score = scoreMatch(message, kb);
      if (score > highestScore) {
        highestScore = score;
        bestMatch = kb;
      }
    }

    const threshold = 1.0;
    if (!bestMatch || highestScore < threshold) {
      return res.json({ success: true, data: { ...DEFAULT_RESPONSE, confidence: 'low' } });
    }

    res.json({
      success: true,
      data: {
        content: bestMatch.content,
        actionButtons: bestMatch.actionButtons || [],
        category: bestMatch.category,
        confidence: highestScore > 3 ? 'high' : 'medium',
      },
    });
  } catch (error) { next(error); }
};

export const getKnowledge = async (req, res, next) => {
  try {
    const knowledge = await AIKnowledge.find().sort({ category: 1, priority: -1 });
    res.json({ success: true, data: { knowledge } });
  } catch (error) { next(error); }
};

export const createKnowledge = async (req, res, next) => {
  try {
    const knowledge = await AIKnowledge.create(req.body);
    res.status(201).json({ success: true, message: 'Knowledge created.', data: { knowledge } });
  } catch (error) { next(error); }
};

export const updateKnowledge = async (req, res, next) => {
  try {
    const knowledge = await AIKnowledge.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!knowledge) return res.status(404).json({ success: false, message: 'Knowledge not found.' });
    res.json({ success: true, message: 'Knowledge updated.', data: { knowledge } });
  } catch (error) { next(error); }
};

export const deleteKnowledge = async (req, res, next) => {
  try {
    await AIKnowledge.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Knowledge deleted.' });
  } catch (error) { next(error); }
};
