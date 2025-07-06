package com.glebandanton.backend.controller;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@AllArgsConstructor
@Controller
public class DeviceController {

    @GetMapping("/")
    public String index() {
        return "redirect:/index.html";
    }

}
//    @GetMapping("/")
//    public ResponseEntity<List<Device>> readAllDevices() {
//        return new ResponseEntity<>(deviceService.readAllDevices(), HttpStatus.OK);
//    }
