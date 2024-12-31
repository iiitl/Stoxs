package com.spring.demo.stoxsBackend.Controller;

import com.spring.demo.stoxsBackend.Entity.Stock;
import com.spring.demo.stoxsBackend.Services.PortfolioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
@CrossOrigin("*")
@RestController
@RequestMapping("/api/portfolio")
public class PortfolioController {

    @Autowired
    private PortfolioService portfolioService;

    @GetMapping("/total-value")
    public double getTotalPortfolioValue() {
        return portfolioService.getTotalPortfolioValue();
    }

    @GetMapping("/top-performing")
    public Stock getTopPerformingStock() {
        return portfolioService.getTopPerformingStock();
    }

    @GetMapping("/distribution")
    public Map<String, Double> getPortfolioDistribution() {
        return portfolioService.getPortfolioDistribution();
    }
}