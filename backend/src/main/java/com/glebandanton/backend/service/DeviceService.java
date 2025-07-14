package com.glebandanton.backend.service;

import com.glebandanton.backend.model.Device;
import com.glebandanton.backend.repository.DeviceRepo;
import com.glebandanton.backend.request.DeviceFilterRequest;
import com.glebandanton.backend.specification.DeviceSpecifications;
import lombok.AllArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class DeviceService {
    private final DeviceRepo deviceRepo;

    public Optional<Device> findById(Long id) {
        return deviceRepo.findById(id);
    }

    public List<Device> readAllDevices(){
        return deviceRepo.findAll();
    }

    public Device saveDevice(Device device) {
        return deviceRepo.save(device);
    }

    public List<Device> searchDevicesByName(String name) {
        if (name == null || name.isBlank()) {
            return Collections.emptyList();
        }
        return deviceRepo.findByNameContainingIgnoreCase(name);
    }

    public List<Device> filterDevices(DeviceFilterRequest filter) {
        Specification<Device> spec = DeviceSpecifications.withFilter(filter);
        return deviceRepo.findAll(spec);
    }

    public Device updateDevice(Device device) {
        if (deviceRepo.existsById(device.getDevice_id())) {
            return deviceRepo.save(device);
        } else {
            throw new RuntimeException("Device not found with id: " + device.getDevice_id());
        }
    }

    public void deleteDevice(Long id) {
        if (deviceRepo.existsById(id)) {
            deviceRepo.deleteById(id);
        } else {
            throw new RuntimeException("Device not found with id: " + id);
        }
    }

    public Optional<Device> readDeviceById(Long id) {
        return deviceRepo.findById(id);
    }
}
