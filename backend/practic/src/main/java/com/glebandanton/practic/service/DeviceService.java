package com.glebandanton.practic.service;

import com.glebandanton.practic.model.Device;
import com.glebandanton.practic.repository.DeviceRepo;
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
