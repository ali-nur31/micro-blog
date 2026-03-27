package com.social.backend.controller;

import com.social.backend.dto.AdminMetricsResponse;
import com.social.backend.repository.CommentRepository;
import com.social.backend.repository.PostRepository;
import com.social.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final UserRepository userRepository;
    private final PostRepository postRepository;
    private final CommentRepository commentRepository;

    @GetMapping("/metrics")
    public ResponseEntity<AdminMetricsResponse> getMetrics() {
        return ResponseEntity.ok(new AdminMetricsResponse(
                userRepository.count(),
                postRepository.count(),
                commentRepository.count()
        ));
    }

    @GetMapping("/activity")
    public ResponseEntity<List<Map<String, Object>>> getActivity() {
        LocalDateTime sevenDaysAgo = LocalDateTime.now().minusDays(7);
        
        Map<String, Long> activityMap = postRepository.findAll().stream()
                .filter(p -> p.getCreatedAt().isAfter(sevenDaysAgo))
                .collect(Collectors.groupingBy(
                        p -> p.getCreatedAt().toLocalDate().toString(),
                        Collectors.counting()
                ));
        
        List<Map<String, Object>> result = new ArrayList<>();
        LocalDate current = LocalDate.now().minusDays(6);
        for (int i = 0; i < 7; i++) {
            String dateStr = current.toString();
            Map<String, Object> point = new HashMap<>();
            point.put("date", dateStr);
            point.put("count", activityMap.getOrDefault(dateStr, 0L));
            result.add(point);
            current = current.plusDays(1);
        }
        return ResponseEntity.ok(result);
    }
}
