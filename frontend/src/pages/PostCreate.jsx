import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api';

function PostCreate({ isEdit = false }) {
    const [content, setContent] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(isEdit);
    const [saving, setSaving] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        if (isEdit && id) {
            fetchPost();
        }
    }, [id, isEdit]);

    const fetchPost = async () => {
        try {
            const res = await api.get('/posts');
            const post = res.data.find(p => p.id.toString() === id);
            if (post) {
                setContent(post.content);
            } else {
                setError('Post not found');
            }
        } catch (err) {
            setError('Failed to load post');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim()) {
            setError('Post cannot be empty.');
            return;
        }
        if (content.length > 5000) {
            setError('Post exceeds maximum character limit of 5000.');
            return;
        }

        setError('');
        setSaving(true);

        try {
            if (isEdit) {
                await api.put(`/posts/${id}`, { content });
                navigate(`/post/${id}`);
            } else {
                await api.post('/posts', { content });
                navigate('/feed');
            }
        } catch (err) {
            setError('Failed to save post.');
            setSaving(false);
        }
    };

    if (loading) return <div className="container" style={{ textAlign: 'center' }}><span className="loader"></span></div>;

    return (
        <div className="container animate-fade-in">
            <h2>{isEdit ? 'Edit Post' : 'Create a New Post'}</h2>
            <div className="glass" style={{ padding: '24px', marginTop: '20px' }}>
                {error && <div className="error-banner">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <label style={{ display: 'block', marginBottom: '12px', color: 'var(--text-secondary)' }}>
                        Inject your custom HTML and inline CSS below:
                    </label>
                    <textarea
                        className="input-field"
                        rows="10"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        disabled={saving}
                        placeholder='<div style="color: red;">Hello World</div>'
                        style={{ fontFamily: 'monospace' }}
                    ></textarea>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ color: content.length > 5000 ? '#f85149' : 'var(--text-secondary)', fontSize: '0.85rem' }}>
                            {content.length} / 5000 characters
                        </span>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button type="button" onClick={() => navigate(-1)} className="btn-secondary" disabled={saving}>Cancel</button>
                            <button type="submit" className="btn-primary" disabled={saving}>
                                {saving ? 'Saving...' : (isEdit ? 'Update Post' : 'Publish')}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default PostCreate;
