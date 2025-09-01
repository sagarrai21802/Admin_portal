import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { supabase } from '../config/supabase.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Admin login
router.post('/admin/login', async (req, res) => {
    try {
        const { employeeId, password } = req.body;

        if (!employeeId || !password) {
            return res.status(400).json({
                success: false,
                message: 'Employee ID and password are required'
            });
        }

        // Query user from database
        const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('employee_id', employeeId)
            .eq('role', 'ADMIN')
            .eq('active', true)
            .single();

        if (error || !user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid admin credentials'
            });
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({
                success: false,
                message: 'Invalid admin credentials'
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            {
                userId: user.id,
                employeeId: user.employee_id,
                role: user.role
            },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            success: true,
            message: 'Admin login successful',
            data: {
                token,
                tokenType: 'Bearer',
                employeeId: user.employee_id,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Admin login error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

// Employee login
router.post('/employee/login', async (req, res) => {
    try {
        const { employeeId, password } = req.body;

        if (!employeeId || !password) {
            return res.status(400).json({
                success: false,
                message: 'Employee ID and password are required'
            });
        }

        // Query user from database
        const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('employee_id', employeeId)
            .eq('role', 'EMPLOYEE')
            .eq('active', true)
            .single();

        if (error || !user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid employee credentials'
            });
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({
                success: false,
                message: 'Invalid employee credentials'
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            {
                userId: user.id,
                employeeId: user.employee_id,
                role: user.role
            },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            success: true,
            message: 'Employee login successful',
            data: {
                token,
                tokenType: 'Bearer',
                employeeId: user.employee_id,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Employee login error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

export { router as authRoutes };