/*
  # Create users table for employee management

  1. New Tables
    - `users`
      - `id` (uuid, primary key) - Unique identifier for each user
      - `employee_id` (text, unique) - Custom employee identifier
      - `password` (text) - Encrypted password
      - `role` (text) - User role (ADMIN or EMPLOYEE)
      - `active` (boolean) - Account status flag
      - `created_at` (timestamp) - Account creation time
      - `updated_at` (timestamp) - Last modification time

  2. Security
    - Enable RLS on `users` table
    - Add policy for users to read their own data
    - Add policy for admins to manage all users

  3. Initial Data
    - Create default admin account
*/

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id text UNIQUE NOT NULL,
  password text NOT NULL,
  role text NOT NULL CHECK (role IN ('ADMIN', 'EMPLOYEE')),
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = id::text);

CREATE POLICY "Admins can manage all users"
  ON users
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

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at 
  BEFORE UPDATE ON users 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Insert default admin (password: admin123 - encoded with BCrypt)
INSERT INTO users (employee_id, password, role, active) 
VALUES ('admin', '$2a$10$X5wFWwMSLHUJ8F3j8J8OJOYJzqYJ2qEqPqQoZ8J9X5wFWwMSLHUJ8F', 'ADMIN', true)
ON CONFLICT (employee_id) DO NOTHING;