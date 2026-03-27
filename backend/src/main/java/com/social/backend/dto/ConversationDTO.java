package com.social.backend.dto;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ConversationDTO {
    private String username;
    private String lastMessage;
    private LocalDateTime timestamp;
}
