const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const Stripe = require('stripe');
const { STRIPE_SECRET, STRIPE_WEBHOOK_SECRET } = require('../config');
const stripe = STRIPE_SECRET ? Stripe(STRIPE_SECRET) : null;
const db = require('../db');

router.post('/create-checkout-session', async (req, res) => {
  // stub: return a fake url in dev
  res.json({ url: 'https://checkout.stripe.com/pay/cs_test_fake' });
});

router.post('/webhook', bodyParser.raw({ type: 'application/json' }), async (req, res) => {
  // In dev, just accept the webhook
  res.json({ received: true });
});

module.exports = router;
