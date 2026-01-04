import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../ThemeContext';
import { getAuthenticatedUser, clearAuthData } from '../../utils/authentication';
import { validateSessionPermission } from '../../utils/authorization';
import * as simpleDatatables from 'simple-datatables';
import 'simple-datatables/dist/style.css';

function ViewRoles() {
    const datatableSelectorId = 'selection-table';
    const [user, setUser] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0);
    const navigate = useNavigate();
    const theme = useTheme();

    const handleDeleteRole = async (roleId) => {
        if (!confirm('Are you sure you want to delete this role?')) {
            return;
        }

        try {
            await window.axios.delete(`/api/v1/roles/${roleId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            // Refresh the table without reloading the entire page
            setRefreshKey(prev => prev + 1);
        } catch (error) {
            console.error('Error deleting role:', error);
            alert('Failed to delete role. Please try again.');
        }
    };

    useEffect(() => {
        const checkAuthorization = async () => {
            const permission = 'admin-dashboard-access'; // permission-slug for accessing admin dashboard

            let isAuthorizedResponse = validateSessionPermission(permission);
            if (isAuthorizedResponse?.isAuthorized === false) {
                // Call logout API to invalidate token on server
                try {
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
        };

        const rolesRecords = async () => {
            try {
                let response = await window.axios.get('/api/v1/roles?per_page=0', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });

                return response.data.data;
            } catch (error) {
                console.error('Error fetching roles:', error);
                return [];
            }
        }

        const initDataTable = async (selector) => {

            if (document.getElementById(selector) && typeof simpleDatatables.DataTable !== 'undefined') {

                let multiSelect = true;
                let rowNavigation = false;
                let table = null;

                const resetTable = async function() {
                    if (table) {
                        table.destroy();
                    }

                    // Fetch roles data
                    const roles = await rolesRecords();
                    console.log('Roles fetched:', roles);

                    const options = {
                        rowRender: (row, tr, _index) => {
                            if (!tr.attributes) {
                                tr.attributes = {};
                            }
                            if (!tr.attributes.class) {
                                tr.attributes.class = "";
                            }
                            if (row.selected) {
                                tr.attributes.class += " selected";
                            } else {
                                tr.attributes.class = tr.attributes.class.replace(" selected", "");
                            }
                            return tr;
                        },
                        data: {
                            headings: ["Role", "Status", "Action"],
                            data: roles.map(role => [
                                role.name,
                                'Active',
                                `<button class="edit-role text-blue-600 hover:underline mx-2" data-role-id="${role.id}">Edit</button>
                                 <button class="delete-role text-red-600 hover:underline mx-2" data-role-id="${role.id}">Delete</button>`
                            ])
                        }
                    };
                    if (rowNavigation) {
                        options.rowNavigation = true;
                        options.tabIndex = 1;
                    }

                    console.log('DataTable options:', options);

                    table = new simpleDatatables.DataTable(`#${selector}`, options);

                    // Add event listeners for Edit buttons
                    document.querySelectorAll('.edit-role').forEach(button => {
                        button.addEventListener('click', (e) => {
                            const roleId = e.target.getAttribute('data-role-id');
                            navigate(`/admin/roles/edit/${roleId}`);
                        });
                    });

                    // Add event listeners for Delete buttons
                    document.querySelectorAll('.delete-role').forEach(button => {
                        button.addEventListener('click', (e) => {
                            const roleId = e.target.getAttribute('data-role-id');
                            handleDeleteRole(roleId);
                        });
                    });

                    table.on("datatable.selectrow", (rowIndex, event) => {
                        console.log('Row selected:', rowIndex);
                        event.preventDefault();
                        const rows = table.data.data;
                        if (!rows || rowIndex >= rows.length) return;

                        const row = rows[rowIndex];
                        if (row.selected) {
                            row.selected = false;
                        } else {
                            if (!multiSelect) {
                                rows.forEach(data => {
                                    data.selected = false;
                                });
                            }
                            row.selected = true;
                        }
                        table.update();
                    });
                };

                // Row navigation makes no sense on mobile, so we deactivate it and hide the checkbox.
                const isMobile = window.matchMedia("(any-pointer:coarse)").matches;
                if (isMobile) {
                    rowNavigation = false;
                }

                await resetTable();
            }

        };

        const initialize = async () => {
            await checkAuthorization();
            await initDataTable(datatableSelectorId);
        };

        initialize();
    }, [navigate, refreshKey]);

    if (!user) return <div className="text-center p-10">Loading...</div>;

    return (
<>

    <div className="w-full flex justify-between items-center mb-3 mt-1 pl-3">
        <div>
            <h3 className="text-lg font-semibold text-slate-800">Roles</h3>
            <p className="text-slate-500">Overview of the current roles.</p>
        </div>
    </div>


    <table id={`${datatableSelectorId}`}>
        <thead>
            {/* Simple DataTables will populate this from options.data.headings */}
        </thead>
        <tbody>
            {/* Simple DataTables will populate this from options.data.data */}
        </tbody>
    </table>

</>
    );

}

export default ViewRoles;
