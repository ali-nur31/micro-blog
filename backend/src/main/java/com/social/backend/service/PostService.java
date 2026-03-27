package com.social.backend.service;

import com.social.backend.dto.CommentRequest;
import com.social.backend.dto.CommentResponse;
import com.social.backend.dto.PostRequest;
import com.social.backend.dto.PostResponse;
import com.social.backend.model.Comment;
import com.social.backend.model.Post;
import com.social.backend.model.User;
import com.social.backend.repository.CommentRepository;
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
    private final CommentRepository commentRepository;
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
        User requester = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        if (!post.getUser().getUsername().equals(username) && 
            requester.getRole() != com.social.backend.model.Role.ADMIN && 
            requester.getRole() != com.social.backend.model.Role.MANAGER) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Unauthorized");
        }
        postRepository.delete(post);
    }

    public List<CommentResponse> getComments(Long postId) {
        return commentRepository.findAllByPostIdOrderByCreatedAtAsc(postId).stream().map(comment -> {
            CommentResponse response = new CommentResponse();
            response.setId(comment.getId());
            response.setContent(comment.getContent());
            response.setCreatedAt(comment.getCreatedAt());
            response.setUsername(comment.getUser().getUsername());
            return response;
        }).collect(Collectors.toList());
    }

    public CommentResponse addComment(Long postId, CommentRequest request, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Post not found"));
        
        Comment comment = new Comment();
        comment.setContent(htmlSanitizer.sanitize(request.getContent()));
        comment.setUser(user);
        comment.setPost(post);
        comment = commentRepository.save(comment);

        CommentResponse response = new CommentResponse();
        response.setId(comment.getId());
        response.setContent(comment.getContent());
        response.setCreatedAt(comment.getCreatedAt());
        response.setUsername(comment.getUser().getUsername());
        return response;
    }

    public void deleteComment(Long commentId, String username) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Comment not found"));
        User requester = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        if (!comment.getUser().getUsername().equals(username) && 
            requester.getRole() != com.social.backend.model.Role.ADMIN && 
            requester.getRole() != com.social.backend.model.Role.MANAGER) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Unauthorized");
        }
        commentRepository.delete(comment);
    }
}
