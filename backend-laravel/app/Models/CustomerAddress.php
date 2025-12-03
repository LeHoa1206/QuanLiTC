<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CustomerAddress extends Model
{
    protected $fillable = [
        'user_id',
        'label',
        'full_name',
        'phone',
        'address',
        'ward',
        'ward_code',
        'district',
        'district_code',
        'city',
        'city_code',
        'postal_code',
        'is_default',
    ];

    protected $casts = [
        'is_default' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function orders()
    {
        return $this->hasMany(Order::class, 'address_id');
    }

    // Get full address as string
    public function getFullAddressAttribute()
    {
        $parts = array_filter([
            $this->address,
            $this->ward,
            $this->district,
            $this->city,
        ]);
        return implode(', ', $parts);
    }

    // Set as default and unset others
    public function setAsDefault()
    {
        // Unset all other default addresses for this user
        self::where('user_id', $this->user_id)
            ->where('id', '!=', $this->id)
            ->update(['is_default' => false]);
        
        // Set this as default
        $this->is_default = true;
        $this->save();
    }
}
