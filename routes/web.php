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
use App\Http\Controllers\AttendanceController;
use App\Models\Attendance;

    Route::redirect('/', '/login')->name('home');

    Route::middleware(['auth'])->group(function () {
        Route::get('/dashboard', function () {
            return redirect()->route('attendance');
        })->name('dashboard');

    Route::get('/attendance/records', function () {
            $date = request('date', now()->toDateString());

            return Attendance::whereDate('date', $date)
                ->get(['faculty_id', 'status']);
        })->name('attendance.records');

    Route::post('/attendance/store', [AttendanceController::class, 'store'])
        ->name('attendance.store');

    Route::get('/attendance', function () {
        $activeSchoolYear = SchoolYear::where('is_active', true)->first();

        $currentSemester = $activeSchoolYear
            ? Semester::where('school_year_id', $activeSchoolYear->id)
                ->whereDate('start_date', '<=', now())
                ->whereDate('end_date', '>=', now())
                ->first()
            : null;
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
            'semesters' => Semester::orderByDesc('id')->get([
                'id',
                'school_year_id',
                'name',
                'start_date',
                'end_date',
            ]),
            'holidays' => Holiday::orderBy('date')->get(),
            'adminStats' => [
                'totalFaculty' => User::where('role_id', 3)->count(),
                'totalSecretaries' => User::where('role_id', 2)->count(),
                'totalDepartments' => Department::count(),
                'totalHolidays' => Holiday::count(),
                'currentSemester' => $currentSemester,
                'activeSchoolYear' => $activeSchoolYear,
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

            'facultyUsers' => User::query()
                ->leftJoin('department', 'users.department_id', '=', 'department.id')
                ->where('users.role_id', 3)
                ->orderBy('users.name')
                ->get([
                    'users.id',
                    'users.name',
                    'users.email',
                    'users.employee_id',
                    'department.code as department_code',
                ])
                ->map(fn ($user) => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'employeeId' => $user->employee_id,
                    'dept' => $user->department_code ?? '—',
                    'avatar' => collect(explode(' ', $user->name))
                        ->map(fn ($part) => strtoupper(substr($part, 0, 1)))
                        ->take(2)
                        ->implode(''),
                ]),

            'tallyData' => User::query()
                ->leftJoin('department', 'users.department_id', '=', 'department.id')
                ->where('users.role_id', 3)
                ->orderBy('users.name')
                ->get([
                    'users.id',
                    'users.name',
                    'department.code as department_code',
                ])
                ->map(function ($user) {
                    $records = Attendance::where('faculty_id', $user->id)->get();

                    $present = $records->where('status', 'present')->count();
                    $absent = $records->where('status', 'absent')->count();
                    $late = $records->where('status', 'late')->count();
                    $total = $records->count();

                    return [
                        'facultyId' => $user->id,
                        'name' => $user->name,
                        'dept' => $user->department_code ?? '—',
                        'total' => $total,
                        'present' => $present,
                        'absent' => $absent,
                        'late' => $late,
                        'rate' => $total > 0 ? round((($present + $late) / $total) * 100, 1) : 0,
                    ];
                }),

            'attendanceRecords' => Attendance::whereDate('date', now()->toDateString())
                ->get(['faculty_id', 'status']),

            'myProfile' => auth()->user()->role_id == 3
                ? User::query()
                    ->leftJoin('department', 'users.department_id', '=', 'department.id')
                    ->where('users.id', auth()->id())
                    ->first([
                        'users.id',
                        'users.name',
                        'users.email',
                        'users.employee_id',
                        'department.code as department_code',
                        'department.name as department_name',
                    ])
                : null,

            'myAttendance' => Attendance::query()
                ->where('faculty_id', auth()->id())
                ->orderByDesc('date')
                ->get(['date', 'status', 'remarks']),
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

    Route::post('/school-years', [CalendarController::class, 'storeSchoolYear']);
    Route::patch('/school-years/{schoolYear}/activate', [CalendarController::class, 'activateSchoolYear']);
});
    

require __DIR__.'/settings.php';