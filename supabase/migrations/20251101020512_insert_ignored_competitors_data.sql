/*
  # Insert Ignored Competitors Data

  Populates the ignored_competitors table with competitor companies
  that are no longer active and should be ignored during qualification.
*/

INSERT INTO ignored_competitors (competitor_name, reason)
VALUES
  ('American Crypto Bitcoin ATM', 'Company no longer active'),
  ('Bitbox ATM', 'Company no longer active'),
  ('Bitcoin of America', 'Company no longer active'),
  ('CoinCloud', 'Company no longer active'),
  ('DigitalMint', 'Company no longer active'),
  ('Margo', 'Company no longer active')
ON CONFLICT (competitor_name) DO UPDATE SET
  reason = EXCLUDED.reason,
  updated_at = now();
