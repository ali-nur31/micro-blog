package com.social.backend.controller;

import com.social.backend.dto.PostRequest;
import com.social.backend.dto.PostResponse;
import com.social.backend.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    @GetMapping
    public ResponseEntity<List<PostResponse>> getAllPosts() {
        return ResponseEntity.ok(postService.getAllPosts());
    }

    @PostMapping
    public ResponseEntity<PostResponse> createPost(@RequestBody PostRequest request, Authentication authentication) {
        String username = authentication.getName();
        return ResponseEntity.ok(postService.createPost(request, username));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PostResponse> updatePost(@PathVariable Long id, @RequestBody PostRequest request, Authentication authentication) {
        String username = authentication.getName();
        return ResponseEntity.ok(postService.updatePost(id, request, username));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable Long id, Authentication authentication) {
        String username = authentication.getName();
        postService.deletePost(id, username);
        return ResponseEntity.noContent().build();
    }
}
