<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            [
                'name' => 'Admin User',
                'email' => 'admin@example.com',
                'password' => bcrypt('password'),
                'role_id' => 1,
            ],
            [
                'name' => 'Agent User',
                'email' => 'agent@example.com',
                'password' => bcrypt('password'),
                'role_id' => 2,
            ],
            [
                'name' => 'Customer User',
                'email' => 'customer@example.com',
                'password' => bcrypt('password'),
                'role_id' => 3,
            ],
        ];

        foreach ($data as $userData) {
            $roleId = $userData['role_id'];
            unset($userData['role_id']);

            // Use updateOrCreate to avoid duplicate email errors
            $user = User::updateOrCreate(
                ['email' => $userData['email']], // Search by email
                [
                    'name' => $userData['name'],
                    'password' => $userData['password'],
                    'status' => User::STATUS_ACTIVE
                ]
            );
            
            // Sync role with status (replaces existing or adds new)
            $user->roles()->sync([$roleId => ['status' => User::STATUS_ACTIVE]]);
        }
    }
}
