package com.company.policymanagement.service;

import com.company.policymanagement.dto.LoginRequest;
import com.company.policymanagement.dto.LoginResponse;
import com.company.policymanagement.entity.User;
import com.company.policymanagement.exception.InvalidCredentialsException;
import com.company.policymanagement.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    public LoginResponse authenticate(LoginRequest loginRequest) {
        if (!userService.validateCredentials(loginRequest.getEmployeeId(), loginRequest.getPassword())) {
            throw new InvalidCredentialsException("Invalid credentials");
        }

        User user = userService.findByEmployeeId(loginRequest.getEmployeeId())
                .orElseThrow(() -> new InvalidCredentialsException("Invalid credentials"));

        String token = jwtUtil.generateToken(user);
        return new LoginResponse(token, user.getEmployeeId(), user.getRole());
    }
}