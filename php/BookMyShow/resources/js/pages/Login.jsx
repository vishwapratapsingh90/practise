import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../ThemeContext';
import { validatePrivilegedRole, getAuthenticatedUser, storeAuthData } from '../utils/authentication';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const theme = useTheme();
    const t = window.config?.translations?.messages || {};

    useEffect(() => {
        let loggedInUser = getAuthenticatedUser();
        if (loggedInUser && validatePrivilegedRole()) {
            if (window.privilegedRoles.includes(loggedInUser.role)) {
                navigate('/admin/dashboard');
            } else {
                navigate('/customer/dashboard');
            }
        }

    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await window.axios.post('api/v1/login', {
                email,
                password
            });

            const { token, role, user } = response.data;

            // Store authentication data
            storeAuthData({ token, role, user });

            // Redirect based on role
            if (window.privilegedRoles.includes(role)) {
                navigate('/admin/dashboard');
            } else {
                navigate('/customer/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please try again.');
        }
    };

    return (
        <div className={`max-w-md mx-auto my-12 ${theme.classes.p.md} border border-gray-300 rounded-lg ${theme.classes.shadow.md}`}>
            <h2 className="text-center text-2xl font-bold mb-5">Login</h2>

            {error && (
                <div className="p-2.5 mb-4 bg-red-100 text-red-700 rounded">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block mb-1">
                        Email
                    </label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>

                <div className="mb-4">
                    <label className="block mb-1">
                        Password
                    </label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full p-2.5 bg-[#667eea] text-white border-0 rounded cursor-pointer hover:bg-[#5568d3] transition-colors"
                >
                    {t.login || 'Login'}
                </button>
            </form>
        </div>
    );
}

export default Login;
