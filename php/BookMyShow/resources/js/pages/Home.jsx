import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
    const navigate = useNavigate();

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            textAlign: 'center',
            padding: '20px'
        }}>
            <h1 style={{
                fontSize: '64px',
                marginBottom: '20px',
                fontWeight: 'bold'
            }}>
                BookMyShow
            </h1>
            <p style={{
                fontSize: '24px',
                marginBottom: '40px',
                maxWidth: '600px'
            }}>
                Welcome to the land of entertainment. Book your favorite movies and events with ease.
            </p>

            <button
                onClick={() => navigate('/login')}
                style={{
                    padding: '15px 40px',
                    fontSize: '18px',
                    backgroundColor: 'white',
                    color: '#667eea',
                    border: 'none',
                    borderRadius: '50px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                    transition: 'transform 0.2s'
                }}
                onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
            >
                Login / Sign Up
            </button>

            <div style={{
                marginTop: '60px',
                display: 'flex',
                gap: '40px',
                flexWrap: 'wrap',
                justifyContent: 'center'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '48px', marginBottom: '10px' }}>🎬</div>
                    <h3>Movies</h3>
                    <p style={{ fontSize: '14px', opacity: 0.9 }}>Latest releases</p>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '48px', marginBottom: '10px' }}>🎭</div>
                    <h3>Events</h3>
                    <p style={{ fontSize: '14px', opacity: 0.9 }}>Live shows</p>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '48px', marginBottom: '10px' }}>🎪</div>
                    <h3>Theater</h3>
                    <p style={{ fontSize: '14px', opacity: 0.9 }}>Stage plays</p>
                </div>
            </div>
        </div>
    );
}

export default Home;
