/*
  # Insert Kiosk Density Rules Data

  Populates the kiosk_density_rules table with the maximum number of kiosks
  (Bitcoin Depot + competitors combined) allowed within 1 mile.
*/

INSERT INTO kiosk_density_rules (density_min, density_max, standard_kiosk_limit, state_exceptions, description)
VALUES
  (0, 2000, 2, '{"HI": 4, "AZ": 3, "WA": 3, "ND": 3, "NM": 3}'::jsonb, '0-2,000 people/sq mi'),
  (2001, 5000, 4, '{"HI": 6, "AZ": 5, "WA": 5, "ND": 5, "NM": 5}'::jsonb, '2,001-5,000 people/sq mi'),
  (5001, 10000, 4, '{"HI": 7, "AZ": 6, "WA": 6}'::jsonb, '5,001-10,000 people/sq mi'),
  (10001, 25000, 7, '{}'::jsonb, '10,001-25,000 people/sq mi'),
  (25001, 999999, 11, '{}'::jsonb, '25,001+ people/sq mi')
ON CONFLICT (density_min, density_max) DO UPDATE SET
  standard_kiosk_limit = EXCLUDED.standard_kiosk_limit,
  state_exceptions = EXCLUDED.state_exceptions,
  updated_at = now();
