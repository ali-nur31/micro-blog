package com.social.backend.dto;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessageDTO {
    private String senderUsername;
    private String recipientUsername;
    private String content;
    private LocalDateTime timestamp;
}
