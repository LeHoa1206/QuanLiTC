<?php

namespace App\Http\Controllers;

use App\Models\CustomerAddress;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AddressController extends Controller
{
    // Lấy danh sách địa chỉ của user
    public function index(Request $request)
    {
        $addresses = CustomerAddress::where('user_id', $request->user()->id)
            ->orderBy('is_default', 'desc')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($addresses);
    }

    // Lấy địa chỉ mặc định
    public function getDefault(Request $request)
    {
        $address = CustomerAddress::where('user_id', $request->user()->id)
            ->where('is_default', true)
            ->first();

        if (!$address) {
            // Nếu không có địa chỉ mặc định, lấy địa chỉ đầu tiên
            $address = CustomerAddress::where('user_id', $request->user()->id)
                ->first();
        }

        return response()->json($address);
    }

    // Thêm địa chỉ mới
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'label' => 'nullable|string|max:50',
            'full_name' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'address' => 'required|string|max:255',
            'ward' => 'required|string|max:100',
            'ward_code' => 'nullable|string|max:20',
            'district' => 'required|string|max:100',
            'district_code' => 'nullable|string|max:20',
            'city' => 'required|string|max:100',
            'city_code' => 'nullable|string|max:20',
            'postal_code' => 'nullable|string|max:20',
            'is_default' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $address = CustomerAddress::create([
            'user_id' => $request->user()->id,
            'label' => $request->label ?? 'Home',
            'full_name' => $request->full_name,
            'phone' => $request->phone,
            'address' => $request->address,
            'ward' => $request->ward,
            'ward_code' => $request->ward_code,
            'district' => $request->district,
            'district_code' => $request->district_code,
            'city' => $request->city,
            'city_code' => $request->city_code,
            'postal_code' => $request->postal_code,
            'is_default' => $request->is_default ?? false,
        ]);

        // Nếu đặt làm mặc định, bỏ mặc định các địa chỉ khác
        if ($address->is_default) {
            $address->setAsDefault();
        }

        return response()->json([
            'message' => 'Thêm địa chỉ thành công',
            'address' => $address
        ], 201);
    }

    // Cập nhật địa chỉ
    public function update(Request $request, $id)
    {
        $address = CustomerAddress::where('user_id', $request->user()->id)
            ->findOrFail($id);

        $validator = Validator::make($request->all(), [
            'label' => 'nullable|string|max:50',
            'full_name' => 'sometimes|string|max:255',
            'phone' => 'sometimes|string|max:20',
            'address' => 'sometimes|string|max:255',
            'ward' => 'sometimes|string|max:100',
            'ward_code' => 'nullable|string|max:20',
            'district' => 'sometimes|string|max:100',
            'district_code' => 'nullable|string|max:20',
            'city' => 'sometimes|string|max:100',
            'city_code' => 'nullable|string|max:20',
            'postal_code' => 'nullable|string|max:20',
            'is_default' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $address->update($request->all());

        // Nếu đặt làm mặc định, bỏ mặc định các địa chỉ khác
        if ($request->has('is_default') && $request->is_default) {
            $address->setAsDefault();
        }

        return response()->json([
            'message' => 'Cập nhật địa chỉ thành công',
            'address' => $address
        ]);
    }

    // Xóa địa chỉ
    public function destroy(Request $request, $id)
    {
        $address = CustomerAddress::where('user_id', $request->user()->id)
            ->findOrFail($id);

        // Không cho xóa địa chỉ mặc định nếu còn địa chỉ khác
        if ($address->is_default) {
            $otherAddresses = CustomerAddress::where('user_id', $request->user()->id)
                ->where('id', '!=', $id)
                ->count();

            if ($otherAddresses > 0) {
                return response()->json([
                    'message' => 'Không thể xóa địa chỉ mặc định. Vui lòng đặt địa chỉ khác làm mặc định trước.'
                ], 400);
            }
        }

        $address->delete();

        return response()->json([
            'message' => 'Xóa địa chỉ thành công'
        ]);
    }

    // Đặt địa chỉ làm mặc định
    public function setDefault(Request $request, $id)
    {
        $address = CustomerAddress::where('user_id', $request->user()->id)
            ->findOrFail($id);

        $address->setAsDefault();

        return response()->json([
            'message' => 'Đã đặt làm địa chỉ mặc định',
            'address' => $address
        ]);
    }
}
