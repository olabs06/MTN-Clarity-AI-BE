import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { validateChatMessage } from '../utils/validators';
import { chat } from '../services/skClient';
import ChatSession from '../models/chatSession.model';
import { ApiError } from '../utils/ApiError';

export const sendMessage = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    validateChatMessage(req.body);
    const { message, language = 'EN', context = {} } = req.body;
    const userId = req.user.id;

    // Retrieve or create chat session
    let session = await ChatSession.findOne({ userId });
    if (!session) {
      session = await ChatSession.create({ userId, messages: [] });
    }

    // Append user message
    session.messages.push({
      role: 'user',
      text: message,
      timestamp: new Date()
    });

    // We only send the last 5 messages as history to save token context
    const recentMessages = session.messages.slice(-5);
    
    // Call the Semantic Kernel service (or fallback mock)
    const aiResponse = await chat(session.id, message, language, {
      ...context,
      userProfile: req.user,
      recentMessages
    });

    // Append AI message
    session.messages.push({
      role: 'ai',
      text: aiResponse.text,
      timestamp: new Date()
    });

    await session.save();

    res.json(aiResponse);
  } catch (error) {
    next(error);
  }
};
