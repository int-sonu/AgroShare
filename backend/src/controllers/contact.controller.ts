import { Request, Response } from 'express';
import { Contact } from '../models/contact.model.js';

export class ContactController {
  submitContactForm = async (req: Request, res: Response): Promise<void> => {
    try {
      const { firstName, lastName, email, subject, message } = req.body;

      if (!firstName || !lastName || !email || !subject || !message) {
        res.status(400).json({ success: false, message: 'All fields are required' });
        return;
      }

      const newContact = await Contact.create({
        firstName,
        lastName,
        email,
        subject,
        message,
      });

      res.status(201).json({
        success: true,
        message: 'Your message has been sent successfully. We will get back to you soon!',
        data: newContact,
      });
    } catch (error: unknown) {
      console.error('Submit contact form error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to send message. Please try again later.',
      });
    }
  };

  getAllMessages = async (req: Request, res: Response): Promise<void> => {
    try {
      const messages = await Contact.find().sort({ createdAt: -1 });
      res.json({ success: true, data: messages });
    } catch {
      res.status(500).json({ success: false, message: 'Failed to fetch messages' });
    }
  };
}
