package com.retailflow.alert_service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
@RestController
@RequestMapping("/alerts")
public class AlertController {

    @Autowired
    private AlertRepository alertRepository;

    @PostMapping("/create")
    public Alert createAlert(@RequestBody Alert alert) {
        alert.setAcknowledged(false);
        alert.setResolved(false);
        alert.setTime(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
        return alertRepository.save(alert);
    }

    @GetMapping("/all")
    public List<Alert> getAllAlerts() {
        return alertRepository.findAll();
    }

    @GetMapping("/open")
    public List<Alert> getOpenAlerts() {
        return alertRepository.findByResolvedFalse();
    }

    @PutMapping("/{id}/acknowledge")
    public ResponseEntity<Alert> acknowledgeAlert(@PathVariable Long id) {
        return alertRepository.findById(id).map(alert -> {
            alert.setAcknowledged(true);
            return ResponseEntity.ok(alertRepository.save(alert));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/resolve")
    public ResponseEntity<Alert> resolveAlert(@PathVariable Long id) {
        return alertRepository.findById(id).map(alert -> {
            alert.setResolved(true);
            alert.setAcknowledged(true);
            return ResponseEntity.ok(alertRepository.save(alert));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAlert(@PathVariable Long id) {
        if (!alertRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        alertRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/stats/open-count")
    public Map<String, Object> getOpenCount() {
        return Map.of("openCount", alertRepository.countByResolvedFalse());
    }
}
