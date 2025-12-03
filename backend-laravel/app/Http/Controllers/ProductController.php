<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    // Lấy danh sách sản phẩm (có lọc, tìm kiếm, phân trang)
    public function index(Request $request)
    {
        try {
            $query = Product::query();
            
            // Search by keyword
            if ($request->has('search')) {
                $search = $request->get('search');
                $query->where(function($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('description', 'like', "%{$search}%");
                });
            }
            
            // Filter by category
            if ($request->has('category_id')) {
                $query->where('category_id', $request->get('category_id'));
            }
            
            // Filter by status
            $query->where('status', 'active');
            
            // Sắp xếp
            $sortBy = $request->get('sort_by', 'id');
            $sortOrder = $request->get('sort_order', 'desc');
            $query->orderBy($sortBy, $sortOrder);

            // Pagination
            $perPage = $request->get('per_page', 50);
            $products = $query->paginate($perPage);
            
            return response()->json($products);
        } catch (\Exception $e) {
            \Log::error('Products API Error: ' . $e->getMessage());
            return response()->json([
                'error' => 'Database error',
                'message' => $e->getMessage(),
                'line' => $e->getLine(),
                'file' => $e->getFile()
            ], 500);
        }
    }

    // Xem chi tiết sản phẩm
    public function show($id)
    {
        try {
            // First, try to get the product
            $product = Product::findOrFail($id);
            
            // Try to load category
            try {
                $product->load('category');
            } catch (\Exception $e) {
                \Log::warning("Failed to load category for product {$id}: " . $e->getMessage());
                $product->category = null;
            }
            
            // Try to load reviews
            try {
                $product->load('reviews.user');
            } catch (\Exception $e) {
                \Log::warning("Failed to load reviews for product {$id}: " . $e->getMessage());
                $product->reviews = [];
            }
            
            return response()->json($product);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'error' => 'Product not found',
                'message' => "Product with ID {$id} does not exist"
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Server error',
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine()
            ], 500);
        }
    }

    // Thêm sản phẩm (Admin)
    public function store(Request $request)
    {
        $request->validate([
            'category_id' => 'required|exists:product_categories,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'sale_price' => 'nullable|numeric|min:0',
            'stock_quantity' => 'required|integer|min:0',
            'main_image' => 'nullable|string',
        ]);

        $product = Product::create([
            'category_id' => $request->category_id,
            'name' => $request->name,
            'slug' => Str::slug($request->name),
            'description' => $request->description,
            'price' => $request->price,
            'sale_price' => $request->sale_price,
            'stock_quantity' => $request->stock_quantity,
            'main_image' => $request->main_image,
            'status' => 'active',
        ]);

        return response()->json([
            'message' => 'Thêm sản phẩm thành công',
            'product' => $product
        ], 201);
    }

    // Cập nhật sản phẩm (Admin)
    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        $request->validate([
            'category_id' => 'sometimes|exists:product_categories,id',
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'price' => 'sometimes|numeric|min:0',
            'sale_price' => 'nullable|numeric|min:0',
            'stock_quantity' => 'sometimes|integer|min:0',
            'main_image' => 'nullable|string',
            'status' => 'sometimes|in:active,inactive,out_of_stock',
        ]);

        if ($request->has('name')) {
            $product->slug = Str::slug($request->name);
        }

        $product->update($request->all());

        return response()->json([
            'message' => 'Cập nhật sản phẩm thành công',
            'product' => $product
        ]);
    }

    // Xóa sản phẩm (Admin)
    public function destroy($id)
    {
        $product = Product::findOrFail($id);
        $product->delete();

        return response()->json([
            'message' => 'Xóa sản phẩm thành công'
        ]);
    }

    // Lấy danh sách danh mục sản phẩm
    public function categories()
    {
        try {
            $categories = ProductCategory::all();
            return response()->json($categories);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Database error',
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine()
            ], 500);
        }
    }
}
