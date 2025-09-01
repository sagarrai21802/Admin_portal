import express from 'express';
import bcrypt from 'bcryptjs';
import multer from 'multer';
import { supabase } from '../config/supabase.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = [
            'application/pdf',
            'text/plain',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ];
        
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('File type not allowed. Only PDF, TXT, DOC, DOCX files are permitted.'));
        }
    }
});

// Apply authentication and admin role requirement to all routes
router.use(authenticateToken);
router.use(requireRole('ADMIN'));

// Create employee
router.post('/employees', async (req, res) => {
    try {
        const { employeeId, password } = req.body;

        if (!employeeId || !password) {
            return res.status(400).json({
                success: false,
                message: 'Employee ID and password are required'
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters long'
            });
        }

        // Check if employee ID already exists
        const { data: existingUser } = await supabase
            .from('users')
            .select('id')
            .eq('employee_id', employeeId)
            .single();

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'Employee ID already exists'
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create employee
        const { data: newEmployee, error } = await supabase
            .from('users')
            .insert({
                employee_id: employeeId,
                password: hashedPassword,
                role: 'EMPLOYEE',
                active: true
            })
            .select()
            .single();

        if (error) {
            throw error;
        }

        res.status(201).json({
            success: true,
            message: 'Employee created successfully',
            data: {
                id: newEmployee.id,
                employeeId: newEmployee.employee_id,
                role: newEmployee.role,
                createdAt: newEmployee.created_at
            }
        });
    } catch (error) {
        console.error('Create employee error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create employee'
        });
    }
});

// Get all employees
router.get('/employees', async (req, res) => {
    try {
        const { data: employees, error } = await supabase
            .from('users')
            .select('id, employee_id, role, active, created_at')
            .eq('role', 'EMPLOYEE')
            .eq('active', true)
            .order('created_at', { ascending: false });

        if (error) {
            throw error;
        }

        res.json({
            success: true,
            message: 'Employees retrieved successfully',
            data: employees
        });
    } catch (error) {
        console.error('Get employees error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve employees'
        });
    }
});

// Upload policy
router.post('/policies/upload', upload.single('file'), async (req, res) => {
    try {
        const { title, description } = req.body;
        const file = req.file;

        if (!title || !file) {
            return res.status(400).json({
                success: false,
                message: 'Title and file are required'
            });
        }

        // Generate unique filename
        const fileExtension = file.originalname.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExtension}`;
        const filePath = `policies/${fileName}`;

        // Upload file to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('policies')
            .upload(filePath, file.buffer, {
                contentType: file.mimetype,
                duplex: false
            });

        if (uploadError) {
            throw uploadError;
        }

        // Save policy metadata to database
        const { data: policy, error: dbError } = await supabase
            .from('policies')
            .insert({
                title,
                description,
                file_name: file.originalname,
                file_path: filePath,
                file_type: file.mimetype,
                file_size: file.size,
                uploaded_by: req.user.userId
            })
            .select(`
                *,
                uploaded_by_user:users!uploaded_by(employee_id)
            `)
            .single();

        if (dbError) {
            // Clean up uploaded file if database insert fails
            await supabase.storage.from('policies').remove([filePath]);
            throw dbError;
        }

        res.status(201).json({
            success: true,
            message: 'Policy uploaded successfully',
            data: {
                id: policy.id,
                title: policy.title,
                description: policy.description,
                fileName: policy.file_name,
                fileType: policy.file_type,
                fileSize: policy.file_size,
                uploadedBy: policy.uploaded_by_user.employee_id,
                createdAt: policy.created_at
            }
        });
    } catch (error) {
        console.error('Upload policy error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to upload policy'
        });
    }
});

// Get all policies
router.get('/policies', async (req, res) => {
    try {
        const { data: policies, error } = await supabase
            .from('policies')
            .select(`
                *,
                uploaded_by_user:users!uploaded_by(employee_id)
            `)
            .order('created_at', { ascending: false });

        if (error) {
            throw error;
        }

        const formattedPolicies = policies.map(policy => ({
            id: policy.id,
            title: policy.title,
            description: policy.description,
            fileName: policy.file_name,
            fileType: policy.file_type,
            fileSize: policy.file_size,
            uploadedBy: policy.uploaded_by_user.employee_id,
            createdAt: policy.created_at
        }));

        res.json({
            success: true,
            message: 'Policies retrieved successfully',
            data: formattedPolicies
        });
    } catch (error) {
        console.error('Get policies error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve policies'
        });
    }
});

// Delete policy
router.delete('/policies/:policyId', async (req, res) => {
    try {
        const { policyId } = req.params;

        // Get policy details first
        const { data: policy, error: fetchError } = await supabase
            .from('policies')
            .select('file_path')
            .eq('id', policyId)
            .single();

        if (fetchError || !policy) {
            return res.status(404).json({
                success: false,
                message: 'Policy not found'
            });
        }

        // Delete file from storage
        const { error: storageError } = await supabase.storage
            .from('policies')
            .remove([policy.file_path]);

        if (storageError) {
            console.error('Storage deletion error:', storageError);
        }

        // Delete policy from database
        const { error: dbError } = await supabase
            .from('policies')
            .delete()
            .eq('id', policyId);

        if (dbError) {
            throw dbError;
        }

        res.json({
            success: true,
            message: 'Policy deleted successfully'
        });
    } catch (error) {
        console.error('Delete policy error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete policy'
        });
    }
});

// Deactivate employee
router.put('/employees/:employeeId/deactivate', async (req, res) => {
    try {
        const { employeeId } = req.params;

        const { data: updatedEmployee, error } = await supabase
            .from('users')
            .update({ active: false })
            .eq('id', employeeId)
            .eq('role', 'EMPLOYEE')
            .select()
            .single();

        if (error || !updatedEmployee) {
            return res.status(404).json({
                success: false,
                message: 'Employee not found'
            });
        }

        res.json({
            success: true,
            message: 'Employee deactivated successfully'
        });
    } catch (error) {
        console.error('Deactivate employee error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to deactivate employee'
        });
    }
});

export { router as adminRoutes };