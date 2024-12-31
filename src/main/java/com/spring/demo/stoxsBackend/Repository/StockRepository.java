package com.spring.demo.stoxsBackend.Repository;

import com.spring.demo.stoxsBackend.Entity.Stock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StockRepository extends JpaRepository<Stock, Long> {}