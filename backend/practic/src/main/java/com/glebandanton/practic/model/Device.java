package com.glebandanton.practic.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Table(name = "heat_exchangers")
public class Device {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String image_path;
    private String manufacturer;
    private double price;
    private double weight;
    private double diameter;
    private double working_pressure;
    private double min_temp;
    private double max_temp;
}
