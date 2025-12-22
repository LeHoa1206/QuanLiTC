<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Voucher extends Model
{
    // Disable automatic timestamps since table only has created_at
    public $timestamps = false;
    
    protected $fillable = [
        'code',
        'type',
        'value',
        'min_order_amount',
        'max_discount_amount',
        'usage_limit',
        'used_count',
        'valid_from',
        'valid_until',
        'status',
    ];

    protected $casts = [
        'value' => 'decimal:2',
        'min_order_amount' => 'decimal:2',
        'max_discount_amount' => 'decimal:2',
        'valid_from' => 'datetime',
        'valid_until' => 'datetime',
        'created_at' => 'datetime',
    ];

    // Relationships
    public function usages()
    {
        return $this->hasMany(VoucherUsage::class);
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('status', 'active')
                    ->where('valid_from', '<=', now())
                    ->where(function($q) {
                        $q->whereNull('valid_until')
                          ->orWhere('valid_until', '>=', now());
                    });
    }

    public function scopeExpired($query)
    {
        return $query->where('valid_until', '<', now());
    }

    // Accessors & Mutators
    public function getIsExpiredAttribute()
    {
        return $this->valid_until && $this->valid_until->isPast();
    }

    public function getIsValidAttribute()
    {
        return $this->status === 'active' && 
               $this->valid_from <= now() && 
               (!$this->valid_until || $this->valid_until >= now()) &&
               (!$this->usage_limit || ($this->used_count ?? 0) < $this->usage_limit);
    }

    public function getRemainingUsesAttribute()
    {
        if (!$this->usage_limit) return null;
        return max(0, $this->usage_limit - ($this->used_count ?? 0));
    }

    public function getTypeDisplayAttribute()
    {
        return match($this->type) {
            'percentage' => 'Giảm %',
            'fixed_amount' => 'Giảm tiền',
            'free_shipping' => 'Miễn phí ship',
            default => $this->type
        };
    }

    public function getValueDisplayAttribute()
    {
        return match($this->type) {
            'percentage' => $this->value . '%',
            'fixed_amount' => number_format($this->value) . 'đ',
            'free_shipping' => 'Miễn phí',
            default => $this->value
        };
    }

    // Methods
    public function canBeUsed($orderAmount = 0, $userId = null)
    {
        // Check if voucher is valid
        if (!$this->is_valid) {
            return false;
        }

        // Check minimum order amount
        if ($this->min_order_amount > 0 && $orderAmount < $this->min_order_amount) {
            return false;
        }

        // Check usage limit
        if ($this->usage_limit && $this->used_count >= $this->usage_limit) {
            return false;
        }

        return true;
    }

    public function calculateDiscount($orderAmount)
    {
        if (!$this->canBeUsed($orderAmount)) {
            return 0;
        }

        $discount = match($this->type) {
            'percentage' => $orderAmount * ($this->value / 100),
            'fixed_amount' => $this->value,
            'free_shipping' => 0, // Handle shipping discount separately
            default => 0
        };

        // Apply max discount limit
        if ($this->max_discount_amount && $discount > $this->max_discount_amount) {
            $discount = $this->max_discount_amount;
        }

        return $discount;
    }

    public function markAsUsed($userId, $orderId = null, $discountAmount = 0)
    {
        $this->increment('used_count');

        VoucherUsage::create([
            'voucher_id' => $this->id,
            'user_id' => $userId,
            'order_id' => $orderId,
            'discount_amount' => $discountAmount,
        ]);
    }

    // Auto-update status based on expiry
    public function updateStatus()
    {
        if ($this->is_expired) {
            $this->update(['status' => 'expired']);
        }
    }
}