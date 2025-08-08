-- Insert test user
INSERT INTO users (id, email, password_hash) VALUES (gen_random_uuid(), 'agent@example.com', 'devpasshash');

-- Insert property and lead
INSERT INTO properties (provider_property_id, address, city, state, postal_code, last_sale_date, last_sale_price, estimated_value, owner_name, absentee_owner, raw)
VALUES ('prov-1001', '123 Main St', 'Vancouver', 'BC', 'V6B1A1', '2009-06-15', 300000, 650000, 'John Doe', true, '{}'::jsonb);

-- create a lead
INSERT INTO leads (property_id, source, motivation_score)
SELECT id, 'seed', 75 FROM properties WHERE provider_property_id='prov-1001';

-- add contact
INSERT INTO lead_contacts (lead_id, phone, email, verified, encrypted)
SELECT l.id, '+15555550123', 'owner@example.com', true, false FROM leads l JOIN properties p ON p.id = l.property_id WHERE p.provider_property_id='prov-1001';

-- add credits for user
INSERT INTO credits_balances (user_id, balance)
SELECT id, 5 FROM users WHERE email='agent@example.com';
