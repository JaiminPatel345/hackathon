import jwt from 'jsonwebtoken';
import {AppError} from "../types/custom.types.js";


const SECRET = process.env.JWT_ACCESS_SECRET || 'safdf786fsdhasdASDFAS'

//TODO: Do with 2 tokens

export const generateAccessToken = async (username: string): Promise<string> => {
  return jwt.sign(
      {
        username,
        jti: crypto.randomUUID()
      },
      SECRET,
      {expiresIn: '2000Minutes'} //TODO
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

  // Check if the authorization header is present


  // Extract the token from the header
  if (!token) {
    throw new AppError("Invalid token format", 401);
  }


  // Return a Promise to handle the asynchronous verification
  return new Promise((resolve, reject) => {
    jwt.verify(token, SECRET, (err: jwt.VerifyErrors | null, decoded: any) => {
      if (err) {
        reject(new AppError("Invalid or expired token", 401));
      } else {
        resolve(decoded.userId || decoded.uuid as string);
      }
    });
  });

};

export default checkTokens;