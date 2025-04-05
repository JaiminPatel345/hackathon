import express from 'express';
import * as userController from '../controller/user.controller.js';
import * as buddyRequestController
  from '../controller/buddyRequest.controller.js';
import * as adminController from '../controller/admin.controller.js';
import {
  isAdmin,
  isAuthenticated
} from "../utiles/verifyRequest/isAuthenticated.js";
import {
  verifyBuddyRequest,
  verifyBuddyRequestParams,
  verifyUpdateUserRequest
} from "../utiles/verifyRequest/userRequest.js";

const router = express.Router();

// Profile routes
router.get('/me', isAuthenticated, userController.getMyProfile);
router.get('/profile/:userId', userController.getUserProfile);
router.put('/update-profile', isAuthenticated, verifyUpdateUserRequest, userController.updateUserDetails);

// User actions
router.post('/toggle-block', isAuthenticated, verifyBuddyRequest, userController.toggleBlockUser);

router.post('/remove-buddy', isAuthenticated, userController.removeBuddy);
router.post('/remove-from-buddies', isAuthenticated, verifyBuddyRequest, userController.removeFromBuddies);

// Buddy request routes
router.post('/buddy-request/send', isAuthenticated, verifyBuddyRequestParams, buddyRequestController.sendBuddyRequest);
router.post('/buddy-request/accept', isAuthenticated, buddyRequestController.acceptBuddyRequest);
router.post('/buddy-request/reject', isAuthenticated, buddyRequestController.rejectBuddyRequest);
router.post('/buddy-request/cancel', isAuthenticated, buddyRequestController.cancelBuddyRequest);
router.get('/buddy-request/sent', isAuthenticated, buddyRequestController.getSentRequests);
router.get('/buddy-request/received', isAuthenticated, buddyRequestController.getReceivedRequests);

//suggestions
router.get('/suggestions', isAuthenticated, userController.suggestBuddies)

// Admin buddy management routes
router.post('/admin/make-buddy', isAuthenticated, isAdmin, adminController.adminMakeBuddy);
router.post('/admin/remove-buddy', isAuthenticated, isAdmin, adminController.adminRemoveBuddy);
router.post('/admin/add-to-buddies', isAuthenticated, isAdmin, adminController.adminAddToBuddies);
router.post('/admin/remove-from-buddies', isAuthenticated, isAdmin, adminController.adminRemoveFromBuddies);


export default router;
