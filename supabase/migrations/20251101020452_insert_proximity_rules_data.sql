/*
  # Insert Proximity Rules Data

  Populates the proximity_rules table with the minimum distance requirements
  between Bitcoin Depot kiosks based on population density.
*/

INSERT INTO proximity_rules (density_min, density_max, standard_distance_miles, state_exceptions, description)
VALUES
  (0, 2000, 1.00, '{"HI": 0.9, "ND": 0.9, "NM": 0.9, "WA": 0.9}'::jsonb, '0-2,000 people/sq mi'),
  (2001, 5000, 0.70, '{}'::jsonb, '2,001-5,000 people/sq mi'),
  (5001, 10000, 0.50, '{}'::jsonb, '5,001-10,000 people/sq mi'),
  (10001, 25000, 0.50, '{}'::jsonb, '10,001-25,000 people/sq mi'),
  (25001, 999999, 0.25, '{}'::jsonb, '25,001+ people/sq mi')
ON CONFLICT (density_min, density_max) DO UPDATE SET
  standard_distance_miles = EXCLUDED.standard_distance_miles,
  state_exceptions = EXCLUDED.state_exceptions,
  updated_at = now();
