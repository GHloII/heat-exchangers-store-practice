package com.glebandanton.backend.controller;

import com.glebandanton.backend.model.Device;
import com.glebandanton.backend.service.DeviceService;
import lombok.Data;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Data
@RestController
@RequestMapping("/api")
public class DeviceController {
    private final DeviceService deviceService;

    @PostMapping("/products")
    public ResponseEntity<?> getAllProducts() {
        try {
            List<Device> devices = deviceService.readAllDevices();
            return ResponseEntity.ok(devices);
        } catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error to get devices" + e.getMessage());
        }
    }
}