/*
  # Insert Auto-Rejected States Data

  Populates the auto_rejected_states table with the states where Bitcoin Depot
  kiosks are automatically rejected, including exceptions and discontinuation dates.
*/

INSERT INTO auto_rejected_states (state_code, state_name, reason, exceptions, discontinued_date)
VALUES
  ('CA', 'California', 'Auto-rejected state', '{"exception": "Indian Reservations allowed"}'::jsonb, NULL),
  ('CT', 'Connecticut', 'Auto-rejected state', NULL, NULL),
  ('MA', 'Massachusetts', 'Auto-rejected state', NULL, NULL),
  ('NY', 'New York', 'Auto-rejected state', NULL, NULL),
  ('PR', 'Puerto Rico', 'Auto-rejected state', NULL, NULL),
  ('RI', 'Rhode Island', 'Auto-rejected state', NULL, NULL),
  ('VT', 'Vermont', 'Auto-rejected state', NULL, NULL),
  ('ME', 'Maine', 'Auto-rejected state', '{"discontinued": "April 28, 2025"}'::jsonb, '2025-04-28'::date),
  ('IA', 'Iowa', 'Auto-rejected state', NULL, NULL),
  ('IL', 'Illinois', 'Auto-rejected state', '{"exception": "Allowed starting February 14, 2025 for 15% fee revenue locations"}'::jsonb, NULL),
  ('MN', 'Minnesota', 'Auto-rejected state', '{"exception": "Allowed only for 15% fee revenue locations"}'::jsonb, NULL)
ON CONFLICT (state_code) DO UPDATE SET
  reason = EXCLUDED.reason,
  exceptions = EXCLUDED.exceptions,
  discontinued_date = EXCLUDED.discontinued_date,
  updated_at = now();
