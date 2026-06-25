<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Models\Department;
use App\Http\Controllers\DepartmentController;
use App\Models\User;

    Route::inertia('/', 'welcome')->name('home');

    Route::middleware(['auth'])->group(function () {
        Route::get('/dashboard', function () {
            return redirect()->route('attendance');
        })->name('dashboard');

    Route::get('/attendance', function () {
        return Inertia::render('attendance/index', [
            'departments' => Department::query()
                ->orderBy('code')
                ->get(['id', 'code', 'name'])
                ->map(fn ($department) => [
                    'id' => $department->id,
                    'code' => $department->code,
                    'name' => $department->name,
                    'facultyCount' => User::where('department_id', $department->id)
                        ->where('role_id', 3)
                        ->count(),
                ]),
        ]);
    })->name('attendance');

    Route::post('/users/secretary', [UserController::class, 'storeSecretary'])
    ->name('users.secretary.store');

    Route::post('/users/faculty', [UserController::class, 'storeFaculty'])
    ->name('users.faculty.store');

    // Route::get('/attendance', function () {
    // return Inertia::render('attendance/index', [
    //     'departments' => Department::query()
    //         ->orderBy('code')
    //         ->get(['id', 'code', 'name']),
    // ]);
    // })->name('attendance');
    
    Route::post('/departments', [DepartmentController::class, 'store'])
    ->name('departments.store');
});
    

require __DIR__.'/settings.php';