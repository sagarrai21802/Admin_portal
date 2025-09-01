package com.company.policymanagement.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public class CreateEmployeeResponse {
    
    private UUID id;
    private String employeeId;
    private String role;
    private LocalDateTime createdAt;
    private String message;

    // Constructors
    public CreateEmployeeResponse() {}

    public CreateEmployeeResponse(UUID id, String employeeId, String role, 
                                LocalDateTime createdAt, String message) {
        this.id = id;
        this.employeeId = employeeId;
        this.role = role;
        this.createdAt = createdAt;
        this.message = message;
    }

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(String employeeId) {
        this.employeeId = employeeId;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}