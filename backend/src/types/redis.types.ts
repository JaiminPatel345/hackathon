
export interface IRedisPayload {
  otp: string,
  wrongTry: number,
}

export interface IRedisOtpData {
  generatedOtp: string;
  wrongAttempts: number;
}

export interface IRedisUtils {
  setOtp: (username: string, generatedOtp: string) => Promise<boolean>;
  getOtp: (username: string ) => Promise<IRedisOtpData | null >;
  removeOtp: (username: string) => Promise<boolean>;
  incrementWrongAttempts: (username: string) => Promise<boolean>;
}
