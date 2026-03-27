import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [username, setUsername] = useState(null);
    const [role, setRole] = useState(null);
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                setUsername(payload.sub);
                setRole(payload.role);
            } catch (e) {
                logout();
            }
        } else {
            setUsername(null);
            setRole(null);
        }
        setLoading(false);
    }, [token]);

    useEffect(() => {
        localStorage.setItem('theme', theme);
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    const login = async (user, pass) => {
        const res = await api.post('/auth/login', { username: user, password: pass });
        localStorage.setItem('token', res.data.token);
        setToken(res.data.token);
    };

    const register = async (user, pass) => {
        const res = await api.post('/auth/register', { username: user, password: pass });
        localStorage.setItem('token', res.data.token);
        setToken(res.data.token);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUsername(null);
        setRole(null);
    };

    const toggleTheme = () => {
        setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
    };

    return (
        <AuthContext.Provider value={{ token, username, role, login, register, logout, theme, toggleTheme, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
