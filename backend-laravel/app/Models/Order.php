<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class Order extends Model
{
    use HasFactory;

    // Bật timestamps vì bảng có created_at và updated_at
    public $timestamps = true;

    protected $fillable = [
        'order_number',
        'customer_id',
        'sales_staff_id',
        'subtotal',
        'discount_amount',
        'total_amount',
        'voucher_code',
        'payment_method',
        'payment_status',
        'order_status',
        'shipping_address',
        'phone',
        'notes',
        'created_by',
        'created_by_role',
    ];

    protected $casts = [
        'subtotal' => 'decimal:2',
        'total_amount' => 'decimal:2',
    ];

    // Generate unique order number
    public static function generateOrderNumber()
    {
        $prefix = 'ORD';
        $date = date('Ymd');
        $random = strtoupper(substr(md5(uniqid(rand(), true)), 0, 6));
        return $prefix . $date . $random;
    }

    public function customer()
    {
        return $this->belongsTo(User::class, 'customer_id');
    }

    public function salesStaff()
    {
        return $this->belongsTo(User::class, 'sales_staff_id');
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

  
}
