import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../ThemeContext';
import { validatePrivilegedRole, getAuthenticatedUser, storeAuthData } from '../utils/authentication';

function ResetPassword() {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [errorField, setErrorField] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const theme = useTheme();
    const t = window.config?.translations?.messages || {};

    const emailRef = useRef(null);

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
        // Email validation: required|email
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

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setErrorField('');

        if(!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            // Get CSRF cookie from Laravel before making registration request
            await window.axios.get('/sanctum/csrf-cookie');

            const response = await window.axios.post('/api/v1/reset-password', { email });
            console.log('Reset Password Response:', response);

            const {data,message} = response.data || {};

            if (response.status === 200) {
                setError('');
                setSuccessMessage('If an account with that email exists, you will receive password reset instructions shortly.');
            } else {
                setError('An error occurred while sending reset password instructions. Please try again later.');
                setSuccessMessage('');
            }
        } catch (error) {
            setError('An error occurred while sending reset password instructions. Please try again later.');
            setSuccessMessage('');
        } finally {
            setIsLoading(false);
        }
    }


    return (
        <div className={`max-w-md mx-auto my-12 ${theme.classes.p.md} border border-gray-300 rounded-lg ${theme.classes.shadow.md}`}>
            <h2 className="text-center text-2xl font-bold mb-5">{t.resetPassword || 'Reset Password'}</h2>

            {error && (
                <div className="p-2.5 mb-4 bg-red-100 text-red-700 rounded">
                    {error}
                </div>
            )}

            {successMessage && (
                <div className="p-2.5 mb-4 bg-green-100 text-green-700 rounded">
                    {successMessage}
                </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
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

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full p-2.5 bg-[#667eea] text-white border-0 rounded cursor-pointer hover:bg-[#5568d3] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {isLoading && (
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    )}
                    {isLoading ? 'Sending...' : (t.send || 'Send')}
                </button>
            </form>
        </div>
    );
}

export default ResetPassword;
