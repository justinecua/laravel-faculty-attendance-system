<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('department', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('code');
            $table->timestamp('created_at');
        });

        Schema::create('school_year', function (Blueprint $table) {
            $table->id();
            $table->string('year_label');
            $table->boolean('is_active');
            $table->timestamp('created_at');
        });

        Schema::create('semester', function (Blueprint $table) {
            $table->id();
            $table->foreignId('school_year_id')->nullable();
            $table->string('name');
            $table->date('start_date');
            $table->date('end_date');
            $table->timestamp('created_at');
        });

        Schema::create('holiday', function (Blueprint $table) {
            $table->id();
            $table->foreignId('semester_id')->nullable();
            $table->string('name');
            $table->date('date');
            $table->timestamp('created_at');
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};