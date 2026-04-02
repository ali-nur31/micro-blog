import React, { useState, useEffect } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function AdminDashboard() {
    const [metrics, setMetrics] = useState(null);
    const [activity, setActivity] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { token } = useAuth();

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [metricsRes, activityRes, usersRes] = await Promise.all([
                api.get('/admin/metrics'),
                api.get('/admin/activity'),
                api.get('/users')
            ]);
            setMetrics(metricsRes.data);
            setActivity(activityRes.data);
            setUsers(usersRes.data);
        } catch (err) {
            setError('Failed to load dashboard data. Ensure you have Admin privileges.');
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        try {
            const res = await api.put(`/users/${userId}/role`, { role: newRole });
            setUsers(users.map(u => u.id === userId ? res.data : u));
        } catch (err) {
            alert('Failed to update role.');
        }
    };

    if (loading) return <div className="container" style={{ textAlign: 'center' }}><span className="loader"></span></div>;

    return (
        <div className="container animate-fade-in">
            <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Admin Analytics Dashboard</h2>
            {error && <div className="error-banner">{error}</div>}

            <div className="admin-grid" style={{ marginBottom: '40px' }}>
                {metrics && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div className="glass" style={{ padding: '20px', textAlign: 'center' }}>
                            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--accent-color)' }}>{metrics.totalUsers}</div>
                            <div style={{ color: 'var(--text-secondary)' }}>Total Users</div>
                        </div>
                        <div className="glass" style={{ padding: '20px', textAlign: 'center' }}>
                            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--accent-color)' }}>{metrics.totalPosts}</div>
                            <div style={{ color: 'var(--text-secondary)' }}>Total Posts</div>
                        </div>
                        <div className="glass" style={{ padding: '20px', textAlign: 'center' }}>
                            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--accent-color)' }}>{metrics.totalComments}</div>
                            <div style={{ color: 'var(--text-secondary)' }}>Total Comments</div>
                        </div>
                    </div>
                )}

                {activity.length > 0 && (
                    <div className="glass" style={{ padding: '20px', height: '100%', minHeight: '350px' }}>
                        <h3 style={{ marginBottom: '20px' }}>7-Day Post Activity</h3>
                        <div style={{ height: '300px', width: '100%' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={activity}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                                    <XAxis dataKey="date" stroke="var(--text-secondary)" />
                                    <YAxis stroke="var(--text-secondary)" allowDecimals={false} />
                                    <Tooltip contentStyle={{ backgroundColor: 'var(--bg-glass)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }} />
                                    <Line type="monotone" dataKey="count" stroke="var(--accent-color)" strokeWidth={3} activeDot={{ r: 8 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}
            </div>

            <div className="glass" style={{ padding: '20px' }}>
                <h3 style={{ marginBottom: '20px' }}>User Management</h3>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                                <th style={{ padding: '12px' }}>ID</th>
                                <th style={{ padding: '12px' }}>Username</th>
                                <th style={{ padding: '12px' }}>Role</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(u => (
                                <tr key={u.id} style={{ borderBottom: '1px solid rgba(48, 54, 61, 0.3)' }}>
                                    <td style={{ padding: '12px' }}>{u.id}</td>
                                    <td style={{ padding: '12px', fontWeight: 'bold', color: 'var(--accent-color)' }}>@{u.username}</td>
                                    <td style={{ padding: '12px' }}>
                                        <select
                                            value={u.role}
                                            onChange={(e) => handleRoleChange(u.id, e.target.value)}
                                            className="input-field"
                                            style={{ marginBottom: 0, width: 'auto', padding: '6px' }}
                                        >
                                            <option value="USER">USER</option>
                                            <option value="MANAGER">MANAGER</option>
                                            <option value="ADMIN">ADMIN</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;
