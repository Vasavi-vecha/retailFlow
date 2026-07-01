package com.retailflow.order_service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
@RestController
@RequestMapping("/orders")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    @PostMapping("/place")
    public Order placeOrder(@RequestBody Order order) {
        order.setStatus("PLACED");
        order.setPriority(order.getQuantity() >= 2 ? "High" : "Medium");
        return orderRepository.save(order);
    }

    @GetMapping("/all")
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable Long id) {
        return orderRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/customer/{customerName}")
    public List<Order> getOrdersByCustomer(@PathVariable String customerName) {
        return orderRepository.findByCustomer(customerName);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Order> updateStatus(@PathVariable Long id, @RequestParam String status) {
        return orderRepository.findById(id).map(order -> {
            order.setStatus(status);
            return ResponseEntity.ok(orderRepository.save(order));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long id) {
        if (!orderRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        orderRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/stats/total")
    public Map<String, Object> getTotalOrders() {
        return Map.of("total", orderRepository.count());
    }

    @GetMapping("/stats/revenue")
    public Map<String, Object> getTotalRevenue() {
        double revenue = orderRepository.findAll().stream()
                .mapToDouble(Order::getTotalPrice)
                .sum();
        return Map.of("revenue", revenue);
    }
}
