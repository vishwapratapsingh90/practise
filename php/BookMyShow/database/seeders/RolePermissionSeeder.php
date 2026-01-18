<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\Permission;
use App\Models\PermissionRole;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        $data = [
            // Admin Role Permissions
            [
                'role_id' => Role::where('name', 'admin')->first()->id,
                'permission_id' => Permission::where('slug', 'admin-dashboard-access')->first()->id,
            ],
            [
                'role_id' => Role::where('name', 'admin')->first()->id,
                'permission_id' => Permission::where('slug', 'list-roles')->first()->id,
            ],
            [
                'role_id' => Role::where('name', 'admin')->first()->id,
                'permission_id' => Permission::where('slug', 'add-role')->first()->id,
            ],
            [
                'role_id' => Role::where('name', 'admin')->first()->id,
                'permission_id' => Permission::where('slug', 'view-role')->first()->id,
            ],
            [
                'role_id' => Role::where('name', 'admin')->first()->id,
                'permission_id' => Permission::where('slug', 'edit-role')->first()->id,
            ],
            [
                'role_id' => Role::where('name', 'admin')->first()->id,
                'permission_id' => Permission::where('slug', 'delete-role')->first()->id,
            ],
            [
                'role_id' => Role::where('name', 'admin')->first()->id,
                'permission_id' => Permission::where('slug', 'list-permissions')->first()->id,
            ],
            [
                'role_id' => Role::where('name', 'admin')->first()->id,
                'permission_id' => Permission::where('slug', 'add-permission')->first()->id,
            ],
            // Customer Role Permissions
            [
                'role_id' => Role::where('name', 'customer')->first()->id,
                'permission_id' => Permission::where('slug', 'customer-dashboard-access')->first()->id,
            ],
            // [
            //     'role_id' => Role::where('name', 'customer')->first()->id,
            //     'permission_id' => Permission::where('slug', 'book-tickets')->first()->id,
            // ],
            // [
            //     'role_id' => Role::where('name', 'customer')->first()->id,
            //     'permission_id' => Permission::where('slug', 'view-bookings')->first()->id,
            // ],
            // Additional role-permission mappings can be added here
        ];

        foreach ($data as $rolePermission) {
            PermissionRole::firstOrCreate(
                [
                    'role_id' => $rolePermission['role_id'],
                    'permission_id' => $rolePermission['permission_id'],
                ],
                [
                    'status' => Role::STATUS_ACTIVE, // Default to active status
                ]
            );
        }
    }
}
