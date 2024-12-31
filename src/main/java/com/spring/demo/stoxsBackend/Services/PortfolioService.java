package com.spring.demo.stoxsBackend.Services;

import com.spring.demo.stoxsBackend.Entity.Stock;
import com.spring.demo.stoxsBackend.Info.PortfolioInfo;
import com.spring.demo.stoxsBackend.Repository.StockRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class PortfolioService {

    @Autowired
    private StockRepository stockRepository;

    public double getTotalPortfolioValue() {
        List<Stock> stocks = stockRepository.findAll();
        return PortfolioInfo.calculateTotalPortfolioValue(stocks);
    }

    public Stock getTopPerformingStock() {
        List<Stock> stocks = stockRepository.findAll();
        return PortfolioInfo.findTopPerformingStock(stocks);
    }

    public Map<String, Double> getPortfolioDistribution() {
        List<Stock> stocks = stockRepository.findAll();
        return PortfolioInfo.calculatePortfolioDistribution(stocks);
    }
}