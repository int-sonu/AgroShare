import dotenv from 'dotenv';

dotenv.config({ path: './.env' });

console.log('ENV Loaded:');
console.log('EMAIL_USER:', process.env.EMAIL_USER);
