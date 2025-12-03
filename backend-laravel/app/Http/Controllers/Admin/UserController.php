<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    // Danh sách người dùng
    public function index(Request $request)
    {
        $query = User::query();

        if ($request->has('role')) {
            $query->where('role', $request->role);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('search')) {
            $query->where(function($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('email', 'like', '%' . $request->search . '%');
            });
        }

        $users = $query->paginate($request->get('per_page', 15));

        return response()->json($users);
    }

    // Tạo tài khoản
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'phone' => 'nullable|string|max:20',
            'password' => 'required|string|min:6',
            'role' => 'required|in:customer,admin,care_staff,sales_staff',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'password' => Hash::make($request->password),
            'role' => $request->role,
            'status' => 'active',
        ]);

        return response()->json([
            'message' => 'Tạo tài khoản thành công',
            'user' => $user
        ], 201);
    }

    // Xem chi tiết user
    public function show($id)
    {
        $user = User::findOrFail($id);
        return response()->json($user);
    }

    // Cập nhật user
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $id,
            'phone' => 'nullable|string|max:20',
            'role' => 'sometimes|in:customer,admin,staff,sales',
            'status' => 'sometimes|in:active,inactive,banned',
        ]);

        $user->update($request->all());

        return response()->json([
            'message' => 'Cập nhật thành công',
            'user' => $user
        ]);
    }

    // Xóa user
    public function destroy($id)
    {
        $user = User::findOrFail($id);
        
        if ($user->id === auth()->id()) {
            return response()->json(['message' => 'Không thể xóa tài khoản của chính mình'], 400);
        }

        $user->delete();
        return response()->json(['message' => 'Xóa user thành công']);
    }

    // Khóa/Mở khóa user
    public function toggleStatus($id)
    {
        $user = User::findOrFail($id);
        
        if ($user->id === auth()->id()) {
            return response()->json(['message' => 'Không thể khóa tài khoản của chính mình'], 400);
        }

        $newStatus = $user->status === 'active' ? 'inactive' : 'active';
        $user->update(['status' => $newStatus]);

        return response()->json([
            'message' => $newStatus === 'active' ? 'Mở khóa thành công' : 'Khóa tài khoản thành công',
            'user' => $user
        ]);
    }

    // Xóa nhiều users
    public function bulkDelete(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'required|integer|exists:users,id'
        ]);

        $ids = array_filter($request->ids, fn($id) => $id !== auth()->id());
        User::whereIn('id', $ids)->delete();

        return response()->json(['message' => 'Xóa ' . count($ids) . ' users thành công']);
    }
}
