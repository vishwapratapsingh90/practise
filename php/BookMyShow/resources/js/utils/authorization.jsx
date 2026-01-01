// Provides utility functions for permission authorization and role management

// export const validateAuthorization = async (permission) => {
//     try {
//         const token = localStorage.getItem('token');

//         const response = await axios.post('/api/v1/authorize', {
//             user: localStorage.getItem('user'),
//             permission: permission
//         }, {
//             headers: {
//                 'Authorization': `Bearer ${token}`
//             }
//         });

//         return response.data.isAuthorized;
//     } catch (error) {
//         console.error('Authorization validation failed:', error);
//         return false;
//     }
// }


export const validateAuthorization = async (permission) => {
    try {
        const token = localStorage.getItem('token');

        const response = await axios.post('/api/v1/authorize', {
            user: localStorage.getItem('user'),
            permission: permission
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        return response; // Return the entire response including isAuthorized
    } catch (error) {
        console.error('Authorization validation failed:', error);

        const message = error.response?.data?.message || 'Authorization validation failed';
        return { message: message, isAuthorized: false }; // Return an object indicating authorization failure
    }
}
