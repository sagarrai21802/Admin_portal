/*
  # Create default admin user

  1. New Data
    - Insert default admin user with credentials:
      - Employee ID: admin
      - Password: admin123 (hashed)
      - Role: ADMIN
      - Active: true

  2. Security
    - Password is properly hashed using bcrypt
    - Admin user is immediately available for login
*/

-- Insert default admin user (password: admin123)
INSERT INTO users (employee_id, password, role, active)
VALUES (
  'admin',
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- bcrypt hash of 'admin123'
  'ADMIN',
  true
)
ON CONFLICT (employee_id) DO NOTHING;