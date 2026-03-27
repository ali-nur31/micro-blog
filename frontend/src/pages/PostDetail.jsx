import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';

function PostDetail() {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const { username, role } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        try {
            const postsRes = await api.get('/posts');
            const foundPost = postsRes.data.find(p => p.id.toString() === id);
            if (!foundPost) {
                setError('Post not found');
                setLoading(false);
                return;
            }
            setPost(foundPost);

            const commentsRes = await api.get(`/posts/${id}/comments`);
            setComments(commentsRes.data);
        } catch (err) {
            setError('Failed to load post details');
        } finally {
            setLoading(false);
        }
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        setSubmitting(true);
        try {
            const res = await api.post(`/posts/${id}/comments`, { content: newComment });
            setComments([...comments, res.data]);
            setNewComment('');
        } catch (err) {
            alert('Failed to post comment');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this post?')) return;
        try {
            await api.delete(`/posts/${id}`);
            navigate('/feed');
        } catch (err) {
            alert('Failed to delete post');
        }
    };

    const handleCommentDelete = async (commentId) => {
        if (!window.confirm('Are you sure you want to delete this comment?')) return;
        try {
            await api.delete(`/posts/${id}/comments/${commentId}`);
            setComments(comments.filter(c => c.id !== commentId));
        } catch (err) {
            alert('Failed to delete comment');
        }
    };

    if (loading) return <div className="container" style={{ textAlign: 'center' }}><span className="loader"></span></div>;
    if (error) return <div className="container"><div className="error-banner">{error}</div><Link to="/feed">Back to Feed</Link></div>;

    return (
        <div className="container animate-fade-in">
            <div style={{ marginBottom: '20px' }}>
                <Link to="/feed" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>← Back to Feed</Link>
            </div>

            <div className="glass" style={{ padding: '24px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
                    <strong style={{ color: 'var(--accent-color)', fontSize: '1.1rem' }}>@{post.username}</strong>
                    <span style={{ color: 'var(--text-secondary)' }}>{new Date(post.createdAt).toLocaleString()}</span>
                </div>
                <div dangerouslySetInnerHTML={{ __html: post.content }} style={{ marginBottom: '20px', wordBreak: 'break-word', fontSize: '1.1rem' }} />

                {(post.username === username || role === 'ADMIN' || role === 'MANAGER') && (
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                        {post.username === username && <Link to={`/post/${post.id}/edit`} className="btn-secondary" style={{ textDecoration: 'none' }}>Edit</Link>}
                        <button onClick={handleDelete} className="btn-secondary" style={{ color: '#f85149', borderColor: 'rgba(248, 81, 73, 0.3)' }}>Delete</button>
                    </div>
                )}
            </div>

            <div className="glass" style={{ padding: '24px' }}>
                <h3 style={{ marginBottom: '20px' }}>Comments ({comments.length})</h3>

                <div style={{ marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {comments.length === 0 ? (
                        <p style={{ color: 'var(--text-secondary)' }}>No comments yet.</p>
                    ) : (
                        comments.map(c => (
                            <div key={c.id} style={{ paddingBottom: '16px', borderBottom: '1px solid rgba(48, 54, 61, 0.3)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                    <strong style={{ color: 'var(--accent-color)', fontSize: '0.9rem' }}>@{c.username}</strong>
                                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{new Date(c.createdAt).toLocaleString()}</span>
                                </div>
                                <div dangerouslySetInnerHTML={{ __html: c.content }} style={{ wordBreak: 'break-word', fontSize: '0.95rem' }} />

                                {(c.username === username || role === 'ADMIN' || role === 'MANAGER') && (
                                    <div style={{ textAlign: 'right', marginTop: '8px' }}>
                                        <button onClick={() => handleCommentDelete(c.id)} className="btn-secondary" style={{ color: '#f85149', borderColor: 'rgba(248, 81, 73, 0.3)', fontSize: '0.75rem', padding: '4px 8px' }}>Delete</button>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>

                <form onSubmit={handleCommentSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <textarea
                        className="input-field"
                        rows="3"
                        placeholder="Write a comment... (HTML allowed)"
                        value={newComment}
                        onChange={e => setNewComment(e.target.value)}
                        disabled={submitting}
                        style={{ marginBottom: '0' }}
                    ></textarea>
                    <div style={{ textAlign: 'right' }}>
                        <button type="submit" className="btn-primary" disabled={submitting || !newComment.trim()}>
                            {submitting ? 'Posting...' : 'Post Comment'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default PostDetail;
