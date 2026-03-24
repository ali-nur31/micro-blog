import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';

function Profile() {
    const [posts, setPosts] = useState([]);
    const [stats, setStats] = useState({ totalPosts: 0, totalCommentsReceived: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { username } = useAuth();
    const [deletingId, setDeletingId] = useState(null);

    useEffect(() => {
        fetchProfileData();
    }, []);

    const fetchProfileData = async () => {
        try {
            const res = await api.get('/posts');
            const userPosts = res.data.filter(p => p.username === username);
            setPosts(userPosts);

            let commentsCount = 0;
            const commentPromises = userPosts.map(p => api.get(`/posts/${p.id}/comments`));
            const commentsResponses = await Promise.all(commentPromises);

            commentsResponses.forEach(cr => {
                commentsCount += cr.data.length;
            });

            setStats({
                totalPosts: userPosts.length,
                totalCommentsReceived: commentsCount
            });
        } catch (err) {
            setError('Failed to load profile data.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this post?')) return;

        const previousPosts = [...posts];
        setPosts(posts.filter(p => p.id !== id));
        setStats(prev => ({ ...prev, totalPosts: prev.totalPosts - 1 }));
        setDeletingId(id);

        try {
            await api.delete(`/posts/${id}`);
        } catch (err) {
            setPosts(previousPosts);
            setStats(prev => ({ ...prev, totalPosts: prev.totalPosts + 1 }));
            alert('Failed to delete post.');
        } finally {
            setDeletingId(null);
        }
    };

    if (loading) return <div className="container" style={{ textAlign: 'center' }}><span className="loader"></span></div>;

    return (
        <div className="container animate-fade-in">
            <div className="glass" style={{ padding: '30px', marginBottom: '30px', textAlign: 'center' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--accent-color)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', color: '#fff', marginBottom: '16px' }}>
                    {username.charAt(0).toUpperCase()}
                </div>
                <h2>@{username}</h2>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', marginTop: '20px' }}>
                    <div>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>{stats.totalPosts}</div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Posts Authored</div>
                    </div>
                    <div>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>{stats.totalCommentsReceived}</div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Comments Received</div>
                    </div>
                </div>
            </div>

            <h3 style={{ marginBottom: '20px' }}>Your Posts</h3>

            {error && <div className="error-banner">{error}</div>}

            {posts.length === 0 ? (
                <div className="glass empty-state">
                    <p>You haven't authored any posts yet.</p>
                    <Link to="/post/create" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-block', marginTop: '10px' }}>Create Your First Post</Link>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {posts.map(post => (
                        <div key={post.id} className="glass" style={{ padding: '20px', opacity: deletingId === post.id ? 0.5 : 1 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
                                <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                                    {new Date(post.createdAt).toLocaleString()}
                                </span>
                            </div>
                            <div dangerouslySetInnerHTML={{ __html: post.content }} style={{ marginBottom: '16px', wordBreak: 'break-word' }} />

                            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
                                <Link to={`/post/${post.id}`} className="btn-secondary" style={{ textDecoration: 'none', fontSize: '0.85rem', padding: '6px 12px' }}>
                                    View Details
                                </Link>
                                <Link to={`/post/${post.id}/edit`} className="btn-secondary" style={{ textDecoration: 'none', fontSize: '0.85rem', padding: '6px 12px' }}>Edit</Link>
                                <button onClick={() => handleDelete(post.id)} className="btn-secondary" style={{ color: '#f85149', borderColor: 'rgba(248, 81, 73, 0.3)', fontSize: '0.85rem', padding: '6px 12px' }}>Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Profile;
