CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password_hash text,
  role text NOT NULL DEFAULT 'agent',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE properties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_property_id text UNIQUE,
  address text,
  city text,
  state text,
  postal_code text,
  last_sale_date date,
  last_sale_price numeric,
  estimated_value numeric,
  owner_name text,
  owner_type text,
  absentee_owner boolean DEFAULT false,
  raw jsonb,
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid REFERENCES properties(id) ON DELETE CASCADE,
  source text,
  motivation_score numeric DEFAULT 0,
  status text DEFAULT 'new',
  assigned_agent_id uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE lead_contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid REFERENCES leads(id) ON DELETE CASCADE,
  phone text,
  email text,
  verified boolean DEFAULT false,
  encrypted boolean DEFAULT true
);

CREATE TABLE credits_balances (
  user_id uuid PRIMARY KEY REFERENCES users(id),
  balance integer NOT NULL DEFAULT 0,
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE credits_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id),
  amount integer NOT NULL,
  type text NOT NULL,
  metadata jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE unlocks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id),
  lead_id uuid REFERENCES leads(id),
  credits_used integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE outreach_drafts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id),
  lead_id uuid REFERENCES leads(id),
  channel text,
  subject text,
  body text,
  created_at timestamptz DEFAULT now(),
  status text DEFAULT 'draft'
);
