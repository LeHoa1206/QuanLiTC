<?php

namespace App\Http\Controllers\Staff;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class StaffDashboardController extends Controller
{
    public function index()
    {
        $staff = Auth::user();
        
        $stats = [
            'todayAppointments' => Appointment::where('staff_id', $staff->id)
                ->whereDate('appointment_date', today())
                ->count(),
            'pending' => Appointment::where('staff_id', $staff->id)
                ->where('status', 'pending')
                ->count(),
            'completed' => Appointment::where('staff_id', $staff->id)
                ->where('status', 'completed')
                ->whereMonth('created_at', now()->month)
                ->count(),
            'messages' => 0, // TODO: Implement messages count
        ];

        $todaySchedule = Appointment::with(['customer', 'pet', 'service'])
            ->where('staff_id', $staff->id)
            ->whereDate('appointment_date', today())
            ->orderBy('appointment_time')
            ->get();

        return response()->json([
            'stats' => $stats,
            'todaySchedule' => $todaySchedule,
        ]);
    }

    public function schedule(Request $request)
    {
        $staff = Auth::user();
        $date = $request->input('date', today());

        $appointments = Appointment::with(['customer', 'pet', 'service'])
            ->where('staff_id', $staff->id)
            ->whereDate('appointment_date', $date)
            ->orderBy('appointment_time')
            ->get();

        return response()->json($appointments);
    }

    public function appointments(Request $request)
    {
        $staff = Auth::user();
        
        $query = Appointment::with(['customer', 'pet', 'service'])
            ->where('staff_id', $staff->id);

        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->whereHas('customer', function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        $appointments = $query->orderBy('appointment_date', 'desc')
            ->orderBy('appointment_time', 'desc')
            ->paginate(20);

        return response()->json($appointments);
    }

    public function updateAppointmentStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:confirmed,in_progress,completed,cancelled',
        ]);

        $appointment = Appointment::findOrFail($id);
        
        // Verify staff owns this appointment
        if ($appointment->staff_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $appointment->update(['status' => $request->status]);

        return response()->json([
            'message' => 'Appointment status updated successfully',
            'appointment' => $appointment->load(['customer', 'pet', 'service']),
        ]);
    }
}
