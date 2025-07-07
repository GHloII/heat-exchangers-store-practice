package com.glebandanton.backend.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "heat_exchangers_devices")
public class Device {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonProperty("id")
    private Long device_id;
    
    @JsonProperty("name")
    private String name;
    
    @JsonProperty("image_path")
    private String image_path;
    
    @JsonProperty("manufacturer")
    private String manufacturer;
    
    @JsonProperty("price")
    private double price;
    
    @JsonProperty("weight")
    private double weight;
    
    @JsonProperty("diameter")
    private double diameter;
    
    @JsonProperty("working_pressure")
    private double working_pressure;
    
    @JsonProperty("min_temp")
    private double min_temp;
    
    @JsonProperty("max_temp")
    private double max_temp;
}
