import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const role = localStorage.getItem('role');

        if (!storedUser || role !== 'customer') {
            navigate('/login');
            return;
        }

        setUser(JSON.parse(storedUser));
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('user');
        delete window.axios.defaults.headers.common['Authorization'];
        navigate('/');
    };

    if (!user) return <div>Loading...</div>;

    return (
        <div style={{ padding: '20px' }}>
            <header style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '30px',
                paddingBottom: '10px',
                borderBottom: '2px solid #ddd'
            }}>
                <h1>My Dashboard</h1>
                <button
                    onClick={handleLogout}
                    style={{
                        padding: '8px 16px',
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    Logout
                </button>
            </header>

            <div style={{
                padding: '20px',
                backgroundColor: '#f8f9fa',
                borderRadius: '8px',
                marginBottom: '20px'
            }}>
                <h3>Welcome back, {user.name}!</h3>
                <p>Email: {user.email}</p>
            </div>

            <div style={{ marginBottom: '30px' }}>
                <h2>Now Showing</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginTop: '15px' }}>
                    {[1, 2, 3, 4].map((movie) => (
                        <div key={movie} style={{
                            border: '1px solid #ddd',
                            borderRadius: '8px',
                            overflow: 'hidden'
                        }}>
                            <div style={{
                                height: '200px',
                                backgroundColor: '#e9ecef',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                Movie Poster
                            </div>
                            <div style={{ padding: '15px' }}>
                                <h4>Movie Title {movie}</h4>
                                <p style={{ color: '#666', fontSize: '14px' }}>Genre | 2h 30m</p>
                                <button style={{
                                    width: '100%',
                                    padding: '8px',
                                    backgroundColor: '#007bff',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    marginTop: '10px'
                                }}>
                                    Book Now
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <h2>My Bookings</h2>
                <div style={{
                    padding: '20px',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '8px',
                    marginTop: '15px',
                    textAlign: 'center'
                }}>
                    <p style={{ color: '#666' }}>No bookings yet. Start booking your favorite movies!</p>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
