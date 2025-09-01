package com.company.policymanagement.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class CreateEmployeeRequest {
    
    @NotBlank(message = "Employee ID is required")
    @Size(min = 3, max = 50, message = "Employee ID must be between 3 and 50 characters")
    private String employeeId;
    
    @NotBlank(message = "Password is required")
    @Size(min = 6, max = 100, message = "Password must be between 6 and 100 characters")
    private String password;

    // Constructors
    public CreateEmployeeRequest() {}

    public CreateEmployeeRequest(String employeeId, String password) {
        this.employeeId = employeeId;
        this.password = password;
    }

    // Getters and Setters
    public String getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(String employeeId) {
        this.employeeId = employeeId;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}