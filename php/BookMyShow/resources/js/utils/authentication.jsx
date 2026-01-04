// Provides utility functions for user authentication and role management

/**
 * Validates if a user is authenticated
 * @returns {boolean} - Returns true if user is authenticated, false otherwise
 */
export const validateAuthentication = () => {
    const storedUser = localStorage.getItem('user');
    return !!storedUser;
};

/**
 * Validates if a user has a privileged role (admin or agent)
 * @returns {boolean} - Returns true if user has admin or agent role, false otherwise
 */
export const validatePrivilegedRole = () => {
    const storedUser = localStorage.getItem('user');
    const role = localStorage.getItem('role');

    if (!storedUser) return false;

    return window.privilegedRoles?.includes(role);
};

/**
 * Gets the authenticated user from localStorage
 * @returns {Object|null} - Returns user object or null if not found
 */
export const getAuthenticatedUser = () => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
};

/**
 * Gets the user's role from localStorage
 * @returns {string|null} - Returns role string or null if not found
 */
export const getUserRole = () => {
    return localStorage.getItem('role');
};

/**
 * Checks if user is authenticated and has required role
 * @param {Array<string>} requiredRoles - Array of required roles
 * @returns {boolean} - Returns true if user has one of the required roles
 */
export const validateUserRole = (requiredRoles = []) => {
    const storedUser = localStorage.getItem('user');
    const role = localStorage.getItem('role');

    if (!storedUser) return false;
    if (requiredRoles.length === 0) return true;

    return requiredRoles.includes(role);
};

/**
 * Store authentication data in localStorage
 * @param {Object} authData - Authentication data object
 * @param {string} authData.token - Authentication token
 * @param {string} authData.role - User role
 * @param {Object} authData.user - User object
 * @param {Array} authData.permissions - User permissions
 */
export const storeAuthData = ({ token, role, user, permissions }) => {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('permissions', JSON.stringify(permissions));

    // Set axios default header
    window.axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

/**
 * Clear authentication data from localStorage
 */
export const clearAuthData = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    localStorage.removeItem('permissions');

    // Remove axios authorization header
    delete window.axios.defaults.headers.common['Authorization'];
};
