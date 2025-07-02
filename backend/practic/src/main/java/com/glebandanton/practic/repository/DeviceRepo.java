package com.glebandanton.practic.repository;

import com.glebandanton.practic.model.Device;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DeviceRepo extends JpaRepository<Device, Long> { }
