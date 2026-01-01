import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../ThemeContext';
import { validatePrivilegedRole, getAuthenticatedUser, storeAuthData } from '../utils/authentication';

function Registration() {
    const [fullname, setFullname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [errorField, setErrorField] = useState('');
    const navigate = useNavigate();
    const theme = useTheme();
    const t = window.config?.translations?.messages || {};

    const nameRef = useRef(null);
    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    const confirmPasswordRef = useRef(null);

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

    const validateForm = () => {
        // Name validation: required|string|max:255
        if (!fullname.trim()) {
            setError('Name is required');
            setErrorField('name');
            nameRef.current?.focus();
            return false;
        }

        if (fullname.length > 255) {
            setError('Name must not exceed 255 characters');
            setErrorField('name');
            nameRef.current?.focus();
            return false;
        }

        // Email validation: required|string|email|max:255
        if (!email.trim()) {
            setError('Email is required');
            setErrorField('email');
            emailRef.current?.focus();
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Please enter a valid email address');
            setErrorField('email');
            emailRef.current?.focus();
            return false;
        }

        if (email.length > 255) {
            setError('Email must not exceed 255 characters');
            setErrorField('email');
            emailRef.current?.focus();
            return false;
        }

        // Password validation: required|string|min:6|confirmed
        if (!password) {
            setError('Password is required');
            setErrorField('password');
            passwordRef.current?.focus();
            return false;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            setErrorField('password');
            passwordRef.current?.focus();
            return false;
        }

        // Password confirmation validation
        if (!confirmPassword) {
            setError('Confirm Password is required');
            setErrorField('confirmPassword');
            confirmPasswordRef.current?.focus();
            return false;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            setErrorField('confirmPassword');
            confirmPasswordRef.current?.focus();
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
            e.preventDefault();
            setError('');
            setErrorField('');

            if (!validateForm()) {
                return;
            }

            try {
                const response = await window.axios.post('/api/v1/register', {
                    name: fullname,
                    email,
                    password,
                    password_confirmation: confirmPassword
                });

                const { token, role, user } = response.data;

                if (response.status === 201 && user) {
                    navigate('/login', { state: { successMessage: 'Registration successful, please login.' } });
                }


            } catch (err) {
                setError(err.response?.data?.message || 'Registration failed. Please try again.');
            }
        };

    return (
        <div className={`max-w-md mx-auto my-12 ${theme.classes.p.md} border border-gray-300 rounded-lg ${theme.classes.shadow.md}`}>
            <h2 className="text-center text-2xl font-bold mb-5">{t.registration || 'Registration'}</h2>

            {error && (
                <div className="p-2.5 mb-4 bg-red-100 text-red-700 rounded">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
                <div className="mb-4">
                    <label className="block mb-1">
                        Name
                    </label>
                    <input
                        ref={nameRef}
                        type="text"
                        value={fullname}
                        onChange={(e) => {
                            setFullname(e.target.value);
                            if (errorField === 'name') setErrorField('');
                        }}
                        className={`w-full p-2 border rounded ${errorField === 'name' ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200' : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'} outline-none`}
                    />
                </div>

                <div className="mb-4">
                    <label className="block mb-1">
                        Email
                    </label>
                    <input
                        ref={emailRef}
                        type="email"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            if (errorField === 'email') setErrorField('');
                        }}
                        className={`w-full p-2 border rounded ${errorField === 'email' ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200' : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'} outline-none`}
                    />
                </div>

                <div className="mb-4">
                    <label className="block mb-1">
                        Password
                    </label>
                    <input
                        ref={passwordRef}
                        type="password"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            if (errorField === 'password') setErrorField('');
                        }}
                        className={`w-full p-2 border rounded ${errorField === 'password' ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200' : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'} outline-none`}
                    />
                </div>

                <div className="mb-4">
                    <label className="block mb-1">
                        Confirm Password
                    </label>
                    <input
                        ref={confirmPasswordRef}
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => {
                            setConfirmPassword(e.target.value);
                            if (errorField === 'confirmPassword') setErrorField('');
                        }}
                        className={`w-full p-2 border rounded ${errorField === 'confirmPassword' ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200' : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'} outline-none`}
                    />
                </div>

                <button
                    type="submit"
                    className="w-full p-2.5 bg-[#667eea] text-white border-0 rounded cursor-pointer hover:bg-[#5568d3] transition-colors"
                >
                    {t.register || 'Register'}
                </button>
            </form>
        </div>
    );

}

export default Registration;
