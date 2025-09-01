package com.company.policymanagement.controller;

import com.company.policymanagement.dto.*;
import com.company.policymanagement.entity.User;
import com.company.policymanagement.service.PolicyService;
import com.company.policymanagement.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin")
@Tag(name = "Admin", description = "Admin-only endpoints for managing policies and employees")
@SecurityRequirement(name = "Bearer Authentication")
public class AdminController {

    @Autowired
    private UserService userService;

    @Autowired
    private PolicyService policyService;

    @PostMapping("/employees")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create employee", description = "Create new employee credentials")
    public ResponseEntity<ApiResponse<CreateEmployeeResponse>> createEmployee(
            @Valid @RequestBody CreateEmployeeRequest request) {
        
        CreateEmployeeResponse response = userService.createEmployee(request);
        return ResponseEntity.ok(ApiResponse.success("Employee created successfully", response));
    }

    @GetMapping("/employees")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get all employees", description = "Retrieve all active employees")
    public ResponseEntity<ApiResponse<List<User>>> getAllEmployees() {
        List<User> employees = userService.getAllActiveEmployees();
        return ResponseEntity.ok(ApiResponse.success("Employees retrieved successfully", employees));
    }

    @PostMapping("/policies/upload")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Upload policy", description = "Upload a new company policy document")
    public ResponseEntity<ApiResponse<PolicyResponse>> uploadPolicy(
            @RequestParam("file") MultipartFile file,
            @RequestParam("title") String title,
            @RequestParam(value = "description", required = false) String description,
            Authentication authentication) {
        
        UUID adminId = (UUID) authentication.getPrincipal();
        PolicyResponse response = policyService.uploadPolicy(file, title, description, adminId);
        return ResponseEntity.ok(ApiResponse.success("Policy uploaded successfully", response));
    }

    @GetMapping("/policies")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get all policies", description = "Retrieve all uploaded policies")
    public ResponseEntity<ApiResponse<List<PolicyResponse>>> getAllPolicies() {
        List<PolicyResponse> policies = policyService.getAllPolicies();
        return ResponseEntity.ok(ApiResponse.success("Policies retrieved successfully", policies));
    }

    @DeleteMapping("/policies/{policyId}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete policy", description = "Delete a policy document")
    public ResponseEntity<ApiResponse<Void>> deletePolicy(
            @PathVariable UUID policyId,
            Authentication authentication) {
        
        UUID adminId = (UUID) authentication.getPrincipal();
        policyService.deletePolicy(policyId, adminId);
        return ResponseEntity.ok(ApiResponse.success("Policy deleted successfully"));
    }

    @PutMapping("/employees/{employeeId}/deactivate")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Deactivate employee", description = "Deactivate an employee account")
    public ResponseEntity<ApiResponse<Void>> deactivateEmployee(@PathVariable UUID employeeId) {
        userService.deactivateEmployee(employeeId);
        return ResponseEntity.ok(ApiResponse.success("Employee deactivated successfully"));
    }
}