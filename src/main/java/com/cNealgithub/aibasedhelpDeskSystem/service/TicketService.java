package com.cNealgithub.aibasedhelpDeskSystem.service;

import com.cNealgithub.aibasedhelpDeskSystem.entity.Ticket;

import java.util.Optional;

public interface TicketService{
    Ticket saveTicket(Ticket ticket);

    Ticket getTicketByUsername(String username);

    Ticket getTicketById(Long id);
}
