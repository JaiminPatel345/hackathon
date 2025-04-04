import express from 'express';
import {isAuthenticated} from "../utiles/verifyRequest/isAuthenticated.js";
import * as chatController from '../controller/chat.controller.js';
import {verifyChatRequest} from "../utiles/verifyRequest/chatRequest.js";
import * as resourceController from "../controller/resource.controller.js";

const router = express.Router();

router.post('/conversation', isAuthenticated, verifyChatRequest, chatController.createConversation);
router.get('/conversation', isAuthenticated, chatController.getUserConversations);
router.get('/conversation/:conversationId', isAuthenticated, chatController.getConversationById);
router.put('/conversation', isAuthenticated, chatController.updateConversation);
router.delete('/conversation/:conversationId', isAuthenticated, chatController.deleteConversation);

//join community
router.post('/conversation/join/:conversationId', isAuthenticated, chatController.joinCommunity);

router.post('/message', isAuthenticated, chatController.sendMessage);
router.get('/message/:conversationId', isAuthenticated, chatController.getConversationMessages);
router.put('/message', isAuthenticated, chatController.editMessage);
router.delete('/message/:messageId', isAuthenticated, chatController.deleteMessage);

router.put('/read', isAuthenticated, chatController.markConversationAsRead);

router.get('/resource', isAuthenticated, resourceController.getResourcesByType);

export default router;
