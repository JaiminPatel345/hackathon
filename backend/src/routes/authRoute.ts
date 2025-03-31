import express from 'express'
const router = express.Router()
import * as authController from '../controller/auth.controller.js'
import {
  verifyLoginRequest, verifyOtpRequest,
  verifySignupRequest
} from "../utiles/verifyRequest/authRequest.js";

router.post('/login',verifyLoginRequest, authController.loginUser)
router.post('/register',verifySignupRequest, authController.registerUser)
router.post('/verify-otp' , verifyOtpRequest, authController.verifyOtp)

export default router
