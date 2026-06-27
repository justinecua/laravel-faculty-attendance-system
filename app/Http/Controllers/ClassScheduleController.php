<?php

namespace App\Http\Controllers;

use App\Models\ClassSchedule;
use Illuminate\Http\Request;

class ClassScheduleController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'faculty_id' => ['required', 'exists:users,id'],
            'semester_id' => ['required', 'exists:semester,id'],
            'subject_code' => ['required', 'string', 'max:50'],
            'subject_name' => ['required', 'string', 'max:255'],
            'day' => ['required', 'string'],
            'start_time' => ['required'],
            'end_time' => ['required', 'after:start_time'],
            'room' => ['nullable', 'string', 'max:100'],
        ]);

        ClassSchedule::create($validated);

        return back()->with('success', 'Class schedule added.');
    }

    public function destroy(ClassSchedule $classSchedule)
    {
        $classSchedule->delete();

        return back()->with('success', 'Class schedule deleted.');
    }
}