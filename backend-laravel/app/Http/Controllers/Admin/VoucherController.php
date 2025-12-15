<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Voucher;
use App\Models\VoucherUsage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class VoucherController extends Controller
{
    // Lấy danh sách vouchers
    public function index(Request $request)
    {
        $query = Voucher::query();

        // Filter by status - only apply if not empty
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Filter by type - only apply if not empty
        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        // Search by code - only apply if not empty
        if ($request->filled('search')) {
            $query->where('code', 'like', '%' . $request->search . '%');
        }

        // Sort
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        $vouchers = $query->get();

        // Transform vouchers with computed attributes
        $vouchersArray = $vouchers->map(function ($voucher) {
            return [
                'id' => $voucher->id,
                'code' => $voucher->code,
                'type' => $voucher->type,
                'value' => $voucher->value,
                'min_order_amount' => $voucher->min_order_amount,
                'max_discount_amount' => $voucher->max_discount_amount,
                'usage_limit' => $voucher->usage_limit,
                'used_count' => $voucher->used_count ?? 0,
                'valid_from' => $voucher->valid_from,
                'valid_until' => $voucher->valid_until,
                'status' => $voucher->status,
                'created_at' => $voucher->created_at,
                'type_display' => $this->getTypeDisplay($voucher->type),
                'value_display' => $this->getValueDisplay($voucher->type, $voucher->value),
                'is_expired' => $voucher->valid_until && $voucher->valid_until < now(),
                'remaining_uses' => $voucher->usage_limit ? max(0, $voucher->usage_limit - ($voucher->used_count ?? 0)) : null,
            ];
        });

        return response()->json([
            'data' => $vouchersArray,
            'total' => $vouchersArray->count(),
            'message' => 'Vouchers loaded successfully'
        ]);
    }

    private function getTypeDisplay($type)
    {
        return match($type) {
            'percentage' => 'Giảm %',
            'fixed_amount' => 'Giảm tiền',
            'free_shipping' => 'Miễn phí ship',
            default => $type
        };
    }

    private function getValueDisplay($type, $value)
    {
        return match($type) {
            'percentage' => $value . '%',
            'fixed_amount' => number_format($value) . 'đ',
            'free_shipping' => 'Miễn phí',
            default => $value
        };
    }

    // Lấy chi tiết voucher
    public function show($id)
    {
        $voucher = Voucher::findOrFail($id);

        // Transform voucher with computed attributes
        $voucherData = [
            'id' => $voucher->id,
            'code' => $voucher->code,
            'type' => $voucher->type,
            'value' => $voucher->value,
            'min_order_amount' => $voucher->min_order_amount,
            'max_discount_amount' => $voucher->max_discount_amount,
            'usage_limit' => $voucher->usage_limit,
            'used_count' => $voucher->used_count ?? 0,
            'valid_from' => $voucher->valid_from,
            'valid_until' => $voucher->valid_until,
            'status' => $voucher->status,
            'created_at' => $voucher->created_at,
            'type_display' => $this->getTypeDisplay($voucher->type),
            'value_display' => $this->getValueDisplay($voucher->type, $voucher->value),
            'is_expired' => $voucher->valid_until && $voucher->valid_until < now(),
            'remaining_uses' => $voucher->usage_limit ? max(0, $voucher->usage_limit - ($voucher->used_count ?? 0)) : null,
        ];

        return response()->json($voucherData);
    }

    // Tạo voucher mới
    public function store(Request $request)
    {
        \Log::info('VoucherController::store called with data:', $request->all());
        
        $validator = Validator::make($request->all(), [
            'code' => 'required|string|max:50|unique:vouchers,code',
            'type' => 'required|in:percentage,fixed_amount,free_shipping',
            'value' => 'required|numeric|min:0',
            'min_order_amount' => 'nullable|numeric|min:0',
            'max_discount_amount' => 'nullable|numeric|min:0',
            'usage_limit' => 'nullable|integer|min:1',
            'valid_from' => 'nullable|date',
            'valid_until' => 'nullable|date|after:valid_from',
            'status' => 'in:active,inactive',
        ]);

        if ($validator->fails()) {
            \Log::error('VoucherController::store validation failed:', $validator->errors()->toArray());
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Validate value based on type
        if ($request->type === 'percentage' && $request->value > 100) {
            \Log::error('VoucherController::store percentage value too high:', ['value' => $request->value]);
            return response()->json([
                'errors' => ['value' => ['Giá trị phần trăm không được vượt quá 100%']]
            ], 422);
        }

        try {
            $voucher = Voucher::create([
                'code' => strtoupper($request->code),
                'type' => $request->type,
                'value' => $request->value,
                'min_order_amount' => $request->min_order_amount ?? 0,
                'max_discount_amount' => $request->max_discount_amount,
                'usage_limit' => $request->usage_limit,
                'valid_from' => $request->valid_from ?? now(),
                'valid_until' => $request->valid_until,
                'status' => $request->status ?? 'active',
            ]);
            \Log::info('VoucherController::store voucher created successfully:', ['id' => $voucher->id]);
        } catch (\Exception $e) {
            \Log::error('VoucherController::store error creating voucher:', ['error' => $e->getMessage()]);
            return response()->json(['message' => 'Lỗi tạo voucher: ' . $e->getMessage()], 500);
        }

        // Transform voucher with computed attributes
        $voucherData = [
            'id' => $voucher->id,
            'code' => $voucher->code,
            'type' => $voucher->type,
            'value' => $voucher->value,
            'min_order_amount' => $voucher->min_order_amount,
            'max_discount_amount' => $voucher->max_discount_amount,
            'usage_limit' => $voucher->usage_limit,
            'used_count' => $voucher->used_count ?? 0,
            'valid_from' => $voucher->valid_from,
            'valid_until' => $voucher->valid_until,
            'status' => $voucher->status,
            'created_at' => $voucher->created_at,
            'type_display' => $this->getTypeDisplay($voucher->type),
            'value_display' => $this->getValueDisplay($voucher->type, $voucher->value),
            'is_expired' => $voucher->valid_until && $voucher->valid_until < now(),
            'remaining_uses' => $voucher->usage_limit ? max(0, $voucher->usage_limit - ($voucher->used_count ?? 0)) : null,
        ];

        return response()->json([
            'message' => 'Tạo voucher thành công',
            'voucher' => $voucherData
        ], 201);
    }

    // Cập nhật voucher
    public function update(Request $request, $id)
    {
        \Log::info('VoucherController::update called', ['id' => $id, 'data' => $request->all()]);
        
        try {
            $voucher = Voucher::findOrFail($id);
        } catch (\Exception $e) {
            \Log::error('VoucherController::update voucher not found:', ['id' => $id, 'error' => $e->getMessage()]);
            return response()->json(['message' => 'Voucher không tồn tại'], 404);
        }

        $validator = Validator::make($request->all(), [
            'code' => 'required|string|max:50|unique:vouchers,code,' . $id,
            'type' => 'required|in:percentage,fixed_amount,free_shipping',
            'value' => 'required|numeric|min:0',
            'min_order_amount' => 'nullable|numeric|min:0',
            'max_discount_amount' => 'nullable|numeric|min:0',
            'usage_limit' => 'nullable|integer|min:1',
            'valid_from' => 'nullable|date',
            'valid_until' => 'nullable|date|after:valid_from',
            'status' => 'in:active,inactive,expired',
        ]);

        if ($validator->fails()) {
            \Log::error('VoucherController::update validation failed:', $validator->errors()->toArray());
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Validate value based on type
        if ($request->type === 'percentage' && $request->value > 100) {
            \Log::error('VoucherController::update percentage value too high:', ['value' => $request->value]);
            return response()->json([
                'errors' => ['value' => ['Giá trị phần trăm không được vượt quá 100%']]
            ], 422);
        }

        try {
            $voucher->update([
                'code' => strtoupper($request->code),
                'type' => $request->type,
                'value' => $request->value,
                'min_order_amount' => $request->min_order_amount ?? 0,
                'max_discount_amount' => $request->max_discount_amount,
                'usage_limit' => $request->usage_limit,
                'valid_from' => $request->valid_from,
                'valid_until' => $request->valid_until,
                'status' => $request->status,
            ]);
            \Log::info('VoucherController::update voucher updated successfully:', ['id' => $id]);
        } catch (\Exception $e) {
            \Log::error('VoucherController::update error updating voucher:', ['id' => $id, 'error' => $e->getMessage()]);
            return response()->json(['message' => 'Lỗi cập nhật voucher: ' . $e->getMessage()], 500);
        }

        // Refresh voucher data
        $voucher->refresh();

        // Transform voucher with computed attributes
        $voucherData = [
            'id' => $voucher->id,
            'code' => $voucher->code,
            'type' => $voucher->type,
            'value' => $voucher->value,
            'min_order_amount' => $voucher->min_order_amount,
            'max_discount_amount' => $voucher->max_discount_amount,
            'usage_limit' => $voucher->usage_limit,
            'used_count' => $voucher->used_count ?? 0,
            'valid_from' => $voucher->valid_from,
            'valid_until' => $voucher->valid_until,
            'status' => $voucher->status,
            'created_at' => $voucher->created_at,
            'type_display' => $this->getTypeDisplay($voucher->type),
            'value_display' => $this->getValueDisplay($voucher->type, $voucher->value),
            'is_expired' => $voucher->valid_until && $voucher->valid_until < now(),
            'remaining_uses' => $voucher->usage_limit ? max(0, $voucher->usage_limit - ($voucher->used_count ?? 0)) : null,
        ];

        return response()->json([
            'message' => 'Cập nhật voucher thành công',
            'voucher' => $voucherData
        ]);
    }

    // Xóa voucher
    public function destroy($id)
    {
        $voucher = Voucher::findOrFail($id);

        // Check if voucher has been used
        if ($voucher->used_count > 0) {
            return response()->json([
                'message' => 'Không thể xóa voucher đã được sử dụng'
            ], 400);
        }

        $voucher->delete();

        return response()->json([
            'message' => 'Xóa voucher thành công'
        ]);
    }

    // Bulk delete
    public function bulkDelete(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'ids' => 'required|array',
            'ids.*' => 'integer|exists:vouchers,id'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $vouchers = Voucher::whereIn('id', $request->ids)->get();
        $deletedCount = 0;
        $errors = [];

        foreach ($vouchers as $voucher) {
            if ($voucher->used_count > 0) {
                $errors[] = "Voucher {$voucher->code} đã được sử dụng, không thể xóa";
            } else {
                $voucher->delete();
                $deletedCount++;
            }
        }

        return response()->json([
            'message' => "Đã xóa {$deletedCount} voucher",
            'errors' => $errors
        ]);
    }

    // Toggle status
    public function toggleStatus($id)
    {
        $voucher = Voucher::findOrFail($id);
        
        $newStatus = $voucher->status === 'active' ? 'inactive' : 'active';
        $voucher->update(['status' => $newStatus]);

        return response()->json([
            'message' => 'Cập nhật trạng thái thành công',
            'voucher' => $voucher
        ]);
    }

    // Generate random code
    public function generateCode()
    {
        do {
            $code = strtoupper(Str::random(8));
        } while (Voucher::where('code', $code)->exists());

        return response()->json(['code' => $code]);
    }

    // Get statistics
    public function statistics()
    {
        $stats = [
            'total' => Voucher::count(),
            'active' => Voucher::where('status', 'active')->count(),
            'inactive' => Voucher::where('status', 'inactive')->count(),
            'expired' => Voucher::where('status', 'expired')->count(),
            'used_today' => VoucherUsage::whereDate('used_at', today())->count(),
            'total_discount_amount' => VoucherUsage::sum('discount_amount'),
        ];

        return response()->json($stats);
    }

    // Validate voucher for customer use
    public function validateVoucher(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'code' => 'required|string',
            'order_amount' => 'required|numeric|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $voucher = Voucher::where('code', strtoupper($request->code))->first();

        if (!$voucher) {
            return response()->json([
                'valid' => false,
                'message' => 'Mã voucher không tồn tại'
            ]);
        }

        // Check if voucher can be used (without using model methods)
        $message = 'Mã voucher không hợp lệ';
        $canBeUsed = true;
        
        if ($voucher->status !== 'active') {
            $message = 'Mã voucher đã bị vô hiệu hóa';
            $canBeUsed = false;
        } elseif ($voucher->valid_until && $voucher->valid_until < now()) {
            $message = 'Mã voucher đã hết hạn';
            $canBeUsed = false;
        } elseif ($voucher->min_order_amount > $request->order_amount) {
            $message = "Đơn hàng tối thiểu " . number_format($voucher->min_order_amount) . "đ";
            $canBeUsed = false;
        } elseif ($voucher->usage_limit && ($voucher->used_count ?? 0) >= $voucher->usage_limit) {
            $message = 'Mã voucher đã hết lượt sử dụng';
            $canBeUsed = false;
        }

        if (!$canBeUsed) {
            return response()->json([
                'valid' => false,
                'message' => $message
            ]);
        }

        // Calculate discount amount
        $discountAmount = 0;
        switch ($voucher->type) {
            case 'percentage':
                $discountAmount = $request->order_amount * ($voucher->value / 100);
                break;
            case 'fixed_amount':
                $discountAmount = $voucher->value;
                break;
            case 'free_shipping':
                $discountAmount = 0; // Handle shipping discount separately
                break;
        }

        // Apply max discount limit
        if ($voucher->max_discount_amount && $discountAmount > $voucher->max_discount_amount) {
            $discountAmount = $voucher->max_discount_amount;
        }

        return response()->json([
            'valid' => true,
            'voucher' => $voucher,
            'discount_amount' => $discountAmount,
            'message' => 'Mã voucher hợp lệ'
        ]);
    }

    // Get available vouchers for customers
    public function getAvailableVouchers(Request $request)
    {
        try {
            $orderAmount = $request->get('order_amount', 0);
            \Log::info('getAvailableVouchers called with order_amount: ' . $orderAmount);
            
            // Simplified query to avoid potential issues
            $vouchers = Voucher::where('status', 'active')
                ->where('valid_from', '<=', now())
                ->where(function($q) {
                    $q->whereNull('valid_until')
                      ->orWhere('valid_until', '>=', now());
                })
                ->where('min_order_amount', '<=', $orderAmount)
                ->get();
                
            \Log::info('Found vouchers: ' . $vouchers->count());

            // Transform vouchers
            $vouchersArray = $vouchers->map(function ($voucher) {
                return [
                    'id' => $voucher->id,
                    'code' => $voucher->code,
                    'type' => $voucher->type,
                    'value' => $voucher->value,
                    'min_order_amount' => $voucher->min_order_amount ?? 0,
                    'max_discount_amount' => $voucher->max_discount_amount,
                    'description' => $this->getVoucherDescription($voucher),
                ];
            });

            return response()->json([
                'data' => $vouchersArray,
                'message' => 'Available vouchers loaded successfully'
            ]);

        } catch (\Exception $e) {
            \Log::error('Error in getAvailableVouchers: ' . $e->getMessage());
            \Log::error('Stack trace: ' . $e->getTraceAsString());
            return response()->json([
                'data' => [],
                'message' => 'Error loading vouchers: ' . $e->getMessage()
            ], 500);
        }
    }

    private function getVoucherDescription($voucher)
    {
        switch ($voucher->type) {
            case 'percentage':
                return "Giảm {$voucher->value}% cho đơn hàng";
            case 'fixed_amount':
                return "Giảm " . number_format($voucher->value) . "đ cho đơn hàng";
            case 'free_shipping':
                return "Miễn phí vận chuyển";
            default:
                return "Voucher giảm giá";
        }
    }
}