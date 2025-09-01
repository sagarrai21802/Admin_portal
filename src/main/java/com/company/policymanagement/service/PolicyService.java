package com.company.policymanagement.service;

import com.company.policymanagement.dto.PolicyResponse;
import com.company.policymanagement.entity.Policy;
import com.company.policymanagement.entity.User;
import com.company.policymanagement.exception.FileUploadException;
import com.company.policymanagement.exception.PolicyNotFoundException;
import com.company.policymanagement.repository.PolicyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class PolicyService {

    @Autowired
    private PolicyRepository policyRepository;

    @Autowired
    private SupabaseStorageService storageService;

    @Autowired
    private UserService userService;

    private static final List<String> ALLOWED_FILE_TYPES = Arrays.asList(
            "application/pdf", "text/plain", "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );

    private static final long MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

    public PolicyResponse uploadPolicy(MultipartFile file, String title, String description, UUID adminId) {
        validateFile(file);

        User admin = userService.findById(adminId);
        if (admin.getRole() != User.Role.ADMIN) {
            throw new IllegalArgumentException("Only admins can upload policies");
        }

        try {
            String filePath = storageService.uploadFile(file);

            Policy policy = new Policy();
            policy.setTitle(title);
            policy.setDescription(description);
            policy.setFileName(file.getOriginalFilename());
            policy.setFilePath(filePath);
            policy.setFileType(file.getContentType());
            policy.setFileSize(file.getSize());
            policy.setUploadedBy(admin);

            Policy savedPolicy = policyRepository.save(policy);
            return new PolicyResponse(savedPolicy);

        } catch (IOException e) {
            throw new FileUploadException("Failed to upload file: " + e.getMessage());
        }
    }

    public List<PolicyResponse> getAllPolicies() {
        return policyRepository.findAllOrderByCreatedAtDesc()
                .stream()
                .map(PolicyResponse::new)
                .collect(Collectors.toList());
    }

    public PolicyResponse getPolicyById(UUID id) {
        Policy policy = policyRepository.findById(id)
                .orElseThrow(() -> new PolicyNotFoundException("Policy not found with ID: " + id));
        return new PolicyResponse(policy);
    }

    public String getDownloadUrl(UUID policyId) {
        Policy policy = policyRepository.findById(policyId)
                .orElseThrow(() -> new PolicyNotFoundException("Policy not found with ID: " + policyId));
        
        return storageService.getDownloadUrl(policy.getFilePath());
    }

    public void deletePolicy(UUID policyId, UUID adminId) {
        User admin = userService.findById(adminId);
        if (admin.getRole() != User.Role.ADMIN) {
            throw new IllegalArgumentException("Only admins can delete policies");
        }

        Policy policy = policyRepository.findById(policyId)
                .orElseThrow(() -> new PolicyNotFoundException("Policy not found with ID: " + policyId));

        try {
            storageService.deleteFile(policy.getFilePath());
            policyRepository.delete(policy);
        } catch (Exception e) {
            throw new RuntimeException("Failed to delete policy: " + e.getMessage());
        }
    }

    private void validateFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new FileUploadException("File is empty");
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new FileUploadException("File size exceeds maximum limit of 10MB");
        }

        if (!ALLOWED_FILE_TYPES.contains(file.getContentType())) {
            throw new FileUploadException("File type not allowed. Allowed types: PDF, TXT, DOC, DOCX");
        }
    }
}