<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ClassSchedule extends Model
{
    protected $fillable = [
        'faculty_id',
        'semester_id',
        'subject_code',
        'subject_name',
        'day',
        'start_time',
        'end_time',
        'room',
    ];
}