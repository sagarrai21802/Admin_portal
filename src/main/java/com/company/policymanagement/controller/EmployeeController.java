package com.company.policymanagement.controller;

import com.company.policymanagement.dto.ApiResponse;
import com.company.policymanagement.dto.PolicyResponse;
import com.company.policymanagement.service.PolicyService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/employee")
@Tag(name = "Employee", description = "Employee endpoints for accessing policies")
@SecurityRequirement(name = "Bearer Authentication")
public class EmployeeController {

    @Autowired
    private PolicyService policyService;

    @GetMapping("/policies")
    @PreAuthorize("hasRole('EMPLOYEE')")
    @Operation(summary = "Get all policies", description = "Retrieve all available company policies")
    public ResponseEntity<ApiResponse<List<PolicyResponse>>> getAllPolicies() {
        List<PolicyResponse> policies = policyService.getAllPolicies();
        return ResponseEntity.ok(ApiResponse.success("Policies retrieved successfully", policies));
    }

    @GetMapping("/policies/{policyId}")
    @PreAuthorize("hasRole('EMPLOYEE')")
    @Operation(summary = "Get policy details", description = "Retrieve specific policy details")
    public ResponseEntity<ApiResponse<PolicyResponse>> getPolicyById(@PathVariable UUID policyId) {
        PolicyResponse policy = policyService.getPolicyById(policyId);
        return ResponseEntity.ok(ApiResponse.success("Policy retrieved successfully", policy));
    }

    @GetMapping("/policies/{policyId}/download")
    @PreAuthorize("hasRole('EMPLOYEE')")
    @Operation(summary = "Get policy download URL", description = "Get download URL for a policy document")
    public ResponseEntity<ApiResponse<String>> getDownloadUrl(@PathVariable UUID policyId) {
        String downloadUrl = policyService.getDownloadUrl(policyId);
        return ResponseEntity.ok(ApiResponse.success("Download URL generated successfully", downloadUrl));
    }
}