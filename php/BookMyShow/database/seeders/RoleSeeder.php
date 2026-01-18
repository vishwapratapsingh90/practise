<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        $data = [
            ['name' => 'admin', 'status' => Role::STATUS_ACTIVE],
            ['name' => 'agent', 'status' => Role::STATUS_ACTIVE],
            ['name' => 'customer', 'status' => Role::STATUS_ACTIVE],
        ];

        foreach ($data as $role) {
            Role::firstOrCreate(
                ['name' => $role['name']], // Search by name
                ['status' => $role['status']] // Set status if creating new
            );
        }
    }
}
