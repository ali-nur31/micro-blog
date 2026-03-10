package com.social.backend.service;

import com.social.backend.dto.PostRequest;
import com.social.backend.dto.PostResponse;
import com.social.backend.model.Post;
import com.social.backend.model.User;
import com.social.backend.repository.PostRepository;
import com.social.backend.repository.UserRepository;
import com.social.backend.util.HtmlSanitizer;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final HtmlSanitizer htmlSanitizer;

    public List<PostResponse> getAllPosts() {
        return postRepository.findAllByOrderByCreatedAtDesc().stream().map(post -> {
            PostResponse response = new PostResponse();
            response.setId(post.getId());
            response.setContent(post.getContent());
            response.setCreatedAt(post.getCreatedAt());
            response.setUsername(post.getUser().getUsername());
            return response;
        }).collect(Collectors.toList());
    }

    public PostResponse createPost(PostRequest request, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        String sanitizedContent = htmlSanitizer.sanitize(request.getContent());

        Post post = new Post();
        post.setContent(sanitizedContent);
        post.setUser(user);
        post = postRepository.save(post);

        PostResponse response = new PostResponse();
        response.setId(post.getId());
        response.setContent(post.getContent());
        response.setCreatedAt(post.getCreatedAt());
        response.setUsername(post.getUser().getUsername());
        return response;
    }

    public PostResponse updatePost(Long id, PostRequest request, String username) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Post not found"));
        if (!post.getUser().getUsername().equals(username)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Unauthorized");
        }
        String sanitizedContent = htmlSanitizer.sanitize(request.getContent());
        post.setContent(sanitizedContent);
        post = postRepository.save(post);

        PostResponse response = new PostResponse();
        response.setId(post.getId());
        response.setContent(post.getContent());
        response.setCreatedAt(post.getCreatedAt());
        response.setUsername(post.getUser().getUsername());
        return response;
    }

    public void deletePost(Long id, String username) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Post not found"));
        if (!post.getUser().getUsername().equals(username)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Unauthorized");
        }
        postRepository.delete(post);
    }
}
