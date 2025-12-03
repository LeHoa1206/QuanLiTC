<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Conversation extends Model
{
    public $timestamps = false; // Bảng không có updated_at
    
    protected $fillable = [
        'customer_id',
        'staff_id',
        'platform',
        'status',
        'last_message_at',
    ];

    protected $casts = [
        'last_message_at' => 'datetime',
    ];

    // Không dùng eager loading mặc định để tránh lỗi
    // protected $with = ['customer', 'admin', 'lastMessage'];

    public function customer()
    {
        return $this->belongsTo(User::class, 'customer_id')->withDefault([
            'name' => 'Unknown User',
            'email' => 'unknown@example.com'
        ]);
    }

    public function staff()
    {
        return $this->belongsTo(User::class, 'staff_id')->withDefault([
            'name' => 'Admin',
            'email' => 'admin@example.com'
        ]);
    }
    
    // Alias for compatibility
    public function admin()
    {
        return $this->staff();
    }

    public function messages()
    {
        return $this->hasMany(Message::class)->orderBy('created_at', 'asc');
    }

    public function lastMessage()
    {
        return $this->hasOne(Message::class)->latestOfMany();
    }

    public function unreadCount($userId)
    {
        return $this->messages()
            ->where('sender_id', '!=', $userId)
            ->where('is_read', false)
            ->count();
    }

    public function markAsRead($userId)
    {
        $this->messages()
            ->where('sender_id', '!=', $userId)
            ->where('is_read', false)
            ->update([
                'is_read' => true,
            ]);
    }
}
