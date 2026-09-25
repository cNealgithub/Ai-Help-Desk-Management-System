package com.cNealgithub.aibasedhelpDeskSystem.tools;

import com.cNealgithub.aibasedhelpDeskSystem.entity.Ticket;
import com.cNealgithub.aibasedhelpDeskSystem.service.TicketService;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.tool.annotation.Tool;
import org.springframework.ai.tool.annotation.ToolParam;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
@RequiredArgsConstructor
public class TicketDbTools {

    private final TicketService ticketService;

    @Tool(description = "Tool for creating and saving new ticket to database")
    public Ticket createAndSave(@ToolParam(description = "Ticket fields information required to create new ticket(object)") Ticket ticket) {
        try{
            System.out.println("Going to create new ticket");
            System.out.println(ticket);
            return ticketService.saveTicket(ticket);
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage());
        }
    }

    @Tool(description = "Tool to find the Ticket by email[email] from the database")
    public Ticket getTicketFromEmail(@ToolParam(description = "the email of the user whom the ticket belongs") String email) {
        return ticketService.getTicketByEmail(email);
    }

    @Tool(description = "Tool to find the Ticket by TicketId[id] from the database")
    public Ticket getTicketFromId(@ToolParam(description = "the unique identity (id) of the ticket") Long id) {
        return ticketService.getTicketById(id);
    }

    @Tool(description = "Tool to update existing Ticket in database")
    public Ticket updateExistintTicket(@ToolParam(description = "The unique identity(id) of thr Ticket") Long id,
                                       @ToolParam(description = "The map(java map collection) of updates consisting 'field' and 'object' as target update's field and value respectively")Map<String, Object> updates) {
        return ticketService.updateExistingTicket(id, updates);
    }
}
