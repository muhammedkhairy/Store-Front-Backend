import bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

dotenv.config();

const salt = Number(process.env.SALT_ROUNDS);
const pepper = process.env.BCRYPT_PASSWORD;

// Hashes the given password using bcrypt.
export const hashPassword = (password: string): string => {
  const pepperPassword = password + pepper;
  const hashedPassword = bcrypt.hashSync(pepperPassword, salt);
  return hashedPassword;
};
