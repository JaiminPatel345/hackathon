import {client} from "./redis.js";
import {IRedisOtpData, IRedisUtils} from "../types/redis.types.js";
import {AppError} from "../types/custom.types.js";


const MAX_OTP_ATTEMPTS = 5;
const OTP_EXPIRY_SECONDS = 60 * 10; // 10 minutes

//Sets email and OTP data in Redis with expiration
export const setMobileAndOtp: IRedisUtils['setMobileAndOtp'] = async (mobile, generatedOtp) => {
  if (!mobile || !generatedOtp) {
    throw new Error('Email and OTP are required');
  }

  try {
    const payload: IRedisOtpData = {
      mobile,
      generatedOtp,
      wrongAttempts: 0,
      createdAt: new Date().toISOString()
    };

    const response = await client.set(
        `otp:${mobile}`,
        JSON.stringify(payload),
        {
          EX: OTP_EXPIRY_SECONDS
        }
    );

    if (response !== 'OK') {
      throw new Error('Failed to set OTP data in Redis');
    }

    return true;
  } catch (error) {
    console.error('Error setting OTP data in Redis:', error);
    throw new Error('Failed to store OTP data');
  }
};

/**
 * Retrieves email and OTP data from Redis
 */
export const getMobileAndOtp: IRedisUtils['getMobileAndOtp'] = async (mobile) => {
  if (!mobile) {
    throw new Error('mobile is required');
  }

  try {
    const response = await client.get(`otp:${mobile}`);

    if (!response) {
      return null;
    }

    const data = JSON.parse(response) as IRedisOtpData;

    // Check if max attempts exceeded
    if (data.wrongAttempts >= MAX_OTP_ATTEMPTS) {
      await removeEmailAndOtp(mobile);
      throw new AppError('Maximum OTP attempts exceeded', 400);
    }

    return data;
  } catch (error) {
    if (error instanceof SyntaxError) {
      console.error('Invalid JSON data in Redis:', error);
      await removeEmailAndOtp(mobile);
      return null;
    }

    console.error('Error retrieving OTP data from Redis:', error);
    throw error;
  }
};

// Increments the wrong attempts counter for an OTP
export const incrementWrongAttempts: IRedisUtils['incrementWrongAttempts'] = async (email) => {
  try {
    const data = await getMobileAndOtp(email);
    if (!data) {
      return false;
    }

    const updatedData: IRedisOtpData = {
      ...data,
      wrongAttempts: (data.wrongAttempts || 0) + 1
    };

    await client.set(
        `otp:${email}`,
        JSON.stringify(updatedData),
        {
          EX: OTP_EXPIRY_SECONDS
        }
    );

    return true;
  } catch (error) {
    console.error('Error incrementing wrong attempts:', error);
    throw error;
  }
};

// Removes mobile and OTP data from Redis
export const removeEmailAndOtp: IRedisUtils['removeMobileAndOtp'] = async (mobile) => {
  if (!mobile) {
    throw new Error('mobile is required');
  }

  try {
    const response = await client.del(`otp:${mobile}`);
    return response === 1;
  } catch (error) {
    console.error('Error removing OTP data from Redis:', error);
    throw new Error('Failed to remove OTP data');
  }
};
