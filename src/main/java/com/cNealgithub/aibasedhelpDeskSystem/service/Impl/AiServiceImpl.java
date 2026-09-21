package com.cNealgithub.aibasedhelpDeskSystem.service.Impl;

import com.cNealgithub.aibasedhelpDeskSystem.service.AiService;
import com.cNealgithub.aibasedhelpDeskSystem.tools.TicketDbTools;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Flux;

@Service
@RequiredArgsConstructor
public class AiServiceImpl implements AiService {

    private final ChatClient chatClient;
    @Value("classpath:helpdesk-system.st")
    private Resource systemPromptResource;
    private final TicketDbTools ticketDbTools;

    @Override
    @Transactional
    public Flux<String> chat(String uQuery, String chatId) {
        return chatClient
                .prompt()
                .tools(ticketDbTools)
                .system(systemPromptResource)
                .user(uQuery)
                .system("you are an nice assistant who greets and explains heartily")
                .advisors(advisorSpec -> advisorSpec.param(ChatMemory.CONVERSATION_ID, chatId))
                .stream().content()
                .contextWrite(context -> context.put("chat_memory_conversation_id", chatId));
    }
}
