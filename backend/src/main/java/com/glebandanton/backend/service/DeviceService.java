package com.glebandanton.backend.service;

import com.glebandanton.backend.model.Device;
import com.glebandanton.backend.repository.DeviceRepo;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class DeviceService {
    private final DeviceRepo deviceRepo;

    public List<Device> readAllDevices(){
        return deviceRepo.findAll();
    }
}
