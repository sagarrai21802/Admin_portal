package com.company.policymanagement.controller;

import com.company.policymanagement.dto.ApiResponse;
import com.company.policymanagement.dto.LoginRequest;
import com.company.policymanagement.dto.LoginResponse;
import com.company.policymanagement.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication", description = "Authentication endpoints for Admin and Employee")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/admin/login")
    @Operation(summary = "Admin login", description = "Authenticate admin user and return JWT token")
    public ResponseEntity<ApiResponse<LoginResponse>> adminLogin(@Valid @RequestBody LoginRequest loginRequest) {
        LoginResponse response = authService.authenticate(loginRequest);
        
        if (!"ADMIN".equals(response.getRole())) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Invalid admin credentials"));
        }

        return ResponseEntity.ok(ApiResponse.success("Admin login successful", response));
    }

    @PostMapping("/employee/login")
    @Operation(summary = "Employee login", description = "Authenticate employee user and return JWT token")
    public ResponseEntity<ApiResponse<LoginResponse>> employeeLogin(@Valid @RequestBody LoginRequest loginRequest) {
        LoginResponse response = authService.authenticate(loginRequest);
        
        if (!"EMPLOYEE".equals(response.getRole())) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Invalid employee credentials"));
        }

        return ResponseEntity.ok(ApiResponse.success("Employee login successful", response));
    }
}