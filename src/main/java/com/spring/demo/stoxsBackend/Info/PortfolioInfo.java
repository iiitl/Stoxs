package com.spring.demo.stoxsBackend.Info;

import com.spring.demo.stoxsBackend.Entity.Stock;

import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class PortfolioInfo {

    public static double calculateTotalPortfolioValue(List<Stock> stocks) {
        return stocks.stream()
                .mapToDouble(stock -> stock.getCurrentPrice() * stock.getQuantity())
                .sum();
    }

    public static Stock findTopPerformingStock(List<Stock> stocks) {
        return stocks.stream()
                .max(Comparator.comparingDouble(Stock::getCurrentPrice))
                .orElse(null);
    }

    public static Map<String, Double> calculatePortfolioDistribution(List<Stock> stocks) {
        double totalValue = calculateTotalPortfolioValue(stocks);
        return stocks.stream()
                .collect(Collectors.toMap(
                        Stock::getTicker,
                        stock -> (stock.getCurrentPrice() * stock.getQuantity()) / totalValue * 100
                ));
    }
}