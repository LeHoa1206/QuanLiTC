<?php

namespace App\Http\Controllers\Sales;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\User;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SalesDashboardController extends Controller
{
    public function index()
    {
        $stats = [
            'todayOrders' => Order::whereDate('created_at', today())->count(),
            'todayRevenue' => Order::whereDate('created_at', today())
                ->where('payment_status', 'paid')
                ->sum('total_amount'),
            'totalCustomers' => User::where('role', 'customer')->count(),
            'pendingOrders' => Order::where('order_status', 'pending')->count(),
            'monthRevenue' => Order::whereMonth('created_at', now()->month)
                ->where('payment_status', 'paid')
                ->sum('total_amount'),
            'monthOrders' => Order::whereMonth('created_at', now()->month)->count(),
            'avgRating' => 4.8, // TODO: Calculate from reviews
            'newMessages' => 0, // TODO: Implement
        ];

        $recentOrders = Order::with(['customer', 'items'])
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        $topProducts = Product::orderBy('sold_count', 'desc')
            ->limit(5)
            ->get();

        return response()->json([
            'stats' => $stats,
            'recentOrders' => $recentOrders,
            'topProducts' => $topProducts,
        ]);
    }

    public function customers(Request $request)
    {
        $query = User::with('customerProfile')
            ->where('role', 'customer');

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        $customers = $query->paginate(20);

        return response()->json($customers);
    }

    public function customerDetail($id)
    {
        $customer = User::with(['customerProfile', 'pets'])
            ->where('role', 'customer')
            ->findOrFail($id);

        $orders = Order::with('items')
            ->where('customer_id', $id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'customer' => $customer,
            'orders' => $orders,
        ]);
    }

    public function updateCustomerNotes(Request $request, $id)
    {
        $request->validate([
            'notes' => 'nullable|string',
            'allergies' => 'nullable|string',
        ]);

        $customer = User::findOrFail($id);
        
        if ($customer->customerProfile) {
            $customer->customerProfile->update([
                'notes' => $request->notes,
                'allergies' => $request->allergies,
            ]);
        }

        return response()->json([
            'message' => 'Customer notes updated successfully',
            'customer' => $customer->load('customerProfile'),
        ]);
    }
}
