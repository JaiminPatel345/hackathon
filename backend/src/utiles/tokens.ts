import jwt from 'jsonwebtoken';
import {AppError} from "../types/custom.types.js";


const SECRET = process.env.JWT_ACCESS_SECRET || 'ThisIsRandomOkAndNotActual?Safdf786fsdhasdASDFAS'

//TODO: Do with 2 tokens

export const generateAccessToken = async (username: string): Promise<string> => {
  return jwt.sign(
      {
        username,
        jti: crypto.randomUUID()
      },
      SECRET,
      {expiresIn: '1Y'} //TODO
  );
};

export const generateRefreshToken = (username: string): string => {
  return jwt.sign(
      {username},
      process.env.JWT_REFRESH_SECRET as string,
      {expiresIn: '8Weeks'}
  );
};

export const getTokens = async (username: string): Promise<string> => {

  const accessToken = await generateAccessToken(username);
  // const refreshToken = generateRefreshToken(userId);
  return accessToken

};

const checkTokens = (token: string): Promise<string>  => {

  // Extract the token from the header
  if (!token) {
    throw new AppError("Invalid token format", 401);
  }


  // Return a Promise to handle the asynchronous verification
  return new Promise((resolve, reject) => {
    jwt.verify(token, SECRET, (err: jwt.VerifyErrors | null, decoded: any) => {
      if (err) {
        console.log("Error to check tokens")
        reject(new AppError("Invalid or expired token", 401));
      } else {
        resolve(decoded.username);
      }
    });
  });

};

export default checkTokens;