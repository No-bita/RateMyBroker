import crypto from 'crypto';

/**
 * Generates a secure random string for use as JWT secret
 * @param length Length of the secret (default: 64)
 * @returns A secure random string
 */
export function generateSecureSecret(length: number = 64): string {
  return crypto.randomBytes(length).toString('hex');
}

// Generate and log a new secret if this file is run directly
if (require.main === module) {
  const secret = generateSecureSecret();
  console.log('\nGenerated JWT Secret:');
  console.log('=====================');
  console.log(secret);
  console.log('\nAdd this to your .env file as:');
  console.log(`JWT_SECRET=${secret}`);
  console.log('\nMake sure to keep this secret secure and never commit it to version control!');
} 