import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import DataTable from 'datatables.net-react';
import DT from 'datatables.net-dt';
import 'datatables.net-dt/css/dataTables.dataTables.css';
import { useTheme } from '../../ThemeContext';
import { getAuthenticatedUser, clearAuthData } from '../../utils/authentication';
import { validateSessionPermission } from '../../utils/authorization';

function ViewPermissions() {
    const navigate = useNavigate();
        const { theme } = useTheme();
        const [user, setUser] = useState(null);
        const tableRef = useRef(null);

        // Define columns for DataTable
        const columns = [
            { data: 'slug', title: 'Slug' },
            { data: 'description', title: 'Description', orderable: false },
            {
                data: 'status',
                title: 'Status',
                orderable: false,
                render: function(data) {
                    const statusMap = {
                        1: { label: 'Active', class: 'bg-green-100 text-green-800' },
                        2: { label: 'Inactive', class: 'bg-yellow-100 text-yellow-800' },
                        3: { label: 'Deleted', class: 'bg-red-100 text-red-800' }
                    };
                    const status = statusMap[data] || { label: 'Unknown', class: 'bg-gray-100 text-gray-800' };
                    return `<span class="px-2 py-1 text-xs font-semibold rounded-full ${status.class}">${status.label}</span>`;
                }
            },
            {
                data: 'created_at',
                title: 'Created At',
                render: function(data) {
                    if (!data) return '';
                    const date = new Date(data);
                    const year = date.getFullYear();
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    const day = String(date.getDate()).padStart(2, '0');
                    const hours = String(date.getHours()).padStart(2, '0');
                    const minutes = String(date.getMinutes()).padStart(2, '0');
                    const seconds = String(date.getSeconds()).padStart(2, '0');
                    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
                }
            },
            {
                data: null,
                title: 'Action',
                orderable: false,
                createdCell: (td, cellData, rowData) => {
                    // Use React to render buttons with onClick handlers
                    const editBtn = document.createElement('button');
                    editBtn.className = 'text-blue-600 hover:underline mx-2';
                    editBtn.textContent = 'Edit';
                    editBtn.onclick = () => navigate(`/admin/permissions/edit/${rowData.id}`);

                    const deleteBtn = document.createElement('button');
                    deleteBtn.className = 'text-red-600 hover:underline mx-2';
                    deleteBtn.textContent = 'Delete';
                    deleteBtn.onclick = () => handleDeletePermission(rowData.id);

                    td.innerHTML = '';
                    td.appendChild(editBtn);
                    td.appendChild(deleteBtn);
                }
            }
        ];

        // Configure ajax data source for DataTable
        // This fetches data from the Laravel API and transforms it for DataTables
        const ajaxConfig = {
            url: '/api/v1/permissions',
            type: 'GET',
            // Custom header to include authentication token
            beforeSend: function(xhr) {
                xhr.setRequestHeader('Authorization', `Bearer ${localStorage.getItem('token')}`);
            },
            // Transform DataTables server-side parameters to Laravel pagination format
            data: function(d) {
                console.log('DataTables request data:', d);
                return {
                    page: Math.floor(d.start / d.length) + 1, // Calculate page number
                    per_page: d.length, // Items per page
                    search: d.search.value, // Search term
                    sort_by: d.order.length > 0 ? d.columns[d.order[0].column].data : 'name',
                    sort_order: d.order.length > 0 ? d.order[0].dir : 'asc'
                };
            },
            // Transform Laravel response structure to DataTables format
            dataSrc: function(json) {
                // DataTables expects recordsTotal and recordsFiltered for server-side processing
                return json.data || [];
            },
            dataFilter: function(data) {
                const json = JSON.parse(data);
                // Transform Laravel pagination to DataTables format
                json.recordsTotal = json.meta?.total || 0;
                json.recordsFiltered = json.meta?.total || 0;
                return JSON.stringify(json);
            },
            error: function(xhr, error, code) {
                console.error('DataTable ajax error:', error, code);
                if (xhr.status === 401) {
                    // Unauthorized - redirect to login
                    clearAuthData();
                    navigate('/login');
                }
            }
        };

        const handleDeletePermission = async (permissionId) => {
            if (!confirm('Are you sure you want to delete this permission?')) {
                return;
            }

            try {
                await window.axios.delete(`/api/v1/permissions/${permissionId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });

                // Reload the DataTable using ref
                if (tableRef.current) {
                    tableRef.current.dt().ajax.reload();
                }
            } catch (error) {
                console.error('Error deleting permission:', error);
                alert('Failed to delete permission. Please try again.');
            }
        };

        // Initial setup effect - runs once on component mount
        useEffect(() => {
            console.log('ViewPermissions useEffect triggered');

            const checkAuthorization = async () => {
                console.log('checkAuthorization called');
                const permission = 'list-permissions'; // permission-slug for accessing permissions list
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

            const initialize = async () => {
                await checkAuthorization();
            }

            initialize();
        }, [navigate]);

    return (
<div className={theme === 'dark' ? 'dark' : ''}>
    <div className="w-full flex justify-between items-center mb-3 mt-1 pl-3">

        <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Permissions</h3>
            <p className="text-gray-500 dark:text-gray-400">Overview of the current permissions.</p>
        </div>

        <div className="mr-3">
            <button onClick={() => navigate('/admin/permissions/create')} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
            Create New Permission
            </button>
        </div>

    </div>

    <div className='mx-3 bg-white rounded-lg shadow'>
        <DataTable
            ref={tableRef}
            id="permissionsTable"
            ajax={ajaxConfig}
            columns={columns}
            className="display stripe order-column"
            options={{
                processing: true,
                serverSide: true,
                pageLength: 25,
                lengthMenu: [10, 25, 50, 100],
                order: [[0, 'asc']],
                orderClasses: true,
                responsive: true,
                search: {
                    return: true  // Only search on Enter key press
                }
            }}
        />
    </div>

</div>
    );
}

export default ViewPermissions;
