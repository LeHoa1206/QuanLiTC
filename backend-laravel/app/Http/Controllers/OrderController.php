<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Cart;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    // Lấy danh sách đơn hàng của khách
    public function index(Request $request)
    {
        $orders = Order::with('items.product')
            ->where('customer_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return response()->json($orders);
    }

    // Xem chi tiết đơn hàng
    public function show(Request $request, $id)
    {
        $order = Order::with('items.product')
            ->where('id', $id)
            ->where('customer_id', $request->user()->id)
            ->firstOrFail();

        return response()->json($order);
    }

    // Tạo đơn hàng (Checkout)
    public function store(Request $request)
    {
        $request->validate([
            'shipping_address' => 'required|string',
            'phone' => 'required|string|max:20',
            'payment_method' => 'required|in:cash,bank_transfer,vnpay,momo',
            'notes' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.price' => 'required|numeric|min:0',
        ]);

        $user = $request->user();
        $items = $request->items;

        // Debug log
        \Log::info('Order Request Data:', [
            'items' => $items,
            'shipping_address' => $request->shipping_address,
            'phone' => $request->phone,
        ]);

        if (empty($items)) {
            return response()->json([
                'message' => 'Giỏ hàng trống'
            ], 400);
        }

        DB::beginTransaction();
        try {
            $totalAmount = 0;
            
            // Kiểm tra tồn kho và tính tổng tiền
            foreach ($items as $item) {
                $product = Product::find($item['product_id']);
                
                if (!$product) {
                    return response()->json([
                        'message' => "Sản phẩm không tồn tại"
                    ], 400);
                }
                
                if ($product->stock_quantity < $item['quantity']) {
                    return response()->json([
                        'message' => "Sản phẩm {$product->name} không đủ số lượng"
                    ], 400);
                }
                
                $totalAmount += $item['price'] * $item['quantity'];
            }

            // Tạo đơn hàng
            $order = Order::create([
                'customer_id' => $user->id,
                'order_number' => Order::generateOrderNumber(),
                'subtotal' => $totalAmount,
                'discount_amount' => 0,
                'total_amount' => $totalAmount,
                'payment_method' => $request->payment_method,
                'payment_status' => 'pending',
                'order_status' => 'pending',
                'shipping_address' => $request->shipping_address,
                'phone' => $request->phone,
                'notes' => $request->notes,
                'created_by' => $user->id,
                'created_by_role' => 'customer',
            ]);

            // Tạo order items và trừ tồn kho
            foreach ($items as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'price' => $item['price'],
                    'subtotal' => $item['price'] * $item['quantity'],
                ]);

                // Trừ tồn kho
                $product = Product::find($item['product_id']);
                if ($product) {
                    // Sử dụng DB::statement để update trực tiếp
                    DB::statement(
                        'UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?',
                        [$item['quantity'], $item['product_id']]
                    );
                }
            }

            DB::commit();

            return response()->json([
                'message' => 'Đặt hàng thành công',
                'order' => $order->load('items.product')
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Có lỗi xảy ra khi đặt hàng',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Admin: Lấy tất cả đơn hàng
    public function adminIndex(Request $request)
    {
        $query = Order::with(['items.product', 'customer']);
        
        // Filter by status
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('order_status', $request->status);
        }
        
        // Search by order number or customer
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('order_number', 'like', "%{$search}%")
                  ->orWhereHas('customer', function($q2) use ($search) {
                      $q2->where('name', 'like', "%{$search}%");
                  });
            });
        }
        
        $orders = $query->orderBy('created_at', 'desc')->paginate(50);
        
        return response()->json($orders);
    }

    // Admin: Xem chi tiết đơn hàng
    public function adminShow($id)
    {
        $order = Order::with(['items.product', 'customer'])->findOrFail($id);
        return response()->json($order);
    }

    // Admin: Cập nhật trạng thái đơn hàng
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:pending,confirmed,processing,delivered,cancelled'
        ]);
        
        $order = Order::findOrFail($id);
        $order->update(['order_status' => $request->status]);
        
        return response()->json([
            'message' => 'Cập nhật trạng thái thành công',
            'order' => $order->load(['items.product', 'customer'])
        ]);
    }

    // Admin: Xóa đơn hàng
    public function adminDestroy($id)
    {
        $order = Order::findOrFail($id);
        $order->delete();
        
        return response()->json([
            'message' => 'Xóa đơn hàng thành công'
        ]);
    }

    // Admin: Xóa nhiều đơn hàng
    public function bulkDelete(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'required|integer|exists:orders,id'
        ]);
        
        Order::whereIn('id', $request->ids)->delete();
        
        return response()->json([
            'message' => 'Xóa ' . count($request->ids) . ' đơn hàng thành công'
        ]);
    }

    // Hủy đơn hàng
    public function cancel(Request $request, $id)
    {
        try {
            $order = Order::with('items.product')
                ->where('id', $id)
                ->where('customer_id', $request->user()->id)
                ->firstOrFail();

            // Chỉ cho phép hủy đơn hàng khi đang ở trạng thái "Chờ xác nhận"
            if ($order->order_status !== 'pending') {
                return response()->json([
                    'message' => 'Chỉ có thể hủy đơn hàng đang ở trạng thái "Chờ xác nhận"'
                ], 400);
            }

            DB::beginTransaction();
            
            // Hoàn lại tồn kho
            foreach ($order->items as $item) {
                if ($item->product) {
                    // Sử dụng DB::statement để update trực tiếp
                    DB::statement(
                        'UPDATE products SET stock_quantity = stock_quantity + ? WHERE id = ?',
                        [$item->quantity, $item->product_id]
                    );
                }
            }

            $order->update(['order_status' => 'cancelled']);

            DB::commit();

            return response()->json([
                'message' => 'Hủy đơn hàng thành công',
                'order' => $order->load('items.product')
            ]);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Không tìm thấy đơn hàng'
            ], 404);
        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Cancel order error: ' . $e->getMessage());
            \Log::error('Stack trace: ' . $e->getTraceAsString());
            
            return response()->json([
                'message' => 'Có lỗi xảy ra khi hủy đơn hàng',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
