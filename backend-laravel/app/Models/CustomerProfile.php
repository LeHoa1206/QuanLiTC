<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CustomerProfile extends Model
{
    use HasFactory;

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

    protected $casts = [
        'loyalty_points' => 'integer',
        'total_spent' => 'decimal:2',
        'total_orders' => 'integer',
    ];

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Helper methods
    public function isVip()
    {
        return in_array($this->vip_level, ['silver', 'gold', 'platinum']);
    }

    public function updateVipLevel()
    {
        if ($this->total_orders >= 15) {
            $this->vip_level = 'platinum';
        } elseif ($this->total_orders >= 10) {
            $this->vip_level = 'gold';
        } elseif ($this->total_orders >= 5) {
            $this->vip_level = 'silver';
        } else {
            $this->vip_level = 'normal';
        }
        $this->save();
    }
}
