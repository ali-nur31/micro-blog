package com.social.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AdminMetricsResponse {
    private long totalUsers;
    private long totalPosts;
    private long totalComments;
}
