import React from 'react';
import { Link } from 'react-router-dom';

function NotFound() {
    return (
        <div className="container animate-fade-in" style={{ textAlign: 'center', marginTop: '15vh' }}>
            <h1 style={{ fontSize: '5rem', marginBottom: '10px', color: 'var(--accent-color)' }}>404</h1>
            <h2 style={{ fontSize: '2rem', marginBottom: '20px' }}>Page Not Found</h2>
            <p style={{ marginBottom: '30px' }}>The page you are looking for doesn't exist or has been moved.</p>
            <Link to="/" className="btn-primary" style={{ textDecoration: 'none' }}>
                Return Home
            </Link>
        </div>
    );
}

export default NotFound;
