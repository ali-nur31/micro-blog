import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Moon, Sun, Home, MessageSquare, PlusSquare, User, Shield, LogOut } from 'lucide-react';

function Navbar() {
    const { token, role, logout, theme, toggleTheme } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar glass animate-slide-down">
            <Link to="/" className="nav-brand">
                <h1>Chatti</h1>
            </Link>
            <div className="nav-links">
                {token ? (
                    <>
                        <Link to="/feed" className={`nav-link ${location.pathname === '/feed' ? 'active' : ''}`}>
                            <Home size={24} />
                            <span className="nav-text">Feed</span>
                        </Link>
                        <Link to="/post/create" className={`nav-link ${location.pathname === '/post/create' ? 'active' : ''}`}>
                            <PlusSquare size={24} />
                            <span className="nav-text">Post</span>
                        </Link>
                        <Link to="/chat" className={`nav-link ${location.pathname === '/chat' ? 'active' : ''}`}>
                            <MessageSquare size={24} />
                            <span className="nav-text">Chat</span>
                        </Link>
                        <Link to="/profile" className={`nav-link ${location.pathname === '/profile' ? 'active' : ''}`}>
                            <User size={24} />
                            <span className="nav-text">Profile</span>
                        </Link>
                        {role === 'ADMIN' && (
                            <Link to="/admin" className={`nav-link ${location.pathname === '/admin' ? 'active' : ''}`} style={{ color: 'var(--accent-color)' }}>
                                <Shield size={24} />
                                <span className="nav-text">Admin</span>
                            </Link>
                        )}
                        <button onClick={handleLogout} className="nav-link" style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '12px', alignItems: 'center' }}>
                            <LogOut size={24} />
                            <span className="nav-text">Logout</span>
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="nav-link">
                            <span className="nav-text" style={{ display: 'block' }}>Login</span>
                        </Link>
                        <Link to="/register" className="btn-primary" style={{ textDecoration: 'none' }}>Sign Up</Link>
                    </>
                )}

                <button onClick={toggleTheme} className="nav-link" style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '12px', alignItems: 'center' }}>
                    {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
                    <span className="nav-text">Theme</span>
                </button>
            </div>
        </nav>
    );
}

export default Navbar;
