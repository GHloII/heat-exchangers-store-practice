package com.glebandanton.practic.controller;

import com.glebandanton.practic.model.Device;
import com.glebandanton.practic.service.DeviceService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

@AllArgsConstructor
@Controller
public class DeviceController {
    private final DeviceService deviceService;

    @GetMapping("/")
    public String index() {
        return "redirect:/index.html";
    }
}
//    @GetMapping("/")
//    public ResponseEntity<List<Device>> readAllDevices() {
//        return new ResponseEntity<>(deviceService.readAllDevices(), HttpStatus.OK);
//    }
