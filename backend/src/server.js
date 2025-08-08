const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const leadsRouter = require('./routes/leads');
const paymentsRouter = require('./routes/payments');
const outreachRouter = require('./routes/outreach');

const app = express();
app.use(helmet());
app.use(cors());
app.use(bodyParser.json());

// simple health
app.get('/api/health', (req,res) => res.json({ ok: true }));

app.use('/api/leads', leadsRouter);
app.use('/api/payments', paymentsRouter);
app.use('/api/outreach', outreachRouter);

// error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'internal_error' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, ()=>console.log('Backend running on', PORT));
