<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Product;
use Illuminate\Http\Request;

class CartController extends Controller
{
    // Xem giỏ hàng
    public function index(Request $request)
    {
        $carts = Cart::with('product')
            ->where('user_id', $request->user()->id)
            ->get();

        $total = $carts->sum(function ($cart) {
            return $cart->subtotal;
        });

        return response()->json([
            'carts' => $carts,
            'total' => $total
        ]);
    }

    // Thêm vào giỏ hàng
    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
        ]);

        $product = Product::findOrFail($request->product_id);

        if ($product->stock < $request->quantity) {
            return response()->json([
                'message' => 'Sản phẩm không đủ số lượng trong kho'
            ], 400);
        }

        $cart = Cart::where('user_id', $request->user()->id)
            ->where('product_id', $request->product_id)
            ->first();

        if ($cart) {
            $cart->quantity += $request->quantity;
            $cart->save();
        } else {
            $cart = Cart::create([
                'user_id' => $request->user()->id,
                'product_id' => $request->product_id,
                'quantity' => $request->quantity,
            ]);
        }

        return response()->json([
            'message' => 'Thêm vào giỏ hàng thành công',
            'cart' => $cart->load('product')
        ], 201);
    }

    // Cập nhật giỏ hàng
    public function update(Request $request, $id)
    {
        $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);

        $cart = Cart::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $product = $cart->product;

        if ($product->stock < $request->quantity) {
            return response()->json([
                'message' => 'Sản phẩm không đủ số lượng trong kho'
            ], 400);
        }

        $cart->update(['quantity' => $request->quantity]);

        return response()->json([
            'message' => 'Cập nhật giỏ hàng thành công',
            'cart' => $cart->load('product')
        ]);
    }

    // Xóa khỏi giỏ hàng
    public function destroy(Request $request, $id)
    {
        $cart = Cart::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $cart->delete();

        return response()->json([
            'message' => 'Xóa khỏi giỏ hàng thành công'
        ]);
    }

    // Xóa toàn bộ giỏ hàng
    public function clear(Request $request)
    {
        Cart::where('user_id', $request->user()->id)->delete();

        return response()->json([
            'message' => 'Đã xóa toàn bộ giỏ hàng'
        ]);
    }
}
