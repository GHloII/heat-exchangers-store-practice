package com.glebandanton.backend.controller;

import com.glebandanton.backend.model.Device;
import com.glebandanton.backend.service.DeviceService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/products")
@CrossOrigin(origins = "*")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminController {
    private static final Logger log = LoggerFactory.getLogger(AdminController.class);
    private final DeviceService deviceService;

    // Добавление нового товара
    @PostMapping("/save_device")
    public ResponseEntity<?> addDevice(@RequestBody Device device) {
        log.info("=== ADMIN: ADDING NEW PRODUCT ===");
        log.debug("Request body: {}", device);
        try {
            Device savedDevice = deviceService.saveDevice(device);
            log.info("Successfully added product with id {}", savedDevice.getDevice_id());
            log.debug("Saved device details: {}", savedDevice);
            return ResponseEntity.ok(savedDevice);
        } catch (Exception e) {
            log.error("Error adding product: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error adding product: " + e.getMessage());
        }
    }

    // Обновление товара
    @PutMapping("/update_device/{id}")
    public ResponseEntity<?> updateProduct(@PathVariable Long id, @RequestBody Device device) {
        log.info("=== ADMIN: UPDATING PRODUCT {} ===", id);
        log.debug("Request body for update: {}", device);
        try {
            System.out.println("=== ADMIN: UPDATING PRODUCT " + id + " ===");
            device.setDevice_id(id);
            Device updatedDevice = deviceService.updateDevice(device);
            log.info("Successfully updated product {}", id);
            return ResponseEntity.ok(updatedDevice);
        } catch (Exception e) {
            log.error("Error updating product {}: {}", id, e.getMessage(), e);
            System.out.println("Error updating product: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating product: " + e.getMessage());
        }
    }

    // Удаление товара
    @DeleteMapping("/delete_device/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        log.info("=== ADMIN: DELETING PRODUCT {} ===", id);
        try {
            System.out.println("=== ADMIN: DELETING PRODUCT " + id + " ===");
            deviceService.deleteDevice(id);
            log.info("Successfully deleted product {}", id);
            return ResponseEntity.ok("Product deleted successfully");
        } catch (Exception e) {
            log.error("Error deleting product {}: {}", id, e.getMessage(), e);
            System.out.println("Error deleting product: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error deleting product: " + e.getMessage());
        }
    }

    // Получение всех товаров (для админа)
    @GetMapping("/all_devices")
    public ResponseEntity<?> getAllProducts() {
        log.info("=== ADMIN: GETTING ALL PRODUCTS ===");
        try {
            System.out.println("=== ADMIN: GETTING ALL PRODUCTS ===");

            List<Device> devices = deviceService.readAllDevices();

            log.info("Found {} devices", devices.size());
            System.out.println("Found " + devices.size() + " devices");

            return ResponseEntity.ok(devices);
        } catch (Exception e) {
            log.error("Error getting products: {}", e.getMessage(), e);
            System.out.println("Error getting products: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error getting products: " + e.getMessage());
        }
    }
} 