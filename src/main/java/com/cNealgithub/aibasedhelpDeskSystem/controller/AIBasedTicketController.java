package com.cNealgithub.aibasedhelpDeskSystem.controller;

import com.cNealgithub.aibasedhelpDeskSystem.service.AiService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;

@RestController
@RequestMapping("/helpDesk")
@RequiredArgsConstructor
public class AIBasedTicketController {

    private final AiService aiService;

    @PostMapping("/aiChat")
    public ResponseEntity<Flux<String>> aiChat(@RequestBody String uQuery,
                                               @RequestHeader("conversationId") String chatId) {
        try{
            return ResponseEntity.ok(aiService.chat(uQuery, chatId));
        } catch (Exception e) {
            throw new RuntimeException("Exception in aiChat: " + e.getMessage());
        }
    }
}
