import * as crypto from "node:crypto";

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

export const generateHashPassword = (password: string): string => {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto
      .createHmac('sha256', salt)
      .update(password)
      .digest('hex');

  return `${salt}:${hash}`;
};

export const verifyPassword = (password: string, hashedPassword: string): boolean => {
  const [salt, storedHash] = hashedPassword.split(':');

  const crypto = require('crypto');
  const hash = crypto
      .createHmac('sha256', salt)
      .update(password)
      .digest('hex');

  return storedHash === hash;
};
