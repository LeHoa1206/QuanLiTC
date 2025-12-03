<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    use HasFactory;

    // Sử dụng bảng customer_profiles thay vì customers
    protected $table = 'customer_profiles';

    protected $fillable = [
        'user_id',
        'address',
        'city',
        'loyalty_points',
        'total_spent',
        'total_orders',
        'vip_level',
        'notes',
        'allergies',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class, 'customer_id');
    }
}
