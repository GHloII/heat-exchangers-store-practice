package com.glebandanton.backend.specification;

import com.glebandanton.backend.request.DeviceFilterRequest;
import com.glebandanton.backend.model.Device;
import org.springframework.data.jpa.domain.Specification;
import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;

public class DeviceSpecifications {

    public static Specification<Device> withFilter(DeviceFilterRequest filter) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (filter != null) {

                // Фильтр по производителям
                if (filter.getManufacturers() != null && !filter.getManufacturers().isEmpty()) {
                    predicates.add(root.get("manufacturer").in(filter.getManufacturers()));
                }

                // Фильтр по цене
                if (filter.getPriceRange() != null) {
                    if (filter.getPriceRange().getMin() != null) {
                        predicates.add(cb.greaterThanOrEqualTo(root.get("price"), filter.getPriceRange().getMin()));
                    }
                    if (filter.getPriceRange().getMax() != null) {
                        predicates.add(cb.lessThanOrEqualTo(root.get("price"), filter.getPriceRange().getMax()));
                    }
                }

                // Фильтр по диаметру
                if (filter.getDiameterRange() != null) {
                    if (filter.getDiameterRange().getMin() != null) {
                        predicates.add(cb.greaterThanOrEqualTo(root.get("diameter"), filter.getDiameterRange().getMin()));
                    }
                    if (filter.getDiameterRange().getMax() != null) {
                        predicates.add(cb.lessThanOrEqualTo(root.get("diameter"), filter.getDiameterRange().getMax()));
                    }
                }

                // Фильтр по рабочему давлению
                if (filter.getWorkingPressureRange() != null) {
                    System.out.println("Applying working pressure filter"); // Логирование

                    if (filter.getWorkingPressureRange().getMin() != null) {
                        System.out.println("Min pressure: " + filter.getWorkingPressureRange().getMin());
                        predicates.add(cb.greaterThanOrEqualTo(root.get("working_pressure"),
                                filter.getWorkingPressureRange().getMin()));
                    }
                    if (filter.getWorkingPressureRange().getMax() != null) {
                        System.out.println("Max pressure: " + filter.getWorkingPressureRange().getMax());
                        predicates.add(cb.lessThanOrEqualTo(root.get("working_pressure"),
                                filter.getWorkingPressureRange().getMax()));
                    }
                }

                // Фильтр по температуре
                if (filter.getTemperatureRange() != null) {
                    if (filter.getTemperatureRange().getMin() != null) {
                        predicates.add(cb.greaterThanOrEqualTo(root.get("min_temp"), filter.getTemperatureRange().getMin()));
                    }
                    if (filter.getTemperatureRange().getMax() != null) {
                        predicates.add(cb.lessThanOrEqualTo(root.get("max_temp"), filter.getTemperatureRange().getMax()));
                    }
                }
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
