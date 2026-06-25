<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Models\Department;
use App\Http\Controllers\DepartmentController;
use App\Models\User;
use App\Http\Controllers\CalendarController;
use App\Models\SchoolYear;
use App\Models\Semester;
use App\Models\Holiday;

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

            'schoolYears' => SchoolYear::orderByDesc('id')->get(),
            'semesters' => Semester::orderByDesc('id')->get(),
            'holidays' => Holiday::orderBy('date')->get(),
            'adminStats' => [
                'totalFaculty' => User::where('role_id', 3)->count(),
                'totalSecretaries' => User::where('role_id', 2)->count(),
                'totalDepartments' => Department::count(),
                'totalHolidays' => Holiday::count(),
                'currentSemester' => Semester::orderByDesc('id')->first(),
                'activeSchoolYear' => SchoolYear::where('is_active', true)->first(),
            ],

            'users' => User::query()
                ->leftJoin('department', 'users.department_id', '=', 'department.id')
                ->whereIn('users.role_id', [2, 3])
                ->orderBy('users.name')
                ->get([
                    'users.id',
                    'users.name',
                    'users.email',
                    'users.employee_id',
                    'users.role_id',
                    'department.code as department_code',
                    'department.name as department_name',
                ])
                ->map(fn ($user) => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'employeeId' => $user->employee_id,
                    'role' => $user->role_id == 2 ? 'secretary' : 'faculty',
                    'dept' => $user->department_code ?? '—',
                    'departmentName' => $user->department_name ?? '—',
                    'position' => $user->role_id == 2 ? 'Administrative Secretary' : 'Faculty Member',
                    'status' => 'active',
                    'avatar' => collect(explode(' ', $user->name))
                        ->map(fn ($part) => strtoupper(substr($part, 0, 1)))
                        ->take(2)
                        ->implode(''),
                ]),
        ]);
    })->name('attendance');

    Route::post('/users/secretary', [UserController::class, 'storeSecretary'])
    ->name('users.secretary.store');

    Route::post('/users/faculty', [UserController::class, 'storeFaculty'])
    ->name('users.faculty.store');
    
    Route::post('/departments', [DepartmentController::class, 'store'])
    ->name('departments.store');

    Route::post('/calendar/configuration', [CalendarController::class, 'storeConfiguration']);
    Route::post('/calendar/holidays', [CalendarController::class, 'storeHoliday']);
    Route::delete('/calendar/holidays/{holiday}', [CalendarController::class, 'deleteHoliday']);


    // Route::get('/attendance', function () {
    // return Inertia::render('attendance/index', [
    //     'departments' => Department::query()
    //         ->orderBy('code')
    //         ->get(['id', 'code', 'name']),
    // ]);
    // })->name('attendance');
});
    

require __DIR__.'/settings.php';