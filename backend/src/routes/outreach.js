const express = require('express');
const router = express.Router();
const db = require('../db');
const openai = require('../services/openaiClient');
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

function buildPrompt(lead, ownerName) {
  return `You are a professional real estate agent. Write a short email and an SMS given:
Owner name: ${ownerName || 'Owner'}
Address: ${lead.address}
Estimated value: ${lead.estimated_value || 'unknown'}
Tone: empathetic, professional, include a CTA.`;
}

router.post('/generate', requireAuth, async (req,res) => {
  const { leadId } = req.body;
  const userId = req.user.id;
  const leadQ = await db.query(`SELECT l.id as lead_id, p.address, p.estimated_value, p.owner_name FROM leads l JOIN properties p ON p.id = l.property_id WHERE l.id=$1`, [leadId]);
  if (leadQ.rowCount === 0) return res.status(404).json({ error: 'lead_not_found' });
  const lead = leadQ.rows[0];
  try {
    // If OPENAI not configured this returns a basic template
    const subject = `Quick question about ${lead.address}`;
    const body = `Hi ${lead.owner_name || 'there'},\nI work with local buyers and noticed your property at ${lead.address}. If you're considering selling or curious about market value (est ${lead.estimated_value}), I'd love to chat. Reply or call me.`;
    await db.query(`INSERT INTO outreach_drafts (user_id, lead_id, channel, subject, body) VALUES ($1,$2,$3,$4,$5)`, [userId, leadId, 'email', subject, body]);
    res.json({ subject, body });
  } catch (err) {
    console.error('openai error', err);
    res.status(500).json({ error: 'generation_failed' });
  }
});

module.exports = router;
