import { randomBytes, scrypt, timingSafeEqual } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);

export class PasswordManager {
  /**
   * Function to hash any plain string
   * @param password Plain string to convert into a hash
   * @returns Hashed version of the string
   */
  static async toHash(password: string) {
    const salt = randomBytes(10).toString('hex');
    const buf = (await scryptAsync(password, salt, 64)) as Buffer;

    return `${buf.toString('hex')}.${salt}`;
  }

  /**
   * Function to check if a plain string is equal to a hashed string
   * @param storedHash The hashed version of a string
   * @param supplied Plain string to compare against the hash
   * @returns Whether or not both strings match
   */
  static async compare(storedHash: string, supplied: string) {
    const [hashedPassword, salt] = storedHash.split('.');
    if (!hashedPassword || !salt) return false;

    const buf = (await scryptAsync(supplied, salt, 64)) as Buffer;
    const keyBuffer = Buffer.from(hashedPassword, 'hex');
    const match = timingSafeEqual(buf, keyBuffer);

    return match;
  }
}
