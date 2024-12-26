// hash password
import bcrypt from 'bcrypt';
export const hashPassword = async (password: string) => {
  try {
    return await bcrypt.hash(password, 10);
  } catch (e) {
    console.error('Error hashing password:', e);
  }
};
