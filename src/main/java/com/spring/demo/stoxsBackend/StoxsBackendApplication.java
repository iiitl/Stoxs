package com.spring.demo.stoxsBackend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

@SpringBootApplication
@RestController
public class StoxsBackendApplication {

    public static void main(String[] args) {

        SpringApplication.run(StoxsBackendApplication.class, args);
    }

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }

    @GetMapping("")
    public String home() {
        return "Welcome to Portfolio Backend!";
    }
}
