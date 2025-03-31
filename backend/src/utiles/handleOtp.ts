import {setUsernameAndOtp} from "../redis/redisUtils.js";


const generateOtp = () => {
  const otp = Math.floor(1000 + Math.random() * 9000);
  return otp.toString();
};

const sendOtp = async (mobile: string, otp: number) => {
  const message = `Your One Time Password ( OTP ) from Make My Buddy is ${otp}`;
  const mobileNumber = mobile.startsWith('+') ? mobile.slice(1,) : mobile;

  const response = await fetch('https://api.httpsms.com/v1/messages/send', {
    method: 'POST',
    headers: {
      "x-api-Key": process.env.HTTPSMS_API_KEY || '',
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      "content": message,
      "encrypted": false,
      "from": process.env.MY_MOBILE_NUMBER || '',
      "to": mobileNumber
    })
  });

  const data = await response.json();
  console.log("Messages Send successfully ",data);
}


const handleOtp = async (mobile: string, username: string) => {
  const generatedOtp = generateOtp();
  console.log(`Generated Otp for ${mobile} is  ${generatedOtp}`);
  await Promise.all([
    sendOtp(mobile, parseInt(generatedOtp)),
    setUsernameAndOtp(username, generatedOtp)
  ]);
}

export default handleOtp;