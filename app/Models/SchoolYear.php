<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SchoolYear extends Model
{
    protected $table = 'school_year';
    public $timestamps = false;

    protected $fillable = ['year_label', 'is_active', 'created_at'];
}