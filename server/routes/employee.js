import express from 'express';
import { supabase } from '../config/supabase.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Apply authentication and employee role requirement to all routes
router.use(authenticateToken);
router.use(requireRole('EMPLOYEE'));

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

// Get policy details
router.get('/policies/:policyId', async (req, res) => {
    try {
        const { policyId } = req.params;

        const { data: policy, error } = await supabase
            .from('policies')
            .select(`
                *,
                uploaded_by_user:users!uploaded_by(employee_id)
            `)
            .eq('id', policyId)
            .single();

        if (error || !policy) {
            return res.status(404).json({
                success: false,
                message: 'Policy not found'
            });
        }

        res.json({
            success: true,
            message: 'Policy retrieved successfully',
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
        console.error('Get policy error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve policy'
        });
    }
});

// Get policy download URL
router.get('/policies/:policyId/download', async (req, res) => {
    try {
        const { policyId } = req.params;

        // Get policy file path
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

        // Generate signed URL for download
        const { data: signedUrlData, error: urlError } = await supabase.storage
            .from('policies')
            .createSignedUrl(policy.file_path, 3600); // 1 hour expiry

        if (urlError) {
            throw urlError;
        }

        res.json({
            success: true,
            message: 'Download URL generated successfully',
            data: signedUrlData.signedUrl
        });
    } catch (error) {
        console.error('Get download URL error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to generate download URL'
        });
    }
});

export { router as employeeRoutes };