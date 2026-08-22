package com.shivchhatra.repository;

import com.shivchhatra.model.FortHeritage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FortHeritageRepository extends JpaRepository<FortHeritage, String> {
}
