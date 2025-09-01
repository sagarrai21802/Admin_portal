package com.company.policymanagement.repository;

import com.company.policymanagement.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    
    Optional<User> findByEmployeeIdAndActiveTrue(String employeeId);
    
    boolean existsByEmployeeId(String employeeId);
    
    @Query("SELECT u FROM User u WHERE u.role = 'EMPLOYEE' AND u.active = true")
    List<User> findAllActiveEmployees();
    
    @Query("SELECT u FROM User u WHERE u.role = 'ADMIN' AND u.active = true")
    List<User> findAllActiveAdmins();
}