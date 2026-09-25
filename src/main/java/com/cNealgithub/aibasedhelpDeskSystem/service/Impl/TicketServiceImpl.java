package com.cNealgithub.aibasedhelpDeskSystem.service.Impl;

import com.cNealgithub.aibasedhelpDeskSystem.entity.Ticket;
import com.cNealgithub.aibasedhelpDeskSystem.entity.type.PriorityType;
import com.cNealgithub.aibasedhelpDeskSystem.repository.TicketsRepo;
import com.cNealgithub.aibasedhelpDeskSystem.service.TicketService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Map;

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

    @Override
    @Transactional
    public Ticket updateExistingTicket(Long id, Map<String, Object> updates) {
//        finding the ticket by id
        Ticket existingTicket = ticketsRepo.findById(id)
                .orElseThrow(()-> new IllegalArgumentException("Ticket does not exist with id: " + id));
        updates.forEach((field, value) ->{
//            adding null check
            if(value == null){
                return ;
            }
            switch (field) {
                case "issue_summary" :
                    existingTicket.setIssue_summary((String) value);
                    break;
                case "category" :
                    existingTicket.setCategory((String) value);
                    break;
                case "priority" :
                    existingTicket.setPriority((PriorityType) value);
                    break;
                case "email" :
                    existingTicket.setEmail((String) value);
                    break;
                default:
                    throw new IllegalArgumentException("wrong or mismatched field provided for updates: " + field);
            }
        });
        existingTicket.setUpdatedAt(LocalDateTime.now());
        return ticketsRepo.save(existingTicket);
    }
}
