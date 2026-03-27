package com.social.backend.controller;

import com.social.backend.dto.ChatMessageDTO;
import com.social.backend.dto.ConversationDTO;
import com.social.backend.model.ChatMessage;
import com.social.backend.repository.ChatMessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
public class ChatController {

    private final ChatMessageRepository chatMessageRepository;
    private final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/chat.private")
    public void sendPrivateMessage(@Payload ChatMessageDTO chatMessageDTO, Principal principal) {
        ChatMessage message = new ChatMessage();
        message.setSenderUsername(principal.getName());
        message.setRecipientUsername(chatMessageDTO.getRecipientUsername());
        String cleanContent = chatMessageDTO.getContent().replace("<", "&lt;").replace(">", "&gt;");
        message.setContent(cleanContent);
        message = chatMessageRepository.save(message);

        ChatMessageDTO response = new ChatMessageDTO(message.getSenderUsername(), message.getRecipientUsername(), message.getContent(), message.getTimestamp());
        messagingTemplate.convertAndSendToUser(message.getRecipientUsername(), "/queue/messages", response);
        messagingTemplate.convertAndSendToUser(message.getSenderUsername(), "/queue/messages", response);
    }

    @GetMapping("/api/chat/history/{targetUser}")
    public ResponseEntity<List<ChatMessageDTO>> getChatHistory(@PathVariable String targetUser, Principal principal) {
        List<ChatMessage> messages = chatMessageRepository.findConversation(principal.getName(), targetUser);
        Collections.reverse(messages);
        List<ChatMessageDTO> dtos = messages.stream()
                .map(m -> new ChatMessageDTO(m.getSenderUsername(), m.getRecipientUsername(), m.getContent(), m.getTimestamp()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/api/chat/conversations")
    public ResponseEntity<List<ConversationDTO>> getConversations(Principal principal) {
        String me = principal.getName();
        List<ChatMessage> messages = chatMessageRepository.findAllUserMessages(me);
        
        java.util.Map<String, ChatMessage> latestMap = new java.util.LinkedHashMap<>();
        for (ChatMessage m : messages) {
            String other = m.getSenderUsername().equals(me) ? m.getRecipientUsername() : m.getSenderUsername();
            latestMap.putIfAbsent(other, m);
        }
        
        List<ConversationDTO> convos = latestMap.entrySet().stream()
                .map(e -> new ConversationDTO(e.getKey(), e.getValue().getContent(), e.getValue().getTimestamp()))
                .collect(Collectors.toList());
                
        return ResponseEntity.ok(convos);
    }
}
