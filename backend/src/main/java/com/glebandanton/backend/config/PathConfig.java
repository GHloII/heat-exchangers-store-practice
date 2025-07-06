package com.glebandanton.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Paths;

@Configuration
public class PathConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {

        String frontendPath = Paths.get("frontend/").toAbsolutePath().toUri().toString();

        registry.addResourceHandler("/**")
                .addResourceLocations(frontendPath);
    }
}