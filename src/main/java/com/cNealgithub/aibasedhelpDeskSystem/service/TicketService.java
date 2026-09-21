package com.cNealgithub.aibasedhelpDeskSystem.service;

import com.cNealgithub.aibasedhelpDeskSystem.entity.Ticket;

public interface TicketService{
    Ticket saveTicket(Ticket ticket);

    Ticket getTicketByEmail(String email);

    Ticket getTicketById(Long id);
}
