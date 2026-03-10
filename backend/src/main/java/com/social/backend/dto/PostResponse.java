package com.social.backend.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class PostResponse {
    private Long id;
    private String content;
    private LocalDateTime createdAt;
    private String username;
}
