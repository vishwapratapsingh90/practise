import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../ThemeContext';
import { getAuthenticatedUser, clearAuthData } from '../../utils/authentication';
import { validateSessionPermission } from '../../utils/authorization';

function Dashboard() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const theme = useTheme();
    const t = window.config?.translations?.messages || {};

    useEffect(() => {
        const checkAuthorization = async () => {
            const permission = 'admin-dashboard-access'; // permission-slug for accessing admin dashboard

            let isAuthorizedResponse = validateSessionPermission(permission);
            if (isAuthorizedResponse === false) {
                // Call logout API to invalidate token on server
                try {
                    await window.axios.post('/api/v1/logout', {}, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`
                        }
                    });
                } catch (error) {
                    console.error('Logout API call failed:', error);
                }

                clearAuthData();
                navigate('/login');
                return;
            }

            setUser(getAuthenticatedUser());
        };

        checkAuthorization();
    }, [navigate]);

    if (!user) return <div className="text-center p-10">Loading...</div>;

    return (
        <div className={theme.classes.p.md}>
            <header className={`${theme.classes.flexBetween} mb-8 pb-2.5 border-b-2 border-gray-300`}>
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            </header>

            <div className={`${theme.classes.p.md} bg-gray-100 rounded-lg ${theme.classes.mb.md}`}>
                <h3 className="font-semibold text-lg mb-2">Welcome, {user.name}!</h3>
                <p className="text-gray-700">Email: {user.email}</p>
                <p className="text-gray-700">Role: Administrator</p>
            </div>

            <div className={`grid grid-cols-3 ${theme.classes.gap.md}`}>
                <div className={`${theme.classes.p.md} bg-blue-600 text-white rounded-lg text-center`}>
                    <h2 className="text-xl font-semibold">Users</h2>
                    <p className="text-4xl font-bold my-2.5">0</p>
                </div>

                <div className={`${theme.classes.p.md} bg-green-600 text-white rounded-lg text-center`}>
                    <h2 className="text-xl font-semibold">Bookings</h2>
                    <p className="text-4xl font-bold my-2.5">0</p>
                </div>

                <div className={`${theme.classes.p.md} bg-yellow-500 text-white rounded-lg text-center`}>
                    <h2 className="text-xl font-semibold">Movies</h2>
                    <p className="text-4xl font-bold my-2.5">0</p>
                </div>
            </div>

            <div className={theme.classes.mt.lg}>
                <h3 className="text-xl font-semibold mb-2.5">Quick Actions</h3>
                <div className={`flex ${theme.classes.gap.sm} ${theme.classes.mt.sm}`}>
                    <button className="px-5 py-2.5 bg-blue-600 text-white border-0 rounded cursor-pointer hover:bg-blue-700 transition-colors">
                        Manage Users
                    </button>
                    <button className="px-5 py-2.5 bg-green-600 text-white border-0 rounded cursor-pointer hover:bg-green-700 transition-colors">
                        Manage Movies
                    </button>
                    <button className="px-5 py-2.5 bg-cyan-600 text-white border-0 rounded cursor-pointer hover:bg-cyan-700 transition-colors">
                        View Bookings
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
