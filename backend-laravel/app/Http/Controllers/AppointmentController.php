<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\Service;
use Illuminate\Http\Request;

class AppointmentController extends Controller
{
    // Lấy danh sách lịch hẹn của khách
    public function index(Request $request)
    {
        $appointments = Appointment::with(['service', 'pet', 'staff'])
            ->where('user_id', $request->user()->id)
            ->orderBy('appointment_date', 'desc')
            ->orderBy('appointment_time', 'desc')
            ->paginate(10);

        return response()->json($appointments);
    }

    // Xem chi tiết lịch hẹn
    public function show(Request $request, $id)
    {
        $appointment = Appointment::with(['service', 'pet', 'staff'])
            ->where('id', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        return response()->json($appointment);
    }

    // Đặt lịch
    public function store(Request $request)
    {
        $request->validate([
            'service_id' => 'required|exists:services,id',
            'pet_name' => 'required|string',
            'pet_type' => 'required|string',
            'pet_age' => 'nullable|integer',
            'pet_weight' => 'nullable|numeric',
            'appointment_date' => 'required|date|after_or_equal:today',
            'appointment_time' => 'required',
            'customer_name' => 'required|string',
            'phone' => 'required|string',
            'email' => 'nullable|email',
            'address' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        $appointment = Appointment::create([
            'user_id' => $request->user()->id,
            'service_id' => $request->service_id,
            'pet_name' => $request->pet_name,
            'pet_type' => $request->pet_type,
            'pet_age' => $request->pet_age,
            'pet_weight' => $request->pet_weight,
            'appointment_date' => $request->appointment_date,
            'appointment_time' => $request->appointment_time,
            'customer_name' => $request->customer_name,
            'phone' => $request->phone,
            'email' => $request->email,
            'address' => $request->address,
            'status' => 'pending',
            'notes' => $request->notes,
        ]);

        return response()->json([
            'message' => 'Đặt lịch thành công',
            'appointment' => $appointment->load('service')
        ], 201);
    }

    // Chỉnh sửa lịch (nếu chưa thực hiện)
    public function update(Request $request, $id)
    {
        $appointment = Appointment::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        if (!in_array($appointment->status, ['pending', 'confirmed'])) {
            return response()->json([
                'message' => 'Không thể chỉnh sửa lịch hẹn này'
            ], 400);
        }

        $request->validate([
            'appointment_date' => 'sometimes|date|after_or_equal:today',
            'appointment_time' => 'sometimes|date_format:H:i',
            'notes' => 'nullable|string',
        ]);

        $appointment->update($request->only(['appointment_date', 'appointment_time', 'notes']));

        return response()->json([
            'message' => 'Cập nhật lịch hẹn thành công',
            'appointment' => $appointment->load(['service', 'pet'])
        ]);
    }

    // Hủy lịch
    public function cancel(Request $request, $id)
    {
        $appointment = Appointment::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        if (!in_array($appointment->status, ['pending', 'confirmed'])) {
            return response()->json([
                'message' => 'Không thể hủy lịch hẹn này'
            ], 400);
        }

        $appointment->update(['status' => 'cancelled']);

        return response()->json([
            'message' => 'Hủy lịch hẹn thành công',
            'appointment' => $appointment
        ]);
    }

    // Lấy giờ đã đặt cho một ngày cụ thể
    public function getBookedTimes(Request $request)
    {
        $request->validate([
            'service_id' => 'required|exists:services,id',
            'date' => 'required|date',
        ]);

        $bookedTimes = Appointment::where('service_id', $request->service_id)
            ->where('appointment_date', $request->date)
            ->whereIn('status', ['pending', 'confirmed', 'in_progress'])
            ->pluck('appointment_time')
            ->toArray();

        return response()->json([
            'booked_times' => $bookedTimes
        ]);
    }
}
