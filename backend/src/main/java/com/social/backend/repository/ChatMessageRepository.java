package com.social.backend.repository;

import com.social.backend.model.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    
    @Query("SELECT m FROM ChatMessage m WHERE (m.senderUsername = :u1 AND m.recipientUsername = :u2) OR (m.senderUsername = :u2 AND m.recipientUsername = :u1) ORDER BY m.timestamp DESC")
    List<ChatMessage> findConversation(@Param("u1") String u1, @Param("u2") String u2);
    @Query("SELECT m FROM ChatMessage m WHERE m.senderUsername = :u OR m.recipientUsername = :u ORDER BY m.timestamp DESC")
    List<ChatMessage> findAllUserMessages(@Param("u") String u);
}
