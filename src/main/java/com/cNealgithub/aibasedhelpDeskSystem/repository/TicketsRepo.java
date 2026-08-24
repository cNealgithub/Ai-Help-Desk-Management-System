package com.cNealgithub.aibasedhelpDeskSystem.repository;

import com.cNealgithub.aibasedhelpDeskSystem.entity.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TicketsRepo extends JpaRepository<Ticket, Long> {

    Optional<Ticket> findById(Long id);
    Optional<Ticket> findByUsername(String username);
}
