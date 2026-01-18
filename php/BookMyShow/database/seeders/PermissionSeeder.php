<?php

namespace Database\Seeders;

use App\Models\Permission;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        $data = [
            [
                'slug' => 'list-roles',
                'description' => 'List all roles',
            ],
            [
                'slug' => 'add-role',
                'description' => 'Add a new role',
            ],
            [
                'slug' => 'view-role',
                'description' => 'View role details',
            ],
            [
                'slug' => 'edit-role',
                'description' => 'Edit an existing role',
            ],
            [
                'slug' => 'delete-role',
                'description' => 'Delete a role',
            ],
            [
                'slug' => 'list-permissions',
                'description' => 'List all permissions',
            ],
            [
                'slug' => 'add-permission',
                'description' => 'Add a new permission',
            ],
            [
                'slug' => 'edit-permission',
                'description' => 'Edit an existing permission',
            ],
            [
                'slug' => 'delete-permission',
                'description' => 'Delete a permission',
            ],
            [
                'slug' => 'view-permission',
                'description' => 'View permission details',
            ],
            [
                'slug' => 'update-permission',
                'description' => 'Assign or revoke permission to role',
            ],
            [
                'slug' => 'admin-dashboard-access',
                'description' => 'Access to admin dashboard',
            ],
            [
                'slug' => 'customer-dashboard-access',
                'description' => 'Access to customer dashboard',
            ],
        ];

        foreach ($data as $permission) {
            // Create permission record if it doesn't exist
            Permission::firstOrCreate(
                ['slug' => $permission['slug']], // Search by slug
                [
                    'description' => $permission['description'],
                    'status' => Permission::STATUS_ACTIVE // Set status if creating new
                ]
            );
        }
    }
}
