import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTheme } from '../../ThemeContext';
import { getAuthenticatedUser, clearAuthData } from '../../utils/authentication';
import { validateSessionPermission } from '../../utils/authorization';

function ViewRolePermissions() {
    const navigate = useNavigate();
    const { theme } = useTheme();
    const { id } = useParams(); // Get id from URL params for role ID
    const [user, setUser] = useState(null);
    const [rolePermissions, setRolePermissions] = useState([]);
    const [roleDetails, setRoleDetails] = useState({ name: '', description: '' });
    const [loading, setLoading] = useState(true);
    const isUpdateAuthorized = validateSessionPermission('update-role-permissions');


    useEffect(() => {
        console.log('ViewRolePermissions useEffect triggered');

        const checkAuthorization = async () => {
            console.log('checkAuthorization called');
            const permission = 'view-role-permissions'; // permission-slug for accessing permissions list
            let isAuthorizedResponse = validateSessionPermission(permission);
            console.log('Authorization response:', isAuthorizedResponse);

            if (isAuthorizedResponse === false) {
                console.log('Authorization failed, logging out');
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

            console.log('Authorization successful, setting user');
            setUser(getAuthenticatedUser());
        };

        const fetchRolePermissions = async () => {
            try {
                let url = `/api/v1/role/${id}/permissions`;
                const response = await window.axios.get(url, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                console.log('Role permissions data:', response.data);

                if (response.data && response.data.data) {
                    setRolePermissions(response.data.data.permissions || []);
                    setRoleDetails({
                        name: response.data.data.role_name || '',
                        description: response.data.data.role_description || ''
                    });
                }
                setLoading(false);
            } catch (error) {
                console.error('Error fetching role permissions:', error);
                alert('Failed to fetch role permissions. Please try again.');
                setLoading(false);
            }
        };

        // Initial setup effect - runs once on component mount
        const initialize = async () => {
            await checkAuthorization();
        }

        // Load page data after initialization
        const loadData = async () => {
            await fetchRolePermissions();
        }

        initialize();
        loadData();
    }, [navigate, id]);

    const handlePermissionToggle = async (permissionId, currentStatus) => {
        if (!isUpdateAuthorized) {
            alert('You are not authorized to update permissions');
            return;
        }

        try {
            const url = `/api/v1/role/${id}/permissions/${permissionId}`;
            const method = currentStatus === 1 ? 'delete' : 'post';

            await window.axios[method](url, {}, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            // Update local state
            setRolePermissions(prevPermissions =>
                prevPermissions.map(permission =>
                    permission.id === permissionId
                        ? { ...permission, is_assigned: currentStatus === 1 ? 0 : 1 }
                        : permission
                )
            );
        } catch (error) {
            console.error('Error toggling permission:', error);
            alert('Failed to update permission. Please try again.');
        }
    };

    return (
        <div className={theme === 'dark' ? 'dark' : ''}>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto px-4 py-8">
                    {/* Header Section */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                            Role Permissions
                        </h1>
                        {roleDetails.name && (
                            <div className="text-gray-600 dark:text-gray-400">
                                <p className="text-xl font-semibold">{roleDetails.name}</p>
                                {roleDetails.description && (
                                    <p className="text-sm mt-1">{roleDetails.description}</p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Loading State */}
                    {loading && (
                        <div className="text-center py-12">
                            <p className="text-gray-600 dark:text-gray-400">Loading permissions...</p>
                        </div>
                    )}

                    {/* Permissions Grid */}
                    {!loading && rolePermissions.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {rolePermissions.map((permission) => (
                                <div
                                    key={permission.id}
                                    className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
                                >
                                    <div className="flex items-start space-x-3">
                                        {/* Checkbox */}
                                        <input
                                            type="checkbox"
                                            checked={permission.is_assigned === 1}
                                            onChange={() => handlePermissionToggle(permission.id, permission.is_assigned)}
                                            disabled={!isUpdateAuthorized}
                                            className={`mt-1 h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 ${
                                                !isUpdateAuthorized ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                                            }`}
                                        />

                                        {/* Permission Details */}
                                        <div className="flex-1">
                                            <p className="text-base font-semibold text-gray-900 dark:text-white mb-1">
                                                {permission.description || permission.name}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                {permission.slug}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Empty State */}
                    {!loading && rolePermissions.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-gray-600 dark:text-gray-400">No permissions found for this role.</p>
                        </div>
                    )}

                    {/* Authorization Notice */}
                    {!isUpdateAuthorized && !loading && (
                        <div className="mt-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                            <p className="text-sm text-yellow-800 dark:text-yellow-200">
                                ⓘ You have view-only access. Contact your administrator to request update permissions.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ViewRolePermissions;
