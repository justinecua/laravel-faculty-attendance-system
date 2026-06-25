<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DepartmentSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('department')->insert([
            [
                'code' => 'COE',
                'name' => 'College of Engineering',
                'created_at' => now(),
            ],
            [
                'code' => 'CCS',
                'name' => 'College of Computer Studies',
                'created_at' => now(),
            ],
            [
                'code' => 'CAS',
                'name' => 'College of Arts & Sciences',
                'created_at' => now(),
            ],
            [
                'code' => 'COC',
                'name' => 'College of Criminology',
                'created_at' => now(),
            ],
            [
                'code' => 'CON',
                'name' => 'College of Nursing',
                'created_at' => now(),
            ],
            [
                'code' => 'CED',
                'name' => 'College of Education',
                'created_at' => now(),
            ],
            [
                'code' => 'CHTM',
                'name' => 'College of Hospitality and Tourism',
                'created_at' => now(),
            ],
            [
                'code' => 'CBAA',
                'name' => 'College of Business Administration and Accountancy',
                'created_at' => now(),
            ],
        ]);
    }
}