import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTheme } from '../../ThemeContext';
import { getAuthenticatedUser, clearAuthData } from '../../utils/authentication';
import { validateSessionPermission } from '../../utils/authorization';

function ViewRole() {
    const [role, setRole] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { theme } = useTheme();
    const { id } = useParams();

    useEffect(() => {
        const checkAuthorization = async () => {
            const permission = 'view-role'; // permission-slug for viewing roles

            let isAuthorizedResponse = validateSessionPermission(permission);
            if (isAuthorizedResponse === false) {
                // Call logout API to invalidate token on server
                try {
                    await window.axios.get('/sanctum/csrf-cookie');
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

            // Fetch role data
            await fetchRoleData();
        };

        checkAuthorization();
    }, [navigate, id]);

    const fetchRoleData = async () => {
        setIsLoading(true);
        setError('');

        try {
            const response = await window.axios.get(`/api/v1/role/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            console.log('Fetched response:', response);

            if (response.data.data) {
                setRole(response.data.data);
            }
        } catch (err) {
            if (err.response?.status === 404) {
                setError('Role not found');
            } else if (err.response?.status === 401) {
                clearAuthData();
                navigate('/login');
            } else {
                setError(err.response?.data?.message || 'Failed to load role data');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            1: { label: 'Active', class: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' },
            2: { label: 'Inactive', class: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' },
            3: { label: 'Deleted', class: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' }
        };

        const config = statusConfig[status] || { label: 'Unknown', class: 'bg-gray-100 text-gray-800' };

        return (
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.class}`}>
                {config.label}
            </span>
        );
    };

    return (
        <div className={theme === 'dark' ? 'dark' : ''}>
            <div className="max-w-4xl mx-auto my-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                {/* Header Section */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex flex-col gap-2">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Role Details</h2>
                        <p className="text-gray-600 dark:text-gray-400">View complete role information</p>
                    </div>
                    <button
                        onClick={() => navigate('/admin/roles')}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors dark:bg-gray-600 dark:text-white dark:hover:bg-gray-700"
                    >
                        Back to Roles
                    </button>
                </div>

                {/* Loading State */}
                {isLoading && (
                    <div className="flex items-center justify-center p-12">
                        <svg className="animate-spin h-10 w-10 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    </div>
                )}

                {/* Error State */}
                {error && !isLoading && (
                    <div className="p-4 bg-red-100 text-red-700 rounded-lg flex items-center justify-between">
                        <span>{error}</span>
                        <button
                            onClick={() => navigate('/admin/roles')}
                            className="text-sm underline hover:no-underline"
                        >
                            Go Back
                        </button>
                    </div>
                )}

                {/* Role Data Display */}
                {role && !isLoading && !error && (
                    <div className="flex flex-col gap-6">
                        {/* Basic Information Card */}
                        <div className="flex flex-col gap-4 p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Basic Information</h3>

                            <div className="flex flex-col gap-4">
                                {/* Role ID */}
                                <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-600 pb-3">
                                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Role ID</span>
                                    <span className="text-sm text-gray-900 dark:text-white font-mono">{role.id}</span>
                                </div>

                                {/* Role Name */}
                                <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-600 pb-3">
                                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Role Name</span>
                                    <span className="text-base font-semibold text-gray-900 dark:text-white">{role.attributes.name}</span>
                                </div>

                                {/* Status */}
                                <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-600 pb-3">
                                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Status</span>
                                    {getStatusBadge(role.attributes.status)}
                                </div>

                                {/* Created At */}
                                <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-600 pb-3">
                                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Created At</span>
                                    <span className="text-sm text-gray-900 dark:text-white">
                                        {new Date(role.attributes.created_at).toLocaleString('en-US', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </span>
                                </div>

                                {/* Updated At */}
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Updated At</span>
                                    <span className="text-sm text-gray-900 dark:text-white">
                                        {new Date(role.attributes.updated_at).toLocaleString('en-US', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-4 justify-end">
                            <button
                                onClick={() => navigate(`/admin/roles/edit/${role.id}`)}
                                className="px-6 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors flex items-center gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                </svg>
                                Edit Role
                            </button>
                            <button
                                onClick={() => navigate('/admin/roles')}
                                className="px-6 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium transition-colors dark:bg-gray-600 dark:text-white dark:hover:bg-gray-700"
                            >
                                Back to List
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ViewRole;

