package com.company.policymanagement.dto;

import com.company.policymanagement.entity.Policy;

import java.time.LocalDateTime;
import java.util.UUID;

public class PolicyResponse {
    
    private UUID id;
    private String title;
    private String description;
    private String fileName;
    private String fileType;
    private Long fileSize;
    private String uploadedBy;
    private LocalDateTime createdAt;

    // Constructors
    public PolicyResponse() {}

    public PolicyResponse(Policy policy) {
        this.id = policy.getId();
        this.title = policy.getTitle();
        this.description = policy.getDescription();
        this.fileName = policy.getFileName();
        this.fileType = policy.getFileType();
        this.fileSize = policy.getFileSize();
        this.uploadedBy = policy.getUploadedBy().getEmployeeId();
        this.createdAt = policy.getCreatedAt();
    }

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getFileType() {
        return fileType;
    }

    public void setFileType(String fileType) {
        this.fileType = fileType;
    }

    public Long getFileSize() {
        return fileSize;
    }

    public void setFileSize(Long fileSize) {
        this.fileSize = fileSize;
    }

    public String getUploadedBy() {
        return uploadedBy;
    }

    public void setUploadedBy(String uploadedBy) {
        this.uploadedBy = uploadedBy;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}