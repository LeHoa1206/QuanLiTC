<?php

namespace App\Http\Controllers;

use App\Models\Service;
use App\Models\ServiceCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ServiceController extends Controller
{
    // Lấy danh sách dịch vụ
    public function index(Request $request)
    {
        $query = Service::with('category')->active();

        // Lọc theo danh mục
        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        // Tìm kiếm
        if ($request->has('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        $services = $query->paginate($request->get('per_page', 12));

        return response()->json($services);
    }

    // Xem chi tiết dịch vụ
    public function show($id)
    {
        $service = Service::with(['category', 'reviews.user'])->findOrFail($id);

        return response()->json($service);
    }

    // Thêm dịch vụ (Admin)
    public function store(Request $request)
    {
        $request->validate([
            'category_id' => 'required|exists:service_categories,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'duration' => 'nullable|integer',
            'image' => 'nullable|string',
        ]);

        $service = Service::create([
            'category_id' => $request->category_id,
            'name' => $request->name,
            'slug' => Str::slug($request->name),
            'description' => $request->description,
            'price' => $request->price,
            'duration' => $request->duration,
            'image' => $request->image,
            'status' => 'active',
        ]);

        return response()->json([
            'message' => 'Thêm dịch vụ thành công',
            'service' => $service
        ], 201);
    }

    // Cập nhật dịch vụ (Admin)
    public function update(Request $request, $id)
    {
        $service = Service::findOrFail($id);

        $request->validate([
            'category_id' => 'sometimes|exists:service_categories,id',
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'price' => 'sometimes|numeric|min:0',
            'duration' => 'nullable|integer',
            'image' => 'nullable|string',
            'status' => 'sometimes|in:active,inactive',
        ]);

        if ($request->has('name')) {
            $service->slug = Str::slug($request->name);
        }

        $service->update($request->all());

        return response()->json([
            'message' => 'Cập nhật dịch vụ thành công',
            'service' => $service
        ]);
    }

    // Xóa dịch vụ (Admin)
    public function destroy($id)
    {
        $service = Service::findOrFail($id);
        $service->delete();

        return response()->json([
            'message' => 'Xóa dịch vụ thành công'
        ]);
    }

    // Lấy danh mục dịch vụ
    public function categories()
    {
        $categories = ServiceCategory::active()->get();

        return response()->json($categories);
    }
}
