package com.cNealgithub.aibasedhelpDeskSystem.service.Impl;

import com.cNealgithub.aibasedhelpDeskSystem.entity.Ticket;
import com.cNealgithub.aibasedhelpDeskSystem.repository.TicketsRepo;
import com.cNealgithub.aibasedhelpDeskSystem.service.TicketService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TicketServiceImpl implements TicketService {

    private final TicketsRepo ticketsRepo;

    @Override
    @Transactional
    public Ticket saveTicket(Ticket ticket) {
        // the llm can generate ticketId , which our JPA dose not need as we use auto generation, so i am doing this:-
        ticket.setId(null);
        return ticketsRepo.save(ticket);
    }

    @Override
    public Ticket getTicketByUsername(String username) {
        return ticketsRepo.findByUsername(username)
                .orElseThrow(()-> new IllegalArgumentException("Ticket not found with username: " + username));
    }

    @Override
    public Ticket getTicketById(Long id) {
        return ticketsRepo.findById(id)
                .orElseThrow(()-> new IllegalArgumentException("Ticket nt found wit id: " + id));
    }
}
