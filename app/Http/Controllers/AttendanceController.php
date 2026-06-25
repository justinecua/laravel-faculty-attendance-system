<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\Semester;
use Illuminate\Http\Request;

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

        $semester = Semester::orderByDesc('id')->first();

        foreach ($validated['attendance'] as $row) {
            Attendance::updateOrCreate(
                [
                    'faculty_id' => $row['faculty_id'],
                    'date' => $validated['date'],
                ],
                [
                    'semester_id' => $semester?->id,
                    'marked_by' => auth()->id(),
                    'status' => $row['status'],
                    'remarks' => $row['status'],
                ]
            );
        }

        return back()->with('success', 'Attendance saved successfully.');
    }
}