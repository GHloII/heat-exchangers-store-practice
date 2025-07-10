package com.glebandanton.backend.controller;

import com.glebandanton.backend.model.Device;
import com.glebandanton.backend.service.DeviceService;
import lombok.Data;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Data
@RestController
@RequestMapping("/api/admin/products")
@CrossOrigin(origins = "*")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {
    private final DeviceService deviceService;

    // Добавление нового товара
    @PostMapping("/save_device")
    public ResponseEntity<?> addDevice(@RequestBody Device device) {
        try {
            System.out.println("=== ADMIN: ADDING NEW PRODUCT ===");
            Device savedDevice = deviceService.saveDevice(device);
            return ResponseEntity.ok(savedDevice);
        } catch (Exception e) {
            System.out.println("Error adding product: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error adding product: " + e.getMessage());
        }
    }

    // Обновление товара
    @PutMapping("/update_device/{id}")
    public ResponseEntity<?> updateProduct(@PathVariable Long id, @RequestBody Device device) {
        try {
            System.out.println("=== ADMIN: UPDATING PRODUCT " + id + " ===");
            device.setDevice_id(id);
            Device updatedDevice = deviceService.updateDevice(device);
            return ResponseEntity.ok(updatedDevice);
        } catch (Exception e) {
            System.out.println("Error updating product: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating product: " + e.getMessage());
        }
    }

    // Удаление товара
    @DeleteMapping("/delete_device/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        try {
            System.out.println("=== ADMIN: DELETING PRODUCT " + id + " ===");
            deviceService.deleteDevice(id);
            return ResponseEntity.ok("Product deleted successfully");
        } catch (Exception e) {
            System.out.println("Error deleting product: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error deleting product: " + e.getMessage());
        }
    }

    // Получение всех товаров (для админа)
    @GetMapping("/all_devices")
    public ResponseEntity<?> getAllProducts() {
        try {
            System.out.println("=== ADMIN: GETTING ALL PRODUCTS ===");

            List<Device> devices = deviceService.readAllDevices();

            System.out.println("Found " + devices.size() + " devices");

            return ResponseEntity.ok(devices);
        } catch (Exception e) {
            System.out.println("Error getting products: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error getting products: " + e.getMessage());
        }
    }
} 