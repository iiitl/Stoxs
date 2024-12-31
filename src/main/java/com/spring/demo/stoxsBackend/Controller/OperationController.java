package com.spring.demo.stoxsBackend.Controller;

import com.spring.demo.stoxsBackend.Entity.Stock;
import com.spring.demo.stoxsBackend.Services.OperationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/stocks")
public class OperationController {
    @Autowired
    private OperationService operationService;

    @GetMapping
    public List<Stock> getAllStocks() {
        return operationService.getAllStocks();
    }

    @GetMapping("/{id}")
    public Stock getStockById(@PathVariable Long id) {
        return operationService.getStockById(id);
    }

    @PostMapping
    public Stock saveStock(@RequestBody Stock stock) {
        return operationService.saveStock(stock);
    }

    @PutMapping("/{id}")
    public Stock updateStock(@PathVariable Long id, @RequestBody Stock stock) {
        stock.setId(id);
        return operationService.updateStock(stock);
    }


    @DeleteMapping("/{id}")
    public void deleteStock(@PathVariable Long id) {
        operationService.deleteStock(id);
    }

    @GetMapping("/")
    public void welcome() {
        System.out.println("Welcome to the Portfolio Backend");
    }
}