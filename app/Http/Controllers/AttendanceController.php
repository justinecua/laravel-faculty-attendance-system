<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use Illuminate\Http\Request;
use App\Models\SchoolYear;
use App\Models\Semester;

class AttendanceController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'date' => ['required', 'date'],
            'attendance' => ['required', 'array'],
            'attendance.*.faculty_id' => ['required', 'exists:users,id'],
            'attendance.*.status' => ['required', 'in:present,absent,late'],
        ]);

        $activeSchoolYear = SchoolYear::where('is_active', true)->first();

        $semester = $activeSchoolYear
            ? Semester::where('school_year_id', $activeSchoolYear->id)
                ->whereDate('start_date', '<=', $validated['date'])
                ->whereDate('end_date', '>=', $validated['date'])
                ->first()
            : null;

        if (!$semester) {
            return back()->withErrors([
                'semester' => 'No active semester found for this date.',
            ]);
        }

        foreach ($validated['attendance'] as $record) {
            Attendance::updateOrCreate(
                [
                    'faculty_id' => $record['faculty_id'],
                    'date' => $validated['date'],
                ],
                [
                    'semester_id' => $semester->id,
                    'marked_by' => auth()->id(),
                    'status' => $record['status'],
                    'remarks' => $record['status'],
                ],
            );
        }

        return back()->with('success', 'Attendance saved.');
    }
}