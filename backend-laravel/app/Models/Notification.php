<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    use HasFactory;

    // Tắt timestamps tự động vì bảng chỉ có created_at
    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'type',
        'title',
        'content',
        'link',
        'is_read',
        'read_at',
        'created_at'
    ];

    protected $casts = [
        'is_read' => 'boolean',
        'read_at' => 'datetime',
        'created_at' => 'datetime',
    ];

    // Relationship with User
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Mark notification as read
    public function markAsRead()
    {
        $this->update([
            'is_read' => true,
            'read_at' => now()
        ]);
    }

    // Create notification for user
    public static function createForUser($userId, $type, $title, $content, $link = null)
    {
        return self::create([
            'user_id' => $userId,
            'type' => $type,
            'title' => $title,
            'content' => $content,
            'link' => $link,
            'is_read' => false,
            'created_at' => now()
        ]);
    }

    // Create notification for all admins
    public static function createForAdmins($type, $title, $content, $link = null)
    {
        $adminUsers = \App\Models\User::where('role', 'admin')->get();
        
        foreach ($adminUsers as $admin) {
            self::createForUser($admin->id, $type, $title, $content, $link);
        }
    }
}