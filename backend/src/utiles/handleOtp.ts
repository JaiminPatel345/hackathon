import {setMobileAndOtp} from "../redis/redisUtils.js";
import {AppError} from "../types/custom.types.js";


const generateOtp = () => {
  const otp = Math.floor(1000 + Math.random() * 9000);
  return otp.toString();
};

const sendOtp =async (mobile: string, otp: number) => {
  const message = `Your One Time Password ( OTP ) from Make My Buddy is ${otp}`;
  const mobileNumber = mobile.startsWith('+') ? mobile.slice(1,) : mobile;

  const sessionId = Math.random().toString(36).substring(7);
  const url = `http://api.whatsms.in/api/sendMessage.php?token=${process.env.WHATSMS_TOKEN}&message=${message}&mobile=${mobileNumber}&sessionId=${sessionId}&docUrl=${process.env.LOGO_IMAGE_URL}&msgType=img
`
  const response = await fetch(url);
  const data = await response.json();
  if(!response.ok || data.status !== "SUCCESS") {
    throw new AppError('Error to send SMS',500);
  }
}


const handleOtp = async (mobile: string) => {
  const generatedOtp = generateOtp();
  await Promise.all([
    sendOtp(mobile , parseInt(generatedOtp)),
    setMobileAndOtp(mobile, generatedOtp)
  ]);
}

export default handleOtp;