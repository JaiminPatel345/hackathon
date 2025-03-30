import {IMobile} from "./user.types.js";

export interface IRedisPayload {
  mobile: IMobile,
  otp: string,
  wrongTry: number,
}

export interface IRedisOtpData {
  mobile: IMobile;
  generatedOtp: string;
  wrongAttempts: number;
  createdAt: string;
}

export interface IRedisUtils {
  setMobileAndOtp: (mobile: IMobile, generatedOtp: string) => Promise<boolean>;
  getMobileAndOtp: (mobile: IMobile ) => Promise<IRedisOtpData | null >;
  removeMobileAndOtp: (mobile: IMobile) => Promise<boolean>;
  incrementWrongAttempts: (mobile: IMobile) => Promise<boolean>;
}
