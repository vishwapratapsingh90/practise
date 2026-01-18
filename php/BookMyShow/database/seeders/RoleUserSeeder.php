<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\RoleUser;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RoleUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        $data = [
            [
                'user_id' => User::where('email', 'admin@example.com')->first()->id,
                'role_id' => Role::where('name', 'admin')->first()->id
            ], // Admin User -> admin
            [
                'user_id' => User::where('email', 'agent@example.com')->first()->id,
                'role_id' => Role::where('name', 'agent')->first()->id
            ], // Agent User -> agent
            [
                'user_id' => User::where('email', 'customer@example.com')->first()->id,
                'role_id' => Role::where('name', 'customer')->first()->id
            ], // Customer User -> customer
        ];

        foreach ($data as $roleUser) {
            RoleUser::firstOrCreate($roleUser);
        }
    }
}
