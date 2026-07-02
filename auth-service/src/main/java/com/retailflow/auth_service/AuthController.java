package com.retailflow.auth_service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/signup")
    public Map<String, Object> signup(@RequestBody User user) {
        Map<String, Object> response = new HashMap<>();
        if (userRepository.existsByEmailIgnoreCase(user.getEmail())) {
            response.put("success", false);
            response.put("message", "This email is already registered. Please proceed to login.");
            return response;
        }
        if (user.getRole() == null || user.getRole().isEmpty()) {
            user.setRole("CUSTOMER");
        }
        user.setEmail(user.getEmail().toLowerCase().trim());
        User saved = userRepository.save(user);
        response.put("success", true);
        response.put("id", saved.getId());
        response.put("name", saved.getName());
        response.put("email", saved.getEmail());
        response.put("role", saved.getRole());
        return response;
    }

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody User user) {
        Map<String, Object> response = new HashMap<>();
        String searchEmail = user.getEmail().toLowerCase().trim();
        var found = userRepository.findByEmailIgnoreCase(searchEmail);
        if (found.isPresent() && found.get().getPassword().equals(user.getPassword())) {
            User u = found.get();
            response.put("success", true);
            response.put("id", u.getId());
            response.put("name", u.getName());
            response.put("email", u.getEmail());
            response.put("role", u.getRole());
            return response;
        }
        response.put("success", false);
        response.put("message", "Access Denied: Account not found or password incorrect. Please signup first!");
        return response;
    }

    @PostMapping("/admin/create")
    public Map<String, Object> createAdmin(@RequestBody User user) {
        Map<String, Object> response = new HashMap<>();
        if (userRepository.existsByEmailIgnoreCase(user.getEmail())) {
            response.put("success", false);
            response.put("message", "Email already registered!");
            return response;
        }
        user.setRole("ADMIN");
        user.setEmail(user.getEmail().toLowerCase().trim());
        User saved = userRepository.save(user);
        response.put("success", true);
        response.put("id", saved.getId());
        response.put("name", saved.getName());
        response.put("email", saved.getEmail());
        response.put("role", saved.getRole());
        return response;
    }

    @GetMapping("/user/{email}")
    public Map<String, Object> getUserByEmail(@PathVariable String email) {
        Map<String, Object> response = new HashMap<>();
        var found = userRepository.findByEmailIgnoreCase(email);
        if (found.isPresent()) {
            User u = found.get();
            response.put("success", true);
            response.put("id", u.getId());
            response.put("name", u.getName());
            response.put("email", u.getEmail());
            response.put("role", u.getRole());
        } else {
            response.put("success", false);
            response.put("message", "User not found!");
        }
        return response;
    }
}