
package com.spring.demo.stoxsBackend.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.spring.demo.stoxsBackend.Services.StockService;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/stocks")
public class StockController {

    @Autowired
    private StockService stockService;

    // Get Stock Price by Symbol (includes everyday change data)
    @GetMapping("/{symbol}/price")
    public ResponseEntity<String> getStockPrice(@PathVariable String symbol) {
        try {
            String response = stockService.getStockPrice(symbol);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"Failed to fetch stock price.\"}");
        }
    }

    // Get Stock Statistics (or daily changes data)
    @GetMapping("/{symbol}/statistics")
    public ResponseEntity<String> getStockStatistics(@PathVariable String symbol) {
        try {
            String response = stockService.getStockPrice(symbol);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"Failed to fetch stock statistics.\"}");
        }
    }

    // Get Market Status (stock quote)
    @GetMapping("/{symbol}/market-status")
    public ResponseEntity<String> getMarketStatus(@PathVariable String symbol) {
        try {
            String response = stockService.getMarketStatus(symbol);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"Failed to fetch market status.\"}");
        }
    }

    // Get Market News for a specific company (or default companies if symbol is not provided)
    @GetMapping("/{symbol}/market-news")
    public ResponseEntity<String> getMarketNews(@PathVariable String symbol) {
        try {
            String response = stockService.getMarketNews(symbol);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"Failed to fetch market news.\"}");
        }
    }

    // Get Basic Financials for a specific company (or default companies if symbol is not provided)
    @GetMapping("/{symbol}/basic-financials")
    public ResponseEntity<String> getBasicFinancials(@PathVariable String symbol) {
        try {
            String response = stockService.getBasicFinancials(symbol);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"Failed to fetch basic financials.\"}");
        }
    }

    // Get Stock Suggestions (Optional, already included in StockService)
    @GetMapping("/suggestions/{symbol}")
    public ResponseEntity<String> getStockSuggestions(@PathVariable String symbol) {
        try {
            String response = stockService.getStockSuggestions(symbol);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"Failed to fetch stock suggestions.\"}");
        }
    }

    // Get Portfolio Metrics (Optional, if needed)
    @GetMapping("/metrics")
    public ResponseEntity<String> getPortfolioMetrics() {
        try {
            String response = stockService.getPortfolioMetrics();
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"Failed to fetch portfolio metrics.\"}");
        }
    }
}
