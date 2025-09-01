package com.company.policymanagement.dto;

import com.company.policymanagement.entity.User;

public class LoginResponse {
    
    private String token;
    private String tokenType = "Bearer";
    private String employeeId;
    private String role;

    // Constructors
    public LoginResponse() {}

    public LoginResponse(String token, String employeeId, User.Role role) {
        this.token = token;
        this.employeeId = employeeId;
        this.role = role.name();
    }

    // Getters and Setters
    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getTokenType() {
        return tokenType;
    }

    public void setTokenType(String tokenType) {
        this.tokenType = tokenType;
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
}