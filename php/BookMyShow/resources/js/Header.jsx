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

    const handleLogout = () => {
        clearAuthData();
        navigate('/');
    };

    return (
        <div className={`${theme.classes.flexBetween} ${theme.classes.px.lg} ${theme.classes.py.md} ${theme.classes.bgHeader} ${theme.classes.shadow.sm}`}>
            <div className="flex items-center gap-3">
                <button
                    onClick={() => navigate('/')}
                    className={theme.classes.btnIcon}
                >
                    <FaIcons.FaHome />
                </button>
                <h2 className="text-xl font-semibold text-gray-800">
                    {pageTitle || window.config?.appName || 'React App'}
                </h2>
            </div>


            <div className="flex items-center gap-4">
                <div className="text-lg font-medium text-gray-900">
                    Welcome {user?.name || 'Guest'}!
                </div>

                {validateAuthentication() ? (
                    <div className="relative">
                        <button
                            onClick={() => setShowDropdown(!showDropdown)}
                            className="text-3xl text-gray-700 cursor-pointer hover:text-gray-900 transition-colors"
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

                                <button
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
            </div>
        </div>
    );
}

export default Header;
