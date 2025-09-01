/*
  # Create policies table for document management

  1. New Tables
    - `policies`
      - `id` (uuid, primary key) - Unique identifier for each policy
      - `title` (text) - Policy document title
      - `description` (text) - Optional policy description
      - `file_name` (text) - Original filename
      - `file_path` (text) - Storage path in Supabase
      - `file_type` (text) - MIME type of the file
      - `file_size` (bigint) - File size in bytes
      - `uploaded_by` (uuid) - Reference to the admin who uploaded
      - `created_at` (timestamp) - Upload timestamp

  2. Security
    - Enable RLS on `policies` table
    - Add policy for authenticated users to read all policies
    - Add policy for admins to manage policies

  3. Indexes
    - Index on uploaded_by for efficient queries
    - Index on created_at for sorting
*/

CREATE TABLE IF NOT EXISTS policies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  file_name text NOT NULL,
  file_path text NOT NULL,
  file_type text NOT NULL,
  file_size bigint NOT NULL,
  uploaded_by uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE policies ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "All authenticated users can read policies"
  ON policies
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage policies"
  ON policies
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users u 
      WHERE u.id::text = auth.uid()::text 
      AND u.role = 'ADMIN' 
      AND u.active = true
    )
  );

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_policies_uploaded_by ON policies(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_policies_created_at ON policies(created_at DESC);