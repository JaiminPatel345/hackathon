import jwt from 'jsonwebtoken';

//TODO: Do with 2 tokens

export const generateAccessToken = async (userId: string): Promise<string> => {
  return jwt.sign(
      {
        userId,
        jti: crypto.randomUUID()
      },
      process.env.JWT_ACCESS_SECRET as string,
      {expiresIn: '2000Minutes'} //TODO
  );
};

export const generateRefreshToken = (userId: string): string => {
  return jwt.sign(
      {userId},
      process.env.JWT_REFRESH_SECRET as string,
      {expiresIn: '8Weeks'}
  );
};

export const getTokens = async (userId: string): Promise<string> => {

  const accessToken = await generateAccessToken(userId);
  // const refreshToken = generateRefreshToken(userId);
  return accessToken

};