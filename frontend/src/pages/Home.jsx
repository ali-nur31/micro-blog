import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
    return (
        <div className="container animate-fade-in" style={{ textAlign: 'center', marginTop: '10vh' }}>
            <h1 style={{ fontSize: '3rem', marginBottom: '20px', background: 'linear-gradient(90deg, #58a6ff, #a371f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Welcome to Chatti
            </h1>
            <p style={{ fontSize: '1.2rem', marginBottom: '40px' }}>
                The only microblogging platform that gives you complete control over your content with custom HTML styling.
            </p>
            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
                <Link to="/register" className="btn-primary" style={{ textDecoration: 'none', padding: '12px 24px', fontSize: '1.1rem' }}>
                    Get Started
                </Link>
                <Link to="/login" className="btn-secondary" style={{ textDecoration: 'none', padding: '12px 24px', fontSize: '1.1rem' }}>
                    Login
                </Link>
            </div>
        </div>
    );
}

export default Home;
