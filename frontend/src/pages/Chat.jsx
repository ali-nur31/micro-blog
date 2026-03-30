import React, { useState, useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import api from '../api';
import { useAuth } from '../context/AuthContext';

function Chat() {
    const [messages, setMessages] = useState([]);
    const [conversations, setConversations] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [activeChat, setActiveChat] = useState('');
    const { token, username } = useAuth();
    const stompClient = useRef(null);
    const messagesEndRef = useRef(null);
    const activeChatRef = useRef(activeChat);

    useEffect(() => {
        fetchConversations();
        connectWebSocket();
        return () => {
            if (stompClient.current) {
                stompClient.current.deactivate();
            }
        };
    }, []);

    useEffect(() => {
        activeChatRef.current = activeChat;
        if (activeChat) {
            fetchHistory(activeChat);
        } else {
            setMessages([]);
        }
    }, [activeChat]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const fetchConversations = async () => {
        try {
            const res = await api.get('/chat/conversations', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setConversations(res.data);
        } catch (error) { }
    };

    const fetchHistory = async (targetUser) => {
        try {
            const res = await api.get(`/chat/history/${targetUser}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessages(res.data);
        } catch (error) { }
    };

    const updateConversationList = (msgPayload, isOutgoing) => {
        const otherUser = isOutgoing ? msgPayload.recipientUsername : msgPayload.senderUsername;
        setConversations(prev => {
            let filtered = prev.filter(c => c.username !== otherUser);
            const newConvo = {
                username: otherUser,
                lastMessage: msgPayload.content,
                timestamp: msgPayload.timestamp
            };
            return [newConvo, ...filtered];
        });
    };

    const connectWebSocket = () => {
        const wsUrl = import.meta.env.VITE_API_BASE_URL ? import.meta.env.VITE_API_BASE_URL.replace(/\/api\/?$/, '') + '/ws' : 'http://localhost:8080/ws';
        const socket = new SockJS(wsUrl);
        const client = new Client({
            webSocketFactory: () => socket,
            connectHeaders: { Authorization: `Bearer ${token}` },
            reconnectDelay: 5000,
            onConnect: () => {
                client.subscribe('/user/queue/messages', (msg) => {
                    const receivedMsg = JSON.parse(msg.body);
                    const isOutgoing = receivedMsg.senderUsername === username;
                    const otherUser = isOutgoing ? receivedMsg.recipientUsername : receivedMsg.senderUsername;

                    if (!isOutgoing) {
                        updateConversationList(receivedMsg, false);
                        const currentActive = activeChatRef.current;
                        if (otherUser === currentActive) {
                            setMessages(prev => [...prev, receivedMsg]);
                        }
                    }
                });
            }
        });
        client.activate();
        stompClient.current = client;
    };

    const handleSearch = async (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        if (query.trim().length > 0) {
            setIsSearching(true);
            try {
                const res = await api.get(`/users/search?query=${query}`);
                setSearchResults(res.data);
            } catch (err) {
            } finally {
                setIsSearching(false);
            }
        } else {
            setSearchResults([]);
            setIsSearching(false);
        }
    };

    const selectSearchUser = (targetUsername) => {
        setSearchQuery('');
        setSearchResults([]);
        setActiveChat(targetUsername);
        setConversations(prev => {
            if (!prev.find(c => c.username === targetUsername)) {
                return [{ username: targetUsername, lastMessage: 'New conversation...', timestamp: new Date().toISOString() }, ...prev];
            }
            return prev;
        });
    };

    const sendMessage = (e) => {
        e.preventDefault();
        if (newMessage.trim() && activeChat && stompClient.current?.connected) {
            const msgObj = {
                content: newMessage,
                recipientUsername: activeChat
            };
            stompClient.current.publish({
                destination: '/app/chat.private',
                body: JSON.stringify(msgObj)
            });

            const optimisticLocalMessage = {
                senderUsername: username,
                recipientUsername: activeChat,
                content: newMessage.replace(/</g, "&lt;").replace(/>/g, "&gt;"),
                timestamp: new Date().toISOString()
            };

            setMessages(prev => [...prev, optimisticLocalMessage]);
            updateConversationList(optimisticLocalMessage, true);
            setNewMessage('');
        }
    };

    return (
        <div className="container animate-fade-in" style={{ display: 'flex', height: '85vh', gap: '20px' }}>
            <div className="glass" style={{ width: '30%', display: 'flex', flexDirection: 'column', padding: '20px', overflow: 'hidden' }}>
                <h3 style={{ marginBottom: '15px' }}>Conversations</h3>
                <div style={{ position: 'relative', marginBottom: '15px' }}>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearch}
                        placeholder="Search username to chat..."
                        className="input-field"
                        style={{ width: '100%', marginBottom: 0, padding: '8px' }}
                    />
                    {searchQuery.trim().length > 0 && (
                        <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, backgroundColor: '#1f2937', border: '1px solid #374151', boxShadow: '0 8px 16px rgba(0,0,0,0.5)', borderRadius: '0 0 8px 8px', zIndex: 50, maxHeight: '200px', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
                            {isSearching ? (
                                <div style={{ padding: '10px', textAlign: 'center', color: '#9ca3af', fontSize: '0.9rem' }}>Searching...</div>
                            ) : searchResults.length > 0 ? (
                                searchResults.map(u => (
                                    <div
                                        key={u.id}
                                        onClick={() => selectSearchUser(u.username)}
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#374151'}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                        style={{ padding: '8px 12px', cursor: 'pointer', borderBottom: '1px solid #374151', transition: 'background-color 0.2s', lineHeight: '1.5', width: '100%', boxSizing: 'border-box', color: '#f3f4f6' }}
                                    >
                                        @{u.username}
                                    </div>
                                ))
                            ) : (
                                <div style={{ padding: '10px', textAlign: 'center', color: '#9ca3af', fontSize: '0.9rem' }}>User not found</div>
                            )}
                        </div>
                    )}
                </div>
                <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', paddingRight: '5px' }}>
                    {conversations.length === 0 ? (
                        <p style={{ color: 'var(--text-secondary)', textAlign: 'center', fontSize: '0.9rem' }}>No active chats.</p>
                    ) : (
                        conversations.map((c, i) => (
                            <div
                                key={i}
                                onClick={() => setActiveChat(c.username)}
                                style={{
                                    padding: '12px',
                                    borderRadius: '8px',
                                    backgroundColor: activeChat === c.username ? 'var(--accent-color)' : 'rgba(48, 54, 61, 0.5)',
                                    color: activeChat === c.username ? '#fff' : 'var(--text-primary)',
                                    cursor: 'pointer',
                                    transition: 'background-color 0.2s',
                                    border: '1px solid var(--border-color)'
                                }}
                            >
                                <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>@{c.username}</div>
                                <div style={{ fontSize: '0.8rem', opacity: 0.8, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    <span dangerouslySetInnerHTML={{ __html: c.lastMessage }} />
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <div className="glass" style={{ width: '70%', display: 'flex', flexDirection: 'column', padding: '20px', overflow: 'hidden' }}>
                <h2 style={{ marginBottom: '20px' }}>
                    {activeChat ? `Chatting with @${activeChat}` : 'Direct Messages'}
                </h2>

                <div style={{ flex: 1, overflowY: 'auto', marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '10px', backgroundColor: 'var(--bg-primary)', padding: '15px', borderRadius: '8px' }}>
                    {!activeChat ? (
                        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginTop: 'auto', marginBottom: 'auto' }}>Select or search a user to start messaging.</p>
                    ) : messages.length === 0 ? (
                        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginTop: 'auto', marginBottom: 'auto' }}>No messages yet with @{activeChat}.</p>
                    ) : (
                        messages.map((msg, index) => (
                            <div key={index} style={{
                                alignSelf: msg.senderUsername === username ? 'flex-end' : 'flex-start',
                                backgroundColor: msg.senderUsername === username ? 'var(--accent-color)' : 'rgba(48, 54, 61, 0.5)',
                                color: msg.senderUsername === username ? '#fff' : 'var(--text-primary)',
                                padding: '10px 15px',
                                borderRadius: '15px',
                                maxWidth: '75%',
                                wordBreak: 'break-word'
                            }}>
                                <div style={{ fontSize: '0.75rem', marginBottom: '4px', opacity: 0.8 }}>
                                    {new Date(msg.timestamp).toLocaleTimeString()}
                                </div>
                                <div dangerouslySetInnerHTML={{ __html: msg.content }} />
                            </div>
                        ))
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <form onSubmit={sendMessage} style={{ display: 'flex', gap: '10px' }}>
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder={activeChat ? "Type a private message..." : "Select a chat first"}
                        className="input-field"
                        style={{ flex: 1, marginBottom: 0 }}
                        disabled={!activeChat}
                    />
                    <button type="submit" className="btn-primary" disabled={!newMessage.trim() || !activeChat}>
                        Send
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Chat;
