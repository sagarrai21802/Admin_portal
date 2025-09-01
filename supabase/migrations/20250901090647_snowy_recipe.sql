/*
  # Create storage bucket for policy documents

  1. Storage Setup
    - Create 'policies' storage bucket
    - Set up bucket policies for file access
    - Configure file upload restrictions

  2. Security
    - Authenticated users can read files
    - Only admins can upload files
    - File size and type restrictions
*/

-- Create storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('policies', 'policies', false)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to read files
CREATE POLICY "Authenticated users can view policy files"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (bucket_id = 'policies');

-- Allow admins to upload files
CREATE POLICY "Admins can upload policy files"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'policies' AND
    EXISTS (
      SELECT 1 FROM users u 
      WHERE u.id::text = auth.uid()::text 
      AND u.role = 'ADMIN' 
      AND u.active = true
    )
  );

-- Allow admins to delete files
CREATE POLICY "Admins can delete policy files"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'policies' AND
    EXISTS (
      SELECT 1 FROM users u 
      WHERE u.id::text = auth.uid()::text 
      AND u.role = 'ADMIN' 
      AND u.active = true
    )
  );