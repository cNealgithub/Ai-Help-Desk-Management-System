package com.cNealgithub.aibasedhelpDeskSystem.tools;

import com.cNealgithub.aibasedhelpDeskSystem.entity.Ticket;
import com.cNealgithub.aibasedhelpDeskSystem.service.TicketService;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.tool.annotation.Tool;
import org.springframework.ai.tool.annotation.ToolParam;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class TicketDbTools {

    private final TicketService ticketService;

    @Tool(description = "Tool for creating and saving new ticket to database")
    public Ticket createAndSave(@ToolParam(description = "Ticket fields information required to create new ticket(object)") Ticket ticket) {
        return ticketService.saveTicket(ticket);
    }

    @Tool(description = "Tool to find the Ticket by username from the database")
    public Ticket getTicketFromUsername(@ToolParam(description = "the username whom the ticket belongs") String username) {
        return ticketService.getTicketByUsername(username);
    }

    @Tool(description = "Tool to find the Ticket by TicketId[id] from the database")
    public Ticket getTicketFromId(@ToolParam(description = "the unique identity (id) of the ticket") Long id) {
        return ticketService.getTicketById(id);
    }
}
