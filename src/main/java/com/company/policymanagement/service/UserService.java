package com.company.policymanagement.service;

import com.company.policymanagement.dto.CreateEmployeeRequest;
import com.company.policymanagement.dto.CreateEmployeeResponse;
import com.company.policymanagement.entity.User;
import com.company.policymanagement.exception.DuplicateEmployeeException;
import com.company.policymanagement.exception.UserNotFoundException;
import com.company.policymanagement.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public Optional<User> findByEmployeeId(String employeeId) {
        return userRepository.findByEmployeeIdAndActiveTrue(employeeId);
    }

    public User findById(UUID id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User not found with ID: " + id));
    }

    public boolean isUserActive(UUID userId) {
        return userRepository.findById(userId)
                .map(User::getActive)
                .orElse(false);
    }

    public CreateEmployeeResponse createEmployee(CreateEmployeeRequest request) {
        // Check if employee ID already exists
        if (userRepository.existsByEmployeeId(request.getEmployeeId())) {
            throw new DuplicateEmployeeException("Employee ID already exists: " + request.getEmployeeId());
        }

        // Create new employee
        User employee = new User();
        employee.setEmployeeId(request.getEmployeeId());
        employee.setPassword(passwordEncoder.encode(request.getPassword()));
        employee.setRole(User.Role.EMPLOYEE);
        employee.setActive(true);

        User savedEmployee = userRepository.save(employee);

        return new CreateEmployeeResponse(
                savedEmployee.getId(),
                savedEmployee.getEmployeeId(),
                savedEmployee.getRole().name(),
                savedEmployee.getCreatedAt(),
                "Employee created successfully"
        );
    }

    public List<User> getAllActiveEmployees() {
        return userRepository.findAllActiveEmployees();
    }

    public void deactivateEmployee(UUID employeeId) {
        User employee = findById(employeeId);
        if (employee.getRole() != User.Role.EMPLOYEE) {
            throw new IllegalArgumentException("Can only deactivate employee accounts");
        }
        employee.setActive(false);
        userRepository.save(employee);
    }

    public boolean validateCredentials(String employeeId, String rawPassword) {
        Optional<User> userOpt = findByEmployeeId(employeeId);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            return user.getActive() && passwordEncoder.matches(rawPassword, user.getPassword());
        }
        return false;
    }
}