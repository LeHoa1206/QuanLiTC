<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Http;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Cart;
use App\Models\Product;
use App\Models\Voucher;
use App\Models\Notification;
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
            'coupon_code' => 'nullable|string',
            'discount' => 'nullable|numeric|min:0',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.price' => 'required|numeric|min:0',
        ]);

        $user = $request->user();
        $items = $request->items;
        $couponCode = $request->coupon_code;
        $discount = $request->discount ?? 0;

        // Debug log
        \Log::info('Order Request Data:', [
            'items' => $items,
            'shipping_address' => $request->shipping_address,
            'phone' => $request->phone,
            'coupon_code' => $couponCode,
            'discount' => $discount,
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

            // Kiểm tra và validate voucher nếu có
            $voucher = null;
            if ($couponCode) {
                $voucher = Voucher::where('code', $couponCode)
                    ->where('status', 'active')
                    ->first();
                
                if (!$voucher) {
                    return response()->json([
                        'message' => 'Mã giảm giá không hợp lệ'
                    ], 400);
                }

                // Kiểm tra usage limit
                if ($voucher->usage_limit && ($voucher->used_count ?? 0) >= $voucher->usage_limit) {
                    return response()->json([
                        'message' => 'Mã giảm giá đã hết lượt sử dụng'
                    ], 400);
                }
            }

            // Tính tổng tiền sau khi giảm giá
            $finalTotal = max(0, $totalAmount - $discount);

            // Tạo đơn hàng
            $order = Order::create([
                'customer_id' => $user->id,
                'order_number' => Order::generateOrderNumber(),
                'subtotal' => $totalAmount,
                'discount_amount' => $discount,
                'total_amount' => $finalTotal,
                'voucher_code' => $couponCode,
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
                DB::statement(
                    'UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?',
                    [$item['quantity'], $item['product_id']]
                );
            }


                  \Log::info('Payment method received:', ['method' => $request->payment_method, 'type' => gettype($request->payment_method)]);

            // Cập nhật số lần sử dụng voucher
            if ($voucher) {
                $voucher->increment('used_count');
            }

            // Tạo thông báo (không ảnh hưởng đến việc tạo đơn hàng)
            try {
                // Tạo thông báo cho admin khi có đơn hàng mới
                Notification::createForAdmins(
                    'order',
                    'Đơn hàng mới #' . $order->order_number,
                    'Khách hàng ' . $user->name . ' vừa đặt đơn hàng mới với tổng tiền ' . number_format($finalTotal) . 'đ',
                    '/admin/orders'
                );

                // Tạo thông báo cho khách hàng xác nhận đơn hàng
                Notification::createForUser(
                    $user->id,
                    'order',
                    'Đặt hàng thành công',
                    'Đơn hàng #' . $order->order_number . ' của bạn đã được tạo thành công. Chúng tôi sẽ xử lý đơn hàng trong thời gian sớm nhất.',
                    '/orders'
                );
            } catch (\Exception $notificationError) {
                // Log lỗi notification nhưng không ảnh hưởng đến đơn hàng
                \Log::error('Notification error: ' . $notificationError->getMessage());
            }

            // Cập nhật số lần sử dụng voucher
            if ($voucher) {
                $voucher->increment('used_count');
            }

            // Tạo thông báo (không ảnh hưởng đến việc tạo đơn hàng)
            try {
                // Tạo thông báo cho admin khi có đơn hàng mới
                Notification::createForAdmins(
                    'order',
                    'Đơn hàng mới #' . $order->order_number,
                    'Khách hàng ' . $user->name . ' vừa đặt đơn hàng mới với tổng tiền ' . number_format($finalTotal) . 'đ',
                    '/admin/orders'
                );

                // Tạo thông báo cho khách hàng xác nhận đơn hàng
                Notification::createForUser(
                    $user->id,
                    'order',
                    'Đặt hàng thành công',
                    'Đơn hàng #' . $order->order_number . ' của bạn đã được tạo thành công. Chúng tôi sẽ xử lý đơn hàng trong thời gian sớm nhất.',
                    '/orders'
                );
            } catch (\Exception $notificationError) {
                // Log lỗi notification nhưng không ảnh hưởng đến đơn hàng
                \Log::error('Notification error: ' . $notificationError->getMessage());
            }

            DB::commit();


        $paymentUrl = null;
        
        // ✅ Kiểm tra chính xác
        if ($request->payment_method === 'momo' || $request->payment_method == 'momo') {
            \Log::info('✅ MoMo method detected!');
            $paymentUrl = $this->generateMomoPaymentUrl($order);
            \Log::info('Generated payment_url:', ['url' => $paymentUrl, 'is_null' => is_null($paymentUrl)]);
        } else {
            \Log::info('❌ MoMo NOT detected. Payment method is: ' . $request->payment_method);
        }

        DB::commit();

        return response()->json([
            'order_id' => $order->id,
            'order_number' => $order->order_number,
            'total_amount' => $order->total_amount,
            'payment_url' => $paymentUrl,  // ✅ Đảm bảo có dòng này
            'message' => 'Tạo đơn hàng thành công'
        ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Order creation error: ' . $e->getMessage());
            return response()->json([
                'message' => 'Có lỗi xảy ra khi tạo đơn hàng',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    private function generateMomoPaymentUrl($order)
{
    $endpoint = "https://test-payment.momo.vn/v2/gateway/api/create";
    $partnerCode = "MOMO";
    $accessKey = "F8BBA842ECF85";
    $secretKey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
    
    // FIX 1: Xóa khoảng trắng thừa
    $domain = "https://lamar-nonvenous-pudgily.ngrok-free.dev"; 
    
    $requestId = (string)time();
    $orderId = (string)$order->order_number . "_" . $requestId;
    
    // FIX 2: Ép kiểu int để loại bỏ số thập phân
    $amount = (string)(int)$order->total_amount;
    
    $orderInfo = "Thanh toan don hang #" . $order->order_number;
    $redirectUrl = "http://localhost:5173/checkout"; 
    $ipnUrl = $domain . "/api/momo/ipn"; 
    $extraData = "";
    $requestType = "captureWallet";

    // Tạo chuỗi hash
    $rawHash = "accessKey=" . $accessKey .
               "&amount=" . $amount .
               "&extraData=" . $extraData .
               "&ipnUrl=" . $ipnUrl .
               "&orderId=" . $orderId .
               "&orderInfo=" . $orderInfo .
               "&partnerCode=" . $partnerCode .
               "&redirectUrl=" . $redirectUrl .
               "&requestId=" . $requestId .
               "&requestType=" . $requestType;

    $signature = hash_hmac("sha256", $rawHash, $secretKey);
    
    $data = [
        'partnerCode' => $partnerCode,
        'partnerName' => "Test Momo",
        'storeId' => "MomoTestStore",
        'requestId' => $requestId,
        'amount' => $amount,
        'orderId' => $orderId,
        'orderInfo' => $orderInfo,
        'redirectUrl' => $redirectUrl,
        'ipnUrl' => $ipnUrl,
        'lang' => 'vi',
        'extraData' => $extraData,
        'requestType' => $requestType,
        'signature' => $signature
    ];

    $response = Http::post($endpoint, $data);
    $json = $response->json();

    // Log kết quả để debug
    \Log::info('MoMo Response:', $json);

    if (isset($json['payUrl'])) {
        return $json['payUrl'];
    }
    
    \Log::error('MoMo Create Error: ' . json_encode($json));
    return null;
}
    public function paymentstatus($id)
    {
        try {
            $order = Order::findOrFail($id);
            
            // Kiểm tra xác thực
            if ($order->customer_id !== auth()->id()) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }

            return response()->json([
                'order_id' => $order->id,
                'payment_status' => $order->payment_status,
                'order_status' => $order->order_status,
                'status' => $order->payment_status === 'completed' ? 'paid' : $order->payment_status,
                'message' => 'Payment status retrieved'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Order not found',
                'error' => $e->getMessage()
            ], 404);
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
        
        $order = Order::with('customer')->findOrFail($id);
        $oldStatus = $order->order_status;
        $newStatus = $request->status;
        
        $order->update(['order_status' => $newStatus]);
        
        // Tạo thông báo cho khách hàng khi trạng thái thay đổi
        if ($oldStatus !== $newStatus && $order->customer) {
            try {
                $statusMessages = [
                    'pending' => 'Đơn hàng đang chờ xác nhận',
                    'confirmed' => 'Đơn hàng đã được xác nhận và đang chuẩn bị',
                    'processing' => 'Đơn hàng đang được xử lý',
                    'delivered' => 'Đơn hàng đã được giao thành công',
                    'cancelled' => 'Đơn hàng đã bị hủy'
                ];

                $title = 'Cập nhật đơn hàng #' . $order->order_number;
                $content = $statusMessages[$newStatus] ?? 'Trạng thái đơn hàng đã được cập nhật';

                Notification::createForUser(
                    $order->customer->id,
                    'order',
                    $title,
                    $content,
                    '/orders'
                );
            } catch (\Exception $notificationError) {
                // Log lỗi notification nhưng không ảnh hưởng đến cập nhật trạng thái
                \Log::error('Notification error: ' . $notificationError->getMessage());
            }
        }
        
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
