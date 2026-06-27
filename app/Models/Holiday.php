<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Holiday extends Model
{
    protected $table = 'holiday';
    public $timestamps = false;

    protected $fillable = ['semester_id', 'name', 'date', 'created_at'];
}