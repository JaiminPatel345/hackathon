import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';

export const checkPassword = (password: string): boolean => {
  // Password requirements:
  // - At least 8 characters long
  // - Contains at least one uppercase letter
  // - Contains at least one lowercase letter
  // - Contains at least one number
  // - Contains at least one special character (!@#$%^&*()_-+=<>?/[]{})

  if (password.length < 8) return false;

  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_\-+=<>?/[\]{}]/.test(password);

  return hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
};

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Password hashing
export const generateHashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 12);
};

export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};
