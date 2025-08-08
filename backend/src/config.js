require('dotenv').config();
module.exports = {
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET || 'dev_jwt_secret',
  STRIPE_SECRET: process.env.STRIPE_SECRET,
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
  OPENAI_KEY: process.env.OPENAI_KEY
};
