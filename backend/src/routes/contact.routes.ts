import { Router } from 'express';
import { ContactController } from '../controllers/contact.controller.js';

const router = Router();
const controller = new ContactController();

router.post('/', controller.submitContactForm);

router.get('/', controller.getAllMessages);

export default router;
