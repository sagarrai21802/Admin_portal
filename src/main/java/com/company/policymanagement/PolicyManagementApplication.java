package com.company.policymanagement;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class PolicyManagementApplication {

    public static void main(String[] args) {
        SpringApplication.run(PolicyManagementApplication.class, args);
    }
}