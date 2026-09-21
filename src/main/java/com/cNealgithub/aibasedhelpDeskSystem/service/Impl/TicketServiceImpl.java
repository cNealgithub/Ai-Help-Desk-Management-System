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
        // the llm can generate ticketId , which our JPA does not need as we use auto generation, so I am doing this:-
        ticket.setId(null);
        return ticketsRepo.save(ticket);
    }

    @Override
    public Ticket getTicketByEmail(String email) {
        return ticketsRepo.findByEmail(email)
                .orElseThrow(()-> new IllegalArgumentException("Ticket not found with username: " + email));
    }

    @Override
    public Ticket getTicketById(Long id) {
        return ticketsRepo.findById(id)
                .orElseThrow(()-> new IllegalArgumentException("Ticket nt found wit id: " + id));
    }
}
