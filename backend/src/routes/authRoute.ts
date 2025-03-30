import express from 'express'
const router = express.Router()
import * as authController from '../controller/auth.controller.js'
import {
  verifyLoginRequest,
  verifySignupRequest
} from "../utiles/verifyRequest/authRequest.js";

router.post('/login',verifyLoginRequest, authController.loginUser)
router.post('/register',verifySignupRequest, authController.registerUser)

export default router
