package com.retailflow.auth_service;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class AuthServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(AuthServiceApplication.class, args);
	}

	@Bean
	CommandLineRunner seedDefaultAdmin(UserRepository userRepository) {
		return args -> {
			if (!userRepository.existsByEmailIgnoreCase("admin@retailflow.com")) {
				User admin = new User();
				admin.setName("Admin User");
				admin.setEmail("admin@retailflow.com");
				admin.setPassword("adminpassword123");
				admin.setRole("ADMIN");
				userRepository.save(admin);
			}
		};
	}

}
