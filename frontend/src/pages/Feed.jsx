import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';

function Feed() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [sortOrder, setSortOrder] = useState('newest');
    const { username } = useAuth();
    const [deletingId, setDeletingId] = useState(null);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const res = await api.get('/posts');
            setPosts(res.data);
        } catch (err) {
            setError('Network Error. Failed to load feed.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this post?')) return;

        const previousPosts = [...posts];
        setPosts(posts.filter(p => p.id !== id));
        setDeletingId(id);

        try {
            await api.delete(`/posts/${id}`);
        } catch (err) {
            setPosts(previousPosts);
            alert('Failed to delete post.');
        } finally {
            setDeletingId(null);
        }
    };

    const filteredPosts = posts.filter(post =>
        post.content.toLowerCase().includes(search.toLowerCase()) ||
        post.username.toLowerCase().includes(search.toLowerCase())
    );

    const sortedPosts = [...filteredPosts].sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

    if (loading) return <div className="container" style={{ textAlign: 'center' }}><span className="loader"></span></div>;

    return (
        <div className="container animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>Global Feed</h2>
                <Link to="/post/create" className="btn-primary" style={{ textDecoration: 'none' }}>Create Post</Link>
            </div>

            {error && <div className="error-banner">{error}</div>}

            <div className="glass" style={{ padding: '16px', marginBottom: '24px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <input
                    type="text"
                    placeholder="Search keywords..."
                    className="input-field"
                    style={{ marginBottom: 0, flex: 1 }}
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
                <select
                    className="input-field"
                    style={{ marginBottom: 0, width: 'auto' }}
                    value={sortOrder}
                    onChange={e => setSortOrder(e.target.value)}
                >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                </select>
            </div>

            {sortedPosts.length === 0 ? (
                <div className="glass empty-state">
                    <p>No posts match your criteria. Be the first to write something!</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {sortedPosts.map(post => (
                        <div key={post.id} className="glass" style={{ padding: '20px', opacity: deletingId === post.id ? 0.5 : 1 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
                                <strong style={{ color: 'var(--accent-color)' }}>@{post.username}</strong>
                                <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                                    {new Date(post.createdAt).toLocaleString()}
                                </span>
                            </div>
                            <div dangerouslySetInnerHTML={{ __html: post.content }} style={{ marginBottom: '16px', wordBreak: 'break-word' }} />

                            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
                                <Link to={`/post/${post.id}`} className="btn-secondary" style={{ textDecoration: 'none', fontSize: '0.85rem', padding: '6px 12px' }}>
                                    View Details
                                </Link>
                                {post.username === username && (
                                    <>
                                        <Link to={`/post/${post.id}/edit`} className="btn-secondary" style={{ textDecoration: 'none', fontSize: '0.85rem', padding: '6px 12px' }}>Edit</Link>
                                        <button onClick={() => handleDelete(post.id)} className="btn-secondary" style={{ color: '#f85149', borderColor: 'rgba(248, 81, 73, 0.3)', fontSize: '0.85rem', padding: '6px 12px' }}>Delete</button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Feed;
