<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;  // Model Order của bạn
use App\Models\OrderItem;  // Model OrderItem của bạn
use Illuminate\Support\Facades\Auth;  // Để lấy user auth

class VnpayController extends Controller
{
    public function create(Request $request)
    {
        // Validate input từ frontend
        $validated = $request->validate([
            'total_amount' => 'required|numeric',
            'shipping_address' => 'required',
            'phone' => 'required',
            'notes' => 'nullable',
            'items' => 'required|array',
            'items.*.product_id' => 'required|integer',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.price' => 'required|numeric',
        ]);

        // Tính subtotal từ items để đảm bảo khớp với total_amount
        $subtotal = 0;
        foreach ($validated['items'] as $item) {
            $subtotal += $item['quantity'] * $item['price'];
        }

        // Kiểm tra nếu total_amount khớp với subtotal tính toán (phòng lỗi)
        if (abs($subtotal - $validated['total_amount']) > 0.01) {
            return response()->json(['error' => 'Tổng tiền không khớp với chi tiết items'], 400);
        }

        // Tạo order pending
        $order = new Order();
        $order->order_number = Order::generateOrderNumber();
        $order->customer_id = Auth::id() ?? null;  // Nếu có auth, dùng customer_id
        $order->sales_staff_id = null;  // Set nếu cần, ví dụ: từ auth nếu là staff
        $order->subtotal = $subtotal;
        $order->discount_amount = 0;  // Giả định không discount, chỉnh nếu cần
        $order->total_amount = $subtotal - $order->discount_amount;
        $order->payment_method = 'vnpay';
        $order->payment_status = 'pending';  // Sử dụng payment_status
        $order->order_status = 'pending';  // Sử dụng order_status
        $order->shipping_address = $validated['shipping_address'];
        $order->phone = $validated['phone'];
        $order->notes = $validated['notes'];
        $order->created_by = Auth::id() ?? null;
        $order->created_by_role = Auth::user() ? Auth::user()->role : 'customer';  // Giả định user có role, chỉnh nếu cần
        $order->save();

        // Tạo items (hasMany OrderItem)
        foreach ($validated['items'] as $item) {
            $orderItem = new OrderItem();
            $orderItem->order_id = $order->id;
            $orderItem->product_id = $item['product_id'];
            $orderItem->quantity = $item['quantity'];
            $orderItem->price = $item['price'];
            $orderItem->subtotal = $item['quantity'] * $item['price'];  // Tính subtotal cho item
            $orderItem->save();
        }

        $vnp_TmnCode = env('VNPAY_TMN_CODE');
        $vnp_HashSecret = env('VNPAY_HASH_SECRET');
        $vnp_Url = env('VNPAY_URL');
        $vnp_Returnurl = env('VNPAY_RETURN_URL');
        $vnp_TxnRef = $order->id;  // Dùng order ID làm ref
        $vnp_OrderInfo = "Thanh toan don hang " . $order->order_number;  // Dùng order_number cho info
        $vnp_OrderType = 'other';
        $vnp_Amount = $order->total_amount * 100;  // Nhân 100
        $vnp_Locale = 'vn';
        $vnp_IpAddr = $request->ip();

        $inputData = [
            "vnp_Version" => "2.1.0",
            "vnp_TmnCode" => $vnp_TmnCode,
            "vnp_Amount" => $vnp_Amount,
            "vnp_Command" => "pay",
            "vnp_CreateDate" => date('YmdHis'),
            "vnp_CurrCode" => "VND",
            "vnp_IpAddr" => $vnp_IpAddr,
            "vnp_Locale" => $vnp_Locale,
            "vnp_OrderInfo" => $vnp_OrderInfo,
            "vnp_OrderType" => $vnp_OrderType,
            "vnp_ReturnUrl" => $vnp_Returnurl,
            "vnp_TxnRef" => $vnp_TxnRef,
        ];

        ksort($inputData);
        $query = "";
        $i = 0;
        $hashdata = "";
        foreach ($inputData as $key => $value) {
            if ($i == 1) {
                $hashdata .= '&' . urlencode($key) . "=" . urlencode($value);
            } else {
                $hashdata .= urlencode($key) . "=" . urlencode($value);
                $i = 1;
            }
            $query .= urlencode($key) . "=" . urlencode($value) . '&';
        }

        $vnp_Url = $vnp_Url . "?" . $query;
        $vnpSecureHash = hash_hmac('sha512', $hashdata, $vnp_HashSecret);
        $vnp_Url .= 'vnp_SecureHash=' . $vnpSecureHash;

        return response()->json(['payment_url' => $vnp_Url]);
    }

    public function return(Request $request)
    {
        $vnp_HashSecret = env('VNPAY_HASH_SECRET');
        $vnp_SecureHash = $request->vnp_SecureHash;
        $inputData = $request->except('vnp_SecureHash');

        ksort($inputData);
        $hashData = "";
        $i = 0;
        foreach ($inputData as $key => $value) {
            if ($i == 1) {
                $hashData .= '&' . urlencode($key) . "=" . urlencode($value);
            } else {
                $hashData .= urlencode($key) . "=" . urlencode($value);
                $i = 1;
            }
        }

        $secureHash = hash_hmac('sha512', $hashData, $vnp_HashSecret);

        $orderId = $request->vnp_TxnRef;

        if ($secureHash == $vnp_SecureHash) {
            if ($request->vnp_ResponseCode == '00') {
                return redirect('http://localhost:5173/order-success?order_id=' . $orderId . '&status=success');
            } else {
                return redirect('http://localhost:5173/order-success?order_id=' . $orderId . '&status=failed');
            }
        } else {
            return redirect('http://localhost:5173/order-success?status=invalid');
        }
    }

    public function ipn(Request $request)
    {
        $vnp_HashSecret = env('VNPAY_HASH_SECRET');
        $inputData = $request->except('vnp_SecureHash');
        ksort($inputData);
        $hashData = "";
        $i = 0;
        foreach ($inputData as $key => $value) {
            if ($i == 1) {
                $hashData .= '&' . urlencode($key) . "=" . urlencode($value);
            } else {
                $hashData .= urlencode($key) . "=" . urlencode($value);
                $i = 1;
            }
        }
        $secureHash = hash_hmac('sha512', $hashData, $vnp_HashSecret);

        $orderId = $request->vnp_TxnRef;
        $order = Order::find($orderId);

        if ($order && $secureHash == $request->vnp_SecureHash) {
            if ($order->total_amount == ($request->vnp_Amount / 100) && $order->payment_status == 'pending') {
                $order->payment_status = ($request->vnp_ResponseCode == '00') ? 'paid' : 'failed';
                $order->order_status = ($request->vnp_ResponseCode == '00') ? 'processing' : 'cancelled';  // Cập nhật order_status nếu cần, chỉnh theo logic dự án
                $order->save();
                return response()->json(['RspCode' => '00', 'Message' => 'Confirm Success']);
            } else {
                return response()->json(['RspCode' => '02', 'Message' => 'Order already confirmed or mismatch']);
            }
        } else {
            return response()->json(['RspCode' => '97', 'Message' => 'Invalid signature']);
        }
    }
}