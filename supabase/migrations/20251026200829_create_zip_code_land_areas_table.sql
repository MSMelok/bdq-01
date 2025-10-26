/*
  # Create ZIP Code Land Areas Table

  1. New Tables
    - `zip_code_land_areas`
      - `zip_code` (text, primary key) - ZIP code identifier
      - `land_area_sq_meters` (numeric) - Land area in square meters
      - `state` (text, optional) - State abbreviation for reference
      - `created_at` (timestamptz) - Record creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

  2. Security
    - Enable RLS on `zip_code_land_areas` table
    - Add policy for public read access (land area data is public information)
    - Add policy for authenticated users to insert/update data

  3. Purpose
    - Store ZIP code land area data from Census Bureau
    - Enables fast lookups without repeated API calls
    - Improves performance and reduces external API dependency
*/

CREATE TABLE IF NOT EXISTS zip_code_land_areas (
  zip_code text PRIMARY KEY,
  land_area_sq_meters numeric NOT NULL,
  state text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE zip_code_land_areas ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read land area data (public information)
CREATE POLICY "Anyone can read zip code land areas"
  ON zip_code_land_areas
  FOR SELECT
  TO public
  USING (true);

-- Allow service role to insert new records
CREATE POLICY "Service role can insert zip code land areas"
  ON zip_code_land_areas
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow service role to update existing records
CREATE POLICY "Service role can update zip code land areas"
  ON zip_code_land_areas
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_zip_code_land_areas_zip ON zip_code_land_areas(zip_code);
