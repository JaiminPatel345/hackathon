import express from 'express';
import {isAuthenticated} from "../utiles/verifyRequest/isAuthenticated.js";
import * as chatController from '../controller/chat.controller.js';
import {verifyChatRequest} from "../utiles/verifyRequest/chatRequest.js";

const router = express.Router();

router.post('/conversation', isAuthenticated, verifyChatRequest, chatController.createConversation);
router.get('/conversation', isAuthenticated, chatController.getUserConversations);
router.get('/conversation/:conversationId', isAuthenticated, chatController.getConversationById);
router.put('/conversation', isAuthenticated, chatController.updateConversation);
router.delete('/conversation/:conversationId', isAuthenticated, chatController.deleteConversation);

router.post('/message', isAuthenticated, chatController.sendMessage);
router.get('/message/:conversationId', isAuthenticated, chatController.getConversationMessages);
router.put('/message', isAuthenticated, chatController.editMessage);
router.delete('/message/:messageId', isAuthenticated, chatController.deleteMessage);

router.put('/read', isAuthenticated, chatController.markConversationAsRead);

export default router;
