package com.shivchhatra.repository;

import com.shivchhatra.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, String> {

    boolean existsByUtrNumberIgnoreCase(String utrNumber);

    List<Booking> findByTrekId(String trekId);

    List<Booking> findAllByOrderBySubmittedAtDesc();

    @Query("SELECT b FROM Booking b WHERE UPPER(b.id) = UPPER(:query) OR b.phone = :query OR b.phone LIKE %:query% OR UPPER(b.utrNumber) = UPPER(:query) ORDER BY b.submittedAt DESC")
    List<Booking> searchBooking(@Param("query") String query);
}
