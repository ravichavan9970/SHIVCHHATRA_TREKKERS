package com.shivchhatra.repository;

import com.shivchhatra.model.GalleryImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GalleryImageRepository extends JpaRepository<GalleryImage, String> {
    List<GalleryImage> findAllByOrderByCreatedAtDesc();
}
