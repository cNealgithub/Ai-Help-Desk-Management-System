package com.cNealgithub.aibasedhelpDeskSystem.service;

import com.cNealgithub.aibasedhelpDeskSystem.entity.Ticket;

import java.util.Map;

public interface TicketService{
    Ticket saveTicket(Ticket ticket);

    Ticket getTicketByEmail(String email);

    Ticket getTicketById(Long id);

    Ticket updateExistingTicket(Long id, Map<String, Object> updates);
}
