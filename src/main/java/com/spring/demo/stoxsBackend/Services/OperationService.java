package com.spring.demo.stoxsBackend.Services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.spring.demo.stoxsBackend.Entity.Stock;
import com.spring.demo.stoxsBackend.Repository.StockRepository;

import java.util.List;

@Service
public class OperationService {
    @Autowired
    private StockRepository stockRepository;

    public List<Stock> getAllStocks() {
        return stockRepository.findAll();
    }

    public Stock getStockById(Long id) {
        return stockRepository.findById(id).orElse(null);
    }

    public Stock saveStock(Stock stock) {
        return stockRepository.save(stock);
    }

    public Stock updateStock(Stock stock) {
        return stockRepository.save(stock);
    }

    public void deleteStock(Long id) {
        stockRepository.deleteById(id);
    }


}