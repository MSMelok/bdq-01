/*
  # Insert Population Minimum Rules Data

  Populates the population_minimum_rules table with minimum population
  and density requirements by state.
*/

DELETE FROM population_minimum_rules;

INSERT INTO population_minimum_rules (state_code, population_minimum, density_minimum, special_conditions)
VALUES
  (NULL, 10000, 400, 'Default rule for all states'),
  ('WY', 0, 0, 'No minimum, but must be within 1 mile of city with 7,500+ residents'),
  ('AK', 7500, 300, 'Reduced minimums for Alaska'),
  ('ME', 7500, 300, 'Reduced minimums for Maine'),
  ('MT', 7500, 300, 'Reduced minimums for Montana'),
  ('ND', 7500, 300, 'Reduced minimums for North Dakota'),
  ('SD', 7500, 300, 'Reduced minimums for South Dakota'),
  ('AZ', 15000, 300, 'Reduced density minimum only if population is 15,000+'),
  ('WA', 15000, 300, 'Reduced density minimum only if population is 15,000+');
