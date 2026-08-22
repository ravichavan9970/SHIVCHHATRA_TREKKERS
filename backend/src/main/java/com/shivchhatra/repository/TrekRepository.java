package com.shivchhatra.repository;

import com.shivchhatra.model.Trek;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TrekRepository extends JpaRepository<Trek, String> {
}
