// Provides utility functions for permission authorization and role management

export const validateAuthorization = async (permission) => {
    try {
        const token = localStorage.getItem('token');

        const response = await axios.post('api/v1/authorize', {
            user: localStorage.getItem('user'),
            permission: permission
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        return response.data.isAuthorized;
    } catch (error) {
        console.error('Authorization validation failed:', error);
        return false;
    }
}
