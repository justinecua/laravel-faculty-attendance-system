<?php

namespace App\Http\Controllers;

use App\Models\SchoolYear;
use App\Models\Semester;
use App\Models\Holiday;
use Illuminate\Http\Request;

class CalendarController extends Controller
{
    public function storeConfiguration(Request $request)
    {
        $validated = $request->validate([
            'year_label' => ['required', 'string', 'max:255'],
            'semester_name' => ['required', 'string', 'max:255'],
            'start_date' => ['required', 'date'],
            'end_date' => ['required', 'date', 'after_or_equal:start_date'],
        ]);

        SchoolYear::query()->update(['is_active' => false]);

        $schoolYear = SchoolYear::create([
            'year_label' => $validated['year_label'],
            'is_active' => true,
            'created_at' => now(),
        ]);

        Semester::create([
            'school_year_id' => $schoolYear->id,
            'name' => $validated['semester_name'],
            'start_date' => $validated['start_date'],
            'end_date' => $validated['end_date'],
            'created_at' => now(),
        ]);

        return back()->with('success', 'Calendar configuration saved.');
    }

    public function storeHoliday(Request $request)
    {
        $validated = $request->validate([
            'semester_id' => ['required', 'exists:semester,id'],
            'name' => ['required', 'string', 'max:255'],
            'date' => ['required', 'date'],
        ]);

        Holiday::create([
            'semester_id' => $validated['semester_id'],
            'name' => $validated['name'],
            'date' => $validated['date'],
            'created_at' => now(),
        ]);

        return back()->with('success', 'Holiday added.');
    }

    public function deleteHoliday(Holiday $holiday)
    {
        $holiday->delete();

        return back()->with('success', 'Holiday deleted.');
    }
}