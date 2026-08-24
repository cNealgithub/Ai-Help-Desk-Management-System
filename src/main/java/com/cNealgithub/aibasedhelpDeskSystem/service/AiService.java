package com.cNealgithub.aibasedhelpDeskSystem.service;

import org.jspecify.annotations.Nullable;
import reactor.core.publisher.Flux;

public interface AiService {
    Flux<String> chat(String uQuery, String chatId);
}
