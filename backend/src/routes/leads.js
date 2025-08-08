const express = require('express');
const router = express.Router();
const db = require('../db');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');

const requireAuth = (req,res,next) => {
  const auth = req.headers.authorization;
  if(!auth) return res.status(401).send({error:'no_auth'});
  const token = auth.replace('Bearer ','');
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch(e) { return res.status(401).send({error:'invalid_token'}); }
};

// list leads (public-ish for dev)
router.get('/', async (req,res) => {
  const q = `SELECT l.id as lead_id, p.address, p.city, p.estimated_value, l.motivation_score
             FROM leads l
             JOIN properties p ON p.id = l.property_id
             ORDER BY l.motivation_score DESC
             LIMIT 200`;
  const { rows } = await db.query(q);
  res.json(rows);
});

// unlock (requires auth)
router.post('/:id/unlock', requireAuth, async (req,res) => {
  const leadId = req.params.id;
  const userId = req.user.id;
  const creditsRequired = 1;

  const client = await db.getClient();
  try {
    await client.query('BEGIN');
    const balRes = await client.query(
      `SELECT balance FROM credits_balances WHERE user_id = $1 FOR UPDATE`,
      [userId]
    );
    if (balRes.rowCount === 0) {
      await client.query('ROLLBACK');
      return res.status(402).json({ error: 'no_balance', needs_checkout: true });
    }
    const balance = balRes.rows[0].balance;
    if (balance < creditsRequired) {
      await client.query('ROLLBACK');
      return res.status(402).json({ error: 'insufficient_credits', needs_checkout: true });
    }
    const newBalance = balance - creditsRequired;
    await client.query(
      `UPDATE credits_balances SET balance = $1, updated_at = now() WHERE user_id = $2`,
      [newBalance, userId]
    );
    await client.query(
      `INSERT INTO credits_transactions (user_id, amount, type, metadata) VALUES ($1, $2, $3, $4)`,
      [userId, -creditsRequired, 'unlock', JSON.stringify({ lead_id: leadId })]
    );
    await client.query(
      `INSERT INTO unlocks (user_id, lead_id, credits_used) VALUES ($1, $2, $3)`,
      [userId, leadId, creditsRequired]
    );
    const contactRes = await client.query(
      `SELECT lc.phone, lc.email, p.address, p.owner_name, p.estimated_value
       FROM lead_contacts lc
       JOIN leads l ON l.id = lc.lead_id
       JOIN properties p ON p.id = l.property_id
       WHERE l.id = $1 LIMIT 1`, [leadId]
    );
    await client.query('COMMIT');
    if (contactRes.rowCount === 0) {
      return res.json({ unlocked: true, contact: null });
    }
    res.json({ unlocked: true, contact: contactRes.rows[0] });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('unlock error', err);
    res.status(500).json({ error: 'unlock_failed' });
  } finally {
    client.release();
  }
});

module.exports = router;
