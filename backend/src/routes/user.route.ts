import express from 'express'
import * as authController from '../controller/auth.controller.js'
import {verifyUpdateUserRequest} from "../utiles/verifyRequest/authRequest.js";
import {isAuthenticated} from "../utiles/verifyRequest/isAuthenticated.js";

const router = express.Router()


router.put('/update-profile', isAuthenticated, verifyUpdateUserRequest, authController.updateUserDetails);


export default router
