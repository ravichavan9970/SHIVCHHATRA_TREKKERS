package com.shivchhatra;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ShivchhatraApplication {

    public static void main(String[] args) {
        SpringApplication.run(ShivchhatraApplication.class, args);
        System.out.println("==================================================================");
        System.out.println("🚩 SHIVCHHATRA TREKKERS ENTERPRISE BACKEND SERVER STARTED ON PORT 8080");
        System.out.println("💾 Database: H2 Disk Persistence (./data/shivchhatradb)");
        System.out.println("🌐 REST API Base: http://localhost:8080/api");
        System.out.println("🔍 H2 Web Console: http://localhost:8080/h2-console");
        System.out.println("==================================================================");
    }
}
