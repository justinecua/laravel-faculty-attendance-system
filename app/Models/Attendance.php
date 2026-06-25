<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Attendance extends Model
{
    protected $table = 'attendance';

    protected $fillable = [
        'faculty_id',
        'semester_id',
        'marked_by',
        'date',
        'status',
        'remarks',
    ];
}