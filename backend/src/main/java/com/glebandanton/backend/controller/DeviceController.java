package com.glebandanton.backend.controller;

import com.glebandanton.backend.model.Device;
import com.glebandanton.backend.repository.DeviceRepo;
import com.glebandanton.backend.request.DeviceFilterRequest;
import com.glebandanton.backend.request.DeviceSearchRequest;
import com.glebandanton.backend.service.DeviceService;
import com.glebandanton.backend.specification.DeviceSpecifications;
import lombok.Data;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Data
@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
public class DeviceController {
    private final DeviceService deviceService;
    private final DeviceRepo deviceRepository;

    @GetMapping
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

    @PostMapping
    public ResponseEntity<?> getAllProductsPost () {
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

    @PostMapping("/filter")
    public ResponseEntity<List<Device>> filterDevices(@RequestBody DeviceFilterRequest filter) {
        Specification<Device> spec = DeviceSpecifications.withFilter(filter);
        List<Device> devices = deviceRepository.findAll(spec);
        return ResponseEntity.ok(devices);
    }

    @PostMapping("/search")
    public List<Device> searchDevices(@RequestBody DeviceSearchRequest request) {
        return deviceService.searchDevicesByName(request.getName());
    }
}