package com.spring.demo.stoxsBackend.Services;

import com.google.common.util.concurrent.RateLimiter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

@Service
public class StockService {

    @Autowired
    private RestTemplate restTemplate;

    private final String FINNHUB_API_KEY = "ctpe581r01qqsrsajnogctpe581r01qqsrsajnp0"; // Replace with your Finnhub API key

    private final RateLimiter rateLimiter = RateLimiter.create(6.0); // 1 request per second
    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);

    public StockService() {
        scheduler.scheduleAtFixedRate(this::triggerScheduledTask, 0, 2, TimeUnit.SECONDS);
    }

    private void triggerScheduledTask() {
    }


    public String getStockPrice(String symbol) {
        return scheduleApiRequest(() -> {
            String url = String.format("https://finnhub.io/api/v1/quote?symbol=%s&token=%s", symbol, FINNHUB_API_KEY);
            return makeFinnhubApiRequest(url);
        });
    }

    public String getMarketStatus(String exchange) {
        return scheduleApiRequest(() -> {
            String url = String.format("https://finnhub.io/api/v1/stock/market-status?exchange=%s&token=%s", exchange, FINNHUB_API_KEY);
            return makeFinnhubApiRequest(url);
        });
    }

    public String getMarketNews(String symbol) {
        return scheduleApiRequest(() -> {
            String url;
            if (symbol != null && !symbol.isEmpty()) {
                url = String.format("https://finnhub.io/api/v1/news?category=general&token=%s", FINNHUB_API_KEY);
            } else {
                url = String.format("https://finnhub.io/api/v1/news?category=general&token=%s", FINNHUB_API_KEY);
            }
            return makeFinnhubApiRequest(url);
        });
    }

    public String getBasicFinancials(String symbol) {
        return scheduleApiRequest(() -> {
            String url;
            if (symbol != null && !symbol.isEmpty()) {
                url = String.format("https://finnhub.io/api/v1/stock/metric?symbol=%s&metric=all&token=%s", symbol, FINNHUB_API_KEY);
            } else {
                url = String.format("https://finnhub.io/api/v1/financials-reported?symbol=ITC.NS&token=%s", FINNHUB_API_KEY); // Example for ITC
            }
            return makeFinnhubApiRequest(url);
        });
    }

    public String getStockSuggestions(String symbol) {
        return scheduleApiRequest(() -> {
            String url = String.format("https://finnhub.io/api/v1/search?q=%s&token=%s", symbol, FINNHUB_API_KEY);
            return makeFinnhubApiRequest(url);
        });
    }

    public String getPortfolioMetrics() {
        return "{\"message\": \"Portfolio metrics calculation logic not implemented yet.\"}";
    }

    private String makeFinnhubApiRequest(String url) {
        try {
            System.out.println("Making API request to: " + url);

            HttpEntity<Void> entity = new HttpEntity<>(new HttpHeaders());
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);

            System.out.println("Response Status: " + response.getStatusCode());
            System.out.println("Response Body: " + response.getBody());

            return response.getBody();
        } catch (Exception e) {
            e.printStackTrace();
            return "{\"error\": \"An error occurred while making the API request.\"}";
        }
    }

    private String scheduleApiRequest(ApiRequestTask task) {
        if (rateLimiter.tryAcquire()) {
            return task.execute();
        } else {
            return "{\"error\": \"Rate limit exceeded. Please try again later.\"}";
        }
    }

    @FunctionalInterface
    private interface ApiRequestTask {
        String execute();
    }
}
