import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as FaIcons from 'react-icons/fa';
import { useTheme } from './ThemeContext';
import { validateAuthentication, getAuthenticatedUser, clearAuthData } from './utils/authentication';

function Header({ pageTitle }) {
    const [user, setUser] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const navigate = useNavigate();
    const theme = useTheme();
    const t = window.config?.translations?.messages || {};

    useEffect(() => {
        setUser(getAuthenticatedUser());
    }, [navigate]);

    const navigateToDashboard = () => {
        if (user) {
            if (window.privilegedRoles.includes(user.role)) {
                navigate('/admin/dashboard');
            } else {
                navigate('/customer/dashboard');
            }
        }
    }

    const handleLogout = async() => {
        const response = await window.axios.post('/api/v1/logout', {}, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (response.status === 200) {
            clearAuthData();
            navigate('/');
        }
    };

    return (
        <div className={`${theme.classes.flexBetween} ${theme.classes.px.lg} ${theme.classes.py.md} bg-gradient-to-r from-blue-900 to-purple-900 ${theme.classes.shadow.sm}`}>
            <div className="flex items-center gap-3">
                <button
                    onClick={() => navigate('/')}
                    className="hover:opacity-80 transition-opacity"
                >
                    <img src="/images/logo.jpg" alt="Home" className="h-10 w-auto rounded" />
                </button>
                <h1 className="text-xl font-semibold text-white">
                    {pageTitle || window.config?.appName || 'React App'}
                </h1>
            </div>


            <div className="flex items-center gap-4">
                <div className="text-lg font-medium text-white">
                    Welcome {validateAuthentication() ? user?.name : 'Guest'}!
                </div>

                {validateAuthentication() ? (
                    <div className="relative">
                        <button
                            onClick={() => setShowDropdown(!showDropdown)}
                            className="text-3xl text-white cursor-pointer hover:text-gray-200 transition-colors"
                        >
                            <FaIcons.FaUserCircle />
                        </button>

                        {showDropdown && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">

                                <button
                                    onClick={() => {
                                        setShowDropdown(false);
                                        navigate('/profile');
                                    }}
                                    className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-gray-700"
                                >
                                    <FaIcons.FaUserCog />
                                    { t.profile || 'Profile' }
                                </button>

                                <button
                                    onClick={() => {
                                        setShowDropdown(false);
                                        navigateToDashboard();
                                    }}
                                    className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-gray-700"
                                >
                                    <FaIcons.FaDesktop />
                                    { t.dashboard || 'Dashboard' }
                                </button>

                                <button id="logout-button"
                                    onClick={() => {
                                        setShowDropdown(false);
                                        handleLogout();
                                    }}
                                    className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-gray-700"
                                >
                                    <FaIcons.FaSignOutAlt />
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                ) : null}

                {!validateAuthentication() ? (
                    <button
                        onClick={() => navigate('/login')}
                        className={`${theme.classes.btnPrimary} px-6 py-2.5 font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200`}
                    >
                        {t.login_signup || 'Login / Sign Up'}
                    </button>
                ) : null}
            </div>
        </div>
    );
}

export default Header;
