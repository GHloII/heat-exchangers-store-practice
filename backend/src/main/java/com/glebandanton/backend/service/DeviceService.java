package com.glebandanton.backend.service;

import com.glebandanton.backend.model.Device;
import com.glebandanton.backend.repository.DeviceRepo;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class DeviceService {
    private final DeviceRepo deviceService;

    public List<Device> readAllDevices(){
        return deviceService.findAll();
    }

    public Device saveDevice(Device device) {
        return deviceService.save(device);
    }

    public Device updateDevice(Device device) {
        if (deviceService.existsById(device.getDevice_id())) {
            return deviceService.save(device);
        } else {
            throw new RuntimeException("Device not found with id: " + device.getDevice_id());
        }
    }

    public void deleteDevice(Long id) {
        if (deviceService.existsById(id)) {
            deviceService.deleteById(id);
        } else {
            throw new RuntimeException("Device not found with id: " + id);
        }
    }
}
