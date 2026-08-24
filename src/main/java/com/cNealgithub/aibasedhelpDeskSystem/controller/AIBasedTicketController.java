package com.cNealgithub.aibasedhelpDeskSystem.controller;

import com.cNealgithub.aibasedhelpDeskSystem.service.AiService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Flux;

@RestController
@RequestMapping("/helpDesk")
@RequiredArgsConstructor
public class AIBasedTicketController {

    private final AiService aiService;

    @GetMapping("/aiChat")
    public ResponseEntity<Flux<String>> aiChat(@RequestParam(name = "uQuery") String uQuery,
                                               @RequestParam(name = "chatId") String chatId) {
        try{
            return ResponseEntity.ok(aiService.chat(uQuery, chatId));
        } catch (Exception e) {
            throw new RuntimeException("Exception in aiChat: " + e.getMessage());
        }
    }
}
