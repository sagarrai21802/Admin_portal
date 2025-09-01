package com.company.policymanagement.repository;

import com.company.policymanagement.entity.Policy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PolicyRepository extends JpaRepository<Policy, UUID> {
    
    @Query("SELECT p FROM Policy p ORDER BY p.createdAt DESC")
    List<Policy> findAllOrderByCreatedAtDesc();
    
    @Query("SELECT p FROM Policy p WHERE p.uploadedBy.id = :userId ORDER BY p.createdAt DESC")
    List<Policy> findByUploadedByIdOrderByCreatedAtDesc(UUID userId);
}