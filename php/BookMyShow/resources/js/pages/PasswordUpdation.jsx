import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTheme } from '../ThemeContext';
import { validatePrivilegedRole, getAuthenticatedUser, storeAuthData } from '../utils/authentication';

function PasswordUpdation() {
    const [searchParams] = useSearchParams();
    const [email, setEmail] = useState('');
    const [token, setToken] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [errorField, setErrorField] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isValidating, setIsValidating] = useState(true);
    const [isTokenValid, setIsTokenValid] = useState(false);
    const navigate = useNavigate();
    const theme = useTheme();
    const t = window.config?.translations?.messages || {};

    const newPasswordRef = useRef(null);
    const confirmPasswordRef = useRef(null);

    useEffect(() => {
        let loggedInUser = getAuthenticatedUser();
        if (loggedInUser && validatePrivilegedRole()) {
            if (window.privilegedRoles.includes(loggedInUser.role)) {
                navigate('/admin/dashboard');
            } else {
                navigate('/customer/dashboard');
            }
            return;
        }

        // Extract token and email from query parameters
        const tokenParam = searchParams.get('token');
        const emailParam = searchParams.get('email');
        console.log('Extracted token and email:', tokenParam, emailParam);

        if (!tokenParam || !emailParam) {
            setError('Invalid password reset link. Please request a new password reset.');
            setIsValidating(false);
            return;
        }

        setToken(tokenParam);
        setEmail(decodeURIComponent(emailParam));

        // Validate the token
        validateToken(tokenParam, emailParam);
    }, [navigate, searchParams]);

    const validateToken = async (tokenParam, emailParam) => {
        setIsValidating(true);
        try {
            await window.axios.get('/sanctum/csrf-cookie');

            const response = await window.axios.post('/api/v1/validate-reset-token', {
                token: tokenParam,
                email: decodeURIComponent(emailParam)
            });

            if (response.status === 200) {
                setIsTokenValid(true);
                setError('');
            } else {
                setError('Invalid or expired password reset link. Please request a new password reset.');
                setIsTokenValid(false);
            }
        } catch (error) {
            console.error('Token validation error:', error);
            if (error.response?.status === 404 || error.response?.status === 400) {
                setError(error.response?.data?.message || 'Invalid or expired password reset link. Please request a new password reset.');
            } else {
                setError('An error occurred while validating the reset link. Please try again.');
            }
            setIsTokenValid(false);
        } finally {
            setIsValidating(false);
        }
    };

    const validateForm = () => {
        // Password validation: required|min:6
        if (!newPassword.trim()) {
            setError('Password is required');
            setErrorField('newPassword');
            newPasswordRef.current?.focus();
            return false;
        }

        if (newPassword.length < 6) {
            setError('Password must be at least 6 characters');
            setErrorField('newPassword');
            newPasswordRef.current?.focus();
            return false;
        }

        // Password confirmation validation
        if (!confirmPassword.trim()) {
            setError('Password confirmation is required');
            setErrorField('confirmPassword');
            confirmPasswordRef.current?.focus();
            return false;
        }

        if (newPassword !== confirmPassword) {
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
        setSuccessMessage('');

        if(!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            // Get CSRF cookie from Laravel before making request
            await window.axios.get('/sanctum/csrf-cookie');

            const response = await window.axios.post('/api/v1/update-password', {
                token,
                email,
                password: newPassword,
                password_confirmation: confirmPassword
            });

            if (response.status === 200) {
                setError('');
                setSuccessMessage('Password reset successfully! Redirecting to login...');
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            } else {
                setError('An error occurred while resetting password. Please try again.');
            }
        } catch (error) {
            console.error('Password reset error:', error);
            if (error.response?.data?.message) {
                setError(error.response.data.message);
            } else if (error.response?.data?.errors) {
                const errors = error.response.data.errors;
                const firstError = Object.values(errors)[0];
                setError(Array.isArray(firstError) ? firstError[0] : firstError);
            } else {
                setError('An error occurred while resetting password. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

   return (
        <div className={`max-w-md mx-auto my-12 ${theme.classes.p.md} border border-gray-300 rounded-lg ${theme.classes.shadow.md}`}>
            <h2 className={`text-2xl font-bold mb-6 ${theme.classes.text.primary}`}>{t.passwordUpdation || "Update Password"}</h2>

            {isValidating && (
                <div className="p-4 mb-4 bg-blue-100 text-blue-700 rounded flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-blue-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Validating reset link...</span>
                </div>
            )}

            {error && !isValidating && (
                <div className="p-2.5 mb-4 bg-red-100 text-red-700 rounded">
                    {error}
                </div>
            )}

            {successMessage && (
                <div className="p-2.5 mb-4 bg-green-100 text-green-700 rounded">
                    {successMessage}
                </div>
            )}

            {!isValidating && !isTokenValid && (
                <div className="text-center">
                    <button
                        onClick={() => navigate('/reset-password')}
                        className="text-blue-600 hover:underline"
                    >
                        Request a new password reset link
                    </button>
                </div>
            )}

            {!isValidating && isTokenValid && (
                <form onSubmit={handleSubmit} noValidate>
                    <div className="mb-4">
                        <label className="block mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            readOnly
                            className="w-full p-2 border rounded border-gray-300 bg-gray-100 cursor-not-allowed"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block mb-1">
                            New Password
                        </label>
                        <input
                            ref={newPasswordRef}
                            type="password"
                            value={newPassword}
                            onChange={(e) => {
                                setNewPassword(e.target.value);
                                if (errorField === 'newPassword') setErrorField('');
                            }}
                            className={`w-full p-2 border rounded ${errorField === 'newPassword' ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200' : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'} outline-none`}
                            placeholder="Enter your new password"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block mb-1">
                            Confirm New Password
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
                            placeholder="Confirm your new password"
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
                        {isLoading ? 'Updating Password...' : 'Update Password'}
                    </button>
                </form>
            )}
        </div>
   );
}

export default PasswordUpdation;
