import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../ThemeContext';

function Dashboard() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const theme = useTheme();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const role = localStorage.getItem('role');

        if (!storedUser || role !== 'admin') {
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

    if (!user) return <div className="text-center p-10">Loading...</div>;

    return (
        <div className={theme.classes.p.md}>
            <header className={`${theme.classes.flexBetween} mb-8 pb-2.5 border-b-2 border-gray-300`}>
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-red-600 text-white border-0 rounded cursor-pointer hover:bg-red-700 transition-colors"
                >
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
                <h3>Welcome, {user.name}!</h3>
                <p>Email: {user.email}</p>
                <p>Role: Administrator</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                <div style={{
                    padding: '20px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    borderRadius: '8px',
                    textAlign: 'center'
                }}>
                    <h2>Users</h2>
                    <p style={{ fontSize: '32px', margin: '10px 0' }}>0</p>
                </div>

                <div style={{
                    padding: '20px',
                    backgroundColor: '#28a745',
                    color: 'white',
                    borderRadius: '8px',
                    textAlign: 'center'
                }}>
                    <h2>Bookings</h2>
                    <p style={{ fontSize: '32px', margin: '10px 0' }}>0</p>
                </div>

                <div style={{
                    padding: '20px',
                    backgroundColor: '#ffc107',
                    color: 'white',
                    borderRadius: '8px',
                    textAlign: 'center'
                }}>
                    <h2>Movies</h2>
                    <p style={{ fontSize: '32px', margin: '10px 0' }}>0</p>
                </div>
            </div>

            <div style={{ marginTop: '30px' }}>
                <h3>Quick Actions</h3>
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    <button style={{
                        padding: '10px 20px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}>
                        Manage Users
                    </button>
                    <button style={{
                        padding: '10px 20px',
                        backgroundColor: '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}>
                        Manage Movies
                    </button>
                    <button style={{
                        padding: '10px 20px',
                        backgroundColor: '#17a2b8',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}>
                        View Bookings
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
