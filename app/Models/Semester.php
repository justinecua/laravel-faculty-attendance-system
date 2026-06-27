<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Semester extends Model
{
    protected $table = 'semester';
    public $timestamps = false;

    protected $fillable = ['school_year_id', 'name', 'start_date', 'end_date', 'created_at'];
}