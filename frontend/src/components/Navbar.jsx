import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Moon, Sun } from 'lucide-react';

function Navbar() {
    const { token, role, logout, theme, toggleTheme } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar glass animate-slide-down">
            <Link to="/" className="nav-brand">
                <h1>MicroBlog</h1>
            </Link>
            <div className="nav-links">
                <button onClick={toggleTheme} className="btn-secondary" style={{ padding: '8px', display: 'flex', alignItems: 'center' }}>
                    {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                </button>

                {token ? (
                    <>
                        <Link to="/feed" className="nav-link">Feed</Link>
                        <Link to="/profile" className="nav-link">Profile</Link>
                        <Link to="/chat" className="nav-link">Chat</Link>
                        {role === 'ADMIN' && <Link to="/admin" className="nav-link" style={{ color: 'var(--accent-color)' }}>Admin</Link>}
                        <button onClick={handleLogout} className="btn-secondary">Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="nav-link">Login</Link>
                        <Link to="/register" className="btn-primary" style={{ textDecoration: 'none' }}>Sign Up</Link>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
