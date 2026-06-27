<?php

namespace App\Http\Controllers;

use App\Models\Department;
use Illuminate\Http\Request;

class DepartmentController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'code' => ['required', 'string', 'max:20', 'unique:department,code'],
            'name' => ['required', 'string', 'max:255', 'unique:department,name'],
        ]);

        Department::create([
            'code' => strtoupper($validated['code']),
            'name' => $validated['name'],
            'created_at' => now(),
        ]);

        return back()->with('success', 'Department added successfully.');
    }
}