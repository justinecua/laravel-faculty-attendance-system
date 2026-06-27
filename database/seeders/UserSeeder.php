<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::insert([
            [
                'name' => 'System Administrator',
                'email' => 'admin@test.com',
                'password' => Hash::make('password'),
                'role_id' => 1,
                'employee_id' => 'ADM-001',
                'department_id' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Ana Reyes',
                'email' => 'secretary@test.com',
                'password' => Hash::make('password'),
                'role_id' => 2,
                'employee_id' => 'SEC-001',
                'department_id' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Juan Dela Cruz',
                'email' => 'faculty@test.com',
                'password' => Hash::make('password'),
                'role_id' => 3,
                'employee_id' => 'EMP-001',
                'department_id' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}