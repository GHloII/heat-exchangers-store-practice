package com.glebandanton.backend.request;

import lombok.Data;
import java.util.List;

@Data
public class DeviceFilterRequest {
    private List<String> manufacturers;
    private Range priceRange;
    private Range weightRange;
    private Range diameterRange;
    private Range workingPressureRange;
    private Range temperatureRange;

    @Data
    public static class Range {
        private Double min;
        private Double max;
    }
}