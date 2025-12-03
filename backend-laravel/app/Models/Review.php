<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'reviewable_type',
        'reviewable_id',
        'rating',
        'comment',
        'status',
        'reply_text',
    ];

    protected $casts = [
        'rating' => 'integer',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    // Alias for backward compatibility
    public function customer()
    {
        return $this->user();
    }

    public function reviewable()
    {
        return $this->morphTo();
    }
    
    // Accessor to get customer name from user
    public function getCustomerNameAttribute()
    {
        return $this->user?->name ?? 'Khách hàng';
    }
}
