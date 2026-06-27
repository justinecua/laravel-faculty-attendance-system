<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function storeSecretary(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'unique:users,email'],
            'employee_id' => ['required', 'string', 'unique:users,employee_id'],
            'password' => ['required', 'min:8'],
        ]);

        User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'employee_id' => $validated['employee_id'],
            'password' => Hash::make($validated['password']),
            'role_id' => 2, 
            'department_id' => null,
        ]);

        return back()->with('success', 'Secretary account created.');
    }
    
    public function storeFaculty(Request $request)
{
    $validated = $request->validate([
        'name' => ['required', 'string', 'max:255'],
        'email' => ['required', 'email', 'unique:users,email'],
        'employee_id' => ['required', 'string', 'unique:users,employee_id'],
        'password' => ['required', 'min:8'],
        'department_id' => ['required', 'exists:department,id'],
    ]);

    User::create([
        'name' => $validated['name'],
        'email' => $validated['email'],
        'employee_id' => $validated['employee_id'],
        'password' => Hash::make($validated['password']),
        'role_id' => 3,
        'department_id' => $validated['department_id'],
    ]);

    return back()->with('success', 'Faculty account created.');
}
}