package com.shivchhatra.repository;

import com.shivchhatra.model.PaymentConfig;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PaymentConfigRepository extends JpaRepository<PaymentConfig, String> {
}
