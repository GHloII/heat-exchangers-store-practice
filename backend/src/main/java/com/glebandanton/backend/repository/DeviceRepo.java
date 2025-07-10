package com.glebandanton.backend.repository;

import com.glebandanton.backend.model.Device;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DeviceRepo extends JpaRepository<Device, Long>, JpaSpecificationExecutor<Device> {
    List<Device> findByNameContainingIgnoreCase(String namePart);
}
