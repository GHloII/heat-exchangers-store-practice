package com.glebandanton.practic.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Paths;

@Configuration
public class WebConfig implements WebMvcConfigurer {

//    @Override
//    public void addResourceHandlers(ResourceHandlerRegistry registry) {
//        // Абсолютный путь до папки frontend
//        String frontendPath = Paths.get("../../frontend/").toAbsolutePath().toUri().toString();
//
//        registry.addResourceHandler("/**")
//                .addResourceLocations(frontendPath);
//    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // frontend/ находится на уровень выше backend/practic
        String frontendPath = Paths.get("frontend/").toAbsolutePath().toUri().toString();

        registry.addResourceHandler("/**")
                .addResourceLocations(frontendPath);
    }
}



