package com.glebandanton.backend.controller;

import com.glebandanton.backend.model.Device;
import com.glebandanton.backend.service.DeviceService;
import lombok.Data;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@Data
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class DeviceController {
    private final DeviceService deviceService;

    @GetMapping("/products")
    public ResponseEntity<?> getAllProducts() {
        System.out.println("=== GET ALL PRODUCTS REQUEST RECEIVED ===");
        try {
            List<Device> devices = deviceService.readAllDevices();
            System.out.println("Found " + devices.size() + " devices");
            
            // Логируем данные каждого устройства
            for (Device device : devices) {
                System.out.println("Device: " + device.getName() + 
                                 ", Image: " + device.getImage_path() + 
                                 ", Price: " + device.getPrice());
            }
            
            return ResponseEntity.ok(devices);
        } catch (Exception e){
            System.out.println("Error getting devices: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error to get devices" + e.getMessage());
        }
    }

    @PostMapping("/products")
    public ResponseEntity<?> getAllProductsPost() {
        System.out.println("=== POST ALL PRODUCTS REQUEST RECEIVED ===");
        try {
            List<Device> devices = deviceService.readAllDevices();
            System.out.println("Found " + devices.size() + " devices");
            return ResponseEntity.ok(devices);
        } catch (Exception e){
            System.out.println("Error getting devices: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error to get devices" + e.getMessage());
        }
    }

    @PostMapping("/products/filter")
    public ResponseEntity<?> getFilteredProducts(@RequestBody Map<String, Object> filters) {
        System.out.println("=== FILTER PRODUCTS REQUEST RECEIVED ===");
        System.out.println("Filters: " + filters);
        try {
            List<Device> devices = deviceService.readAllDevices(); // Пока возвращаем все товары
            System.out.println("Found " + devices.size() + " devices after filtering");
            return ResponseEntity.ok(devices);
        } catch (Exception e){
            System.out.println("Error getting filtered devices: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error to get filtered devices" + e.getMessage());
        }
    }
}