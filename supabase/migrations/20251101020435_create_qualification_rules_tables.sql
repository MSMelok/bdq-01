/*
  # Create Qualification Rules Tables

  1. New Tables:
    - `auto_rejected_states`: Lists states where Bitcoin Depot kiosks are automatically rejected
    - `proximity_rules`: Population density ranges and their corresponding minimum distances between kiosks
    - `kiosk_density_rules`: Maximum number of kiosks allowed within 1 mile by population density
    - `population_minimum_rules`: Minimum population and density requirements by state

  2. Purpose:
    - Centralized management of qualification rules
    - Easy updates when company policies change
    - Enable dynamic rule application based on location data

  3. Security:
    - Enable RLS on all tables
    - Add policies for authenticated read access
*/

-- Auto-Rejected States Table
CREATE TABLE IF NOT EXISTS auto_rejected_states (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  state_code char(2) NOT NULL UNIQUE,
  state_name text NOT NULL,
  reason text NOT NULL,
  exceptions jsonb DEFAULT 'null'::jsonb,
  effective_date date NOT NULL DEFAULT CURRENT_DATE,
  discontinued_date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE auto_rejected_states ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read auto-rejected states"
  ON auto_rejected_states FOR SELECT
  TO authenticated
  USING (true);

-- Proximity Rules Table (minimum distance between Bitcoin Depot kiosks)
CREATE TABLE IF NOT EXISTS proximity_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  density_min integer NOT NULL,
  density_max integer NOT NULL,
  standard_distance_miles numeric(3,2) NOT NULL,
  state_exceptions jsonb DEFAULT '{}'::jsonb,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(density_min, density_max)
);

ALTER TABLE proximity_rules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read proximity rules"
  ON proximity_rules FOR SELECT
  TO authenticated
  USING (true);

-- Kiosk Density Rules Table (max total kiosks within 1 mile)
CREATE TABLE IF NOT EXISTS kiosk_density_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  density_min integer NOT NULL,
  density_max integer NOT NULL,
  standard_kiosk_limit integer NOT NULL,
  state_exceptions jsonb DEFAULT '{}'::jsonb,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(density_min, density_max)
);

ALTER TABLE kiosk_density_rules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read kiosk density rules"
  ON kiosk_density_rules FOR SELECT
  TO authenticated
  USING (true);

-- Population Minimum Rules Table
CREATE TABLE IF NOT EXISTS population_minimum_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  state_code char(2),
  population_minimum integer NOT NULL,
  density_minimum integer NOT NULL,
  special_conditions text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE population_minimum_rules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read population minimum rules"
  ON population_minimum_rules FOR SELECT
  TO authenticated
  USING (true);

-- Ignored Competitors Table
CREATE TABLE IF NOT EXISTS ignored_competitors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  competitor_name text NOT NULL UNIQUE,
  reason text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE ignored_competitors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read ignored competitors"
  ON ignored_competitors FOR SELECT
  TO authenticated
  USING (true);
