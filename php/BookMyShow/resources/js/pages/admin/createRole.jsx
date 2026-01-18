import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTheme } from '../../ThemeContext';
import { getAuthenticatedUser, clearAuthData } from '../../utils/authentication';
import { validateSessionPermission } from '../../utils/authorization';

function CreateRole() {
    const [name, setName] = useState('');
    const [status, setStatus] = useState('1'); // Default to active
    const [error, setError] = useState('');
    const [errorField, setErrorField] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingData, setIsLoadingData] = useState(false);
    const navigate = useNavigate();
    const { theme } = useTheme();
    const { id } = useParams(); // Get id from URL params for edit mode

    const nameRef = useRef(null);

    const isEditMode = !!id;

    const fetchRoleData = async () => {
        setIsLoadingData(true);
        try {
            const response = await window.axios.get(`/api/v1/role/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.data.data) {
                const role = response.data.data.attributes;
                setName(role.name);
                setStatus(role.status.toString());
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
            setIsLoadingData(false);
        }
    };

    useEffect(() => {
        const checkAuthorization = async () => {
            const permission = isEditMode ? 'edit-role' : 'add-role';

            let isAuthorizedResponse = validateSessionPermission(permission);

            if (isAuthorizedResponse === false) {
                // Logout and redirect to login if not authorized
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

            setUser(getAuthenticatedUser());

            console.log("isEditMode:", isEditMode);

            // Fetch role data if in edit mode
            if (isEditMode) {
                await fetchRoleData();
            }
        };

        checkAuthorization();
    }, [navigate, id, isEditMode]);

    const validateForm = () => {
        // Name validation: required|string
        if (!name.trim()) {
            setError('Role name is required');
            setErrorField('name');
            nameRef.current?.focus();
            return false;
        }

        if (name.length > 255) {
            setError('Role name must not exceed 255 characters');
            setErrorField('name');
            nameRef.current?.focus();
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setErrorField('');
        setSuccessMessage('');

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            // Get CSRF cookie from Laravel before making request
            await window.axios.get('/sanctum/csrf-cookie');

            const data = {
                name: name,
                status: parseInt(status)
            };

            let response;
            if (isEditMode) {
                // PUT request for update
                response = await window.axios.put(`/api/v1/role/${id}`, data, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
            } else {
                // POST request for create
                response = await window.axios.post('/api/v1/role', data, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
            }

            if (response.status === 201 || response.status === 200) {
                setSuccessMessage(isEditMode ? 'Role updated successfully!' : 'Role created successfully!');

                if (!isEditMode) {
                    // Clear form only for create
                    setName('');
                    setStatus('1');
                }

                // Redirect to roles list after 2 seconds
                setTimeout(() => {
                    navigate('/admin/roles');
                }, 2000);
            }
        } catch (err) {
            setIsLoading(false);
            if (err.response?.status === 422) {
                // Validation errors
                const errors = err.response.data.errors;
                if (errors?.name) {
                    setError(errors.name[0]);
                    setErrorField('name');
                } else if (errors?.status) {
                    setError(errors.status[0]);
                    setErrorField('status');
                } else {
                    setError(err.response.data.message || 'Validation failed');
                }
            } else if (err.response?.status === 401) {
                clearAuthData();
                navigate('/login');
            } else if (err.response?.status === 404) {
                setError('Role not found');
            } else {
                setError(err.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'create'} role. Please try again.`);
            }
        } finally {
            if (!successMessage) {
                setIsLoading(false);
            }
        }
    };

    return (
        <div className={theme === 'dark' ? 'dark' : ''}>
            <div className="max-w-2xl mx-auto my-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {isEditMode ? 'Edit Role' : 'Create New Role'}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        {isEditMode ? 'Update the role details' : 'Add a new role to the system'}
                    </p>
                </div>

                {isLoadingData && (
                    <div className="flex items-center justify-center p-8">
                        <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    </div>
                )}

                {!isLoadingData && (
                    <>
                        {successMessage && (
                            <div className="p-4 mb-4 bg-green-100 text-green-700 rounded-lg">
                                {successMessage}
                            </div>
                        )}

                        {error && !errorField && (
                            <div className="p-4 mb-4 bg-red-100 text-red-700 rounded-lg">
                                {error}
                            </div>
                        )}

                <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
                    <div>
                        <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Role Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            ref={nameRef}
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value);
                                if (errorField === 'name') {
                                    setErrorField('');
                                    setError('');
                                }
                            }}
                            className={`w-full p-3 border rounded-lg focus:ring-2 outline-none ${
                                errorField === 'name'
                                    ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
                                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                            }`}
                            placeholder="Enter role name (e.g., Manager, Editor)"
                        />
                        {errorField === 'name' && error && (
                            <p className="mt-2 text-sm text-red-600">{error}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="status" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Status <span className="text-red-500">*</span>
                        </label>
                        <select
                            id="status"
                            value={status}
                            onChange={(e) => {
                                setStatus(e.target.value);
                                if (errorField === 'status') {
                                    setErrorField('');
                                    setError('');
                                }
                            }}
                            className={`w-full p-3 border rounded-lg focus:ring-2 outline-none ${
                                errorField === 'status'
                                    ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
                                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                            }`}
                        >
                            <option value="1">Active</option>
                            <option value="2">Inactive</option>
                            <option value="3">Deleted</option>
                        </select>
                        {errorField === 'status' && error && (
                            <p className="mt-2 text-sm text-red-600">{error}</p>
                        )}
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                            Select the {isEditMode ? 'current' : 'initial'} status for this role
                        </p>
                    </div>

                    <div className="flex gap-4">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 px-6 py-3 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isLoading && (
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            )}
                            {isLoading ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Update Role' : 'Create Role')}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/admin/roles')}
                            disabled={isLoading}
                            className="flex-1 px-6 py-3 text-gray-700 bg-gray-200 hover:bg-gray-300 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm transition-colors dark:bg-gray-600 dark:text-white dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
                    </>
                )}
            </div>
        </div>
    );
}

export default CreateRole;

