<?php

namespace App\Http\Controllers;

use App\Models\Conversation;
use App\Models\Message;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class ChatController extends Controller
{
    // Lấy danh sách conversations
    public function index(Request $request)
    {
        $user = $request->user();
        
        $query = Conversation::query();
        
        if ($user->role === 'customer') {
            // Customer chỉ thấy conversations của mình
            $query->where('customer_id', $user->id);
        } else {
            // Admin/Staff thấy tất cả conversations đang mở
            $query->where('status', 'open');
        }
        
        $conversations = $query->with(['customer', 'staff', 'lastMessage.sender'])
            ->orderBy('last_message_at', 'desc')
            ->get()
            ->map(function ($conversation) use ($user) {
                $conversation->unread_count = $conversation->unreadCount($user->id);
                // Alias admin = staff for frontend compatibility
                $conversation->admin = $conversation->staff;
                return $conversation;
            });
        
        return response()->json($conversations);
    }

    // Lấy hoặc tạo conversation cho customer
    public function getOrCreateConversation(Request $request)
    {
        try {
            $user = $request->user();
            
            if (!$user) {
                return response()->json(['message' => 'Unauthorized'], 401);
            }
            
            if ($user->role !== 'customer') {
                return response()->json(['message' => 'Only customers can create conversations'], 403);
            }
            
            // Tìm conversation đang mở
            $conversation = Conversation::where('customer_id', $user->id)
                ->where('status', 'open')
                ->first();
            
            if (!$conversation) {
                // Tạo conversation mới
                $conversation = Conversation::create([
                    'customer_id' => $user->id,
                    'platform' => 'web',
                    'status' => 'open',
                    'last_message_at' => now(),
                ]);
                
                // Tạo message chào mừng
                Message::create([
                    'conversation_id' => $conversation->id,
                    'sender_id' => $user->id,
                    'sender_type' => 'customer',
                    'content' => 'Xin chào! Tôi cần hỗ trợ.',
                    'is_read' => false,
                ]);
            }
            
            $conversation->load(['customer', 'staff', 'messages.sender']);
            $conversation->unread_count = $conversation->unreadCount($user->id);
            // Alias admin = staff for frontend compatibility
            $conversation->admin = $conversation->staff;
            
            return response()->json($conversation);
        } catch (\Exception $e) {
            \Log::error('Chat Error: ' . $e->getMessage());
            \Log::error($e->getTraceAsString());
            return response()->json([
                'message' => 'Error creating conversation',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Lấy chi tiết conversation và messages
    public function show(Request $request, $id)
    {
        try {
            $user = $request->user();
            
            $conversation = Conversation::with(['customer', 'staff', 'messages.sender'])
                ->findOrFail($id);
            
            // Alias admin = staff for frontend compatibility
            $conversation->admin = $conversation->staff;
            
            // Kiểm tra quyền truy cập
            if ($user->role === 'customer' && $conversation->customer_id !== $user->id) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }
            
            // Đánh dấu đã đọc
            $conversation->markAsRead($user->id);
            
            $conversation->unread_count = 0;
            
            return response()->json($conversation);
        } catch (\Exception $e) {
            \Log::error('Chat Show Error: ' . $e->getMessage());
            \Log::error($e->getTraceAsString());
            return response()->json([
                'message' => 'Error loading conversation',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Gửi message
    public function sendMessage(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'message' => 'required_without:image|string|max:5000',
            'image' => 'nullable|image|max:5120', // 5MB
        ]);
        
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        
        $user = $request->user();
        $conversation = Conversation::findOrFail($id);
        
        // Kiểm tra quyền
        if ($user->role === 'customer' && $conversation->customer_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        
        $messageData = [
            'conversation_id' => $conversation->id,
            'sender_id' => $user->id,
            'sender_type' => $user->role === 'customer' ? 'customer' : 'staff',
            'content' => $request->message,
            'is_read' => false,
        ];
        
        // TODO: Upload image nếu có (cần thêm cột image vào bảng messages)
        // if ($request->hasFile('image')) {
        //     $path = $request->file('image')->store('chat-images', 'public');
        //     $messageData['image'] = $path;
        // }
        
        $message = Message::create($messageData);
        
        // Cập nhật conversation
        $conversation->update([
            'last_message_at' => now(),
            'staff_id' => $user->role !== 'customer' ? $user->id : $conversation->staff_id,
        ]);
        
        $message->load('sender');
        
        return response()->json([
            'message' => 'Message sent successfully',
            'data' => $message,
        ], 201);
    }

    // Lấy messages mới (polling)
    public function getNewMessages(Request $request, $id)
    {
        $lastMessageId = $request->query('last_message_id', 0);
        
        $messages = Message::where('conversation_id', $id)
            ->where('id', '>', $lastMessageId)
            ->with('sender')
            ->orderBy('created_at', 'asc')
            ->get();
        
        return response()->json($messages);
    }

    // Đánh dấu đã đọc
    public function markAsRead(Request $request, $id)
    {
        $user = $request->user();
        $conversation = Conversation::findOrFail($id);
        
        $conversation->markAsRead($user->id);
        
        return response()->json(['message' => 'Marked as read']);
    }

    // Admin: Đóng conversation
    public function closeConversation(Request $request, $id)
    {
        $user = $request->user();
        
        if ($user->role === 'customer') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        
        $conversation = Conversation::findOrFail($id);
        $conversation->update(['status' => 'closed']);
        
        return response()->json(['message' => 'Conversation closed']);
    }

    // Lấy số lượng unread messages
    public function getUnreadCount(Request $request)
    {
        $user = $request->user();
        
        $query = Conversation::query();
        
        if ($user->role === 'customer') {
            $query->where('customer_id', $user->id);
        }
        
        $conversations = $query->get();
        $totalUnread = 0;
        
        foreach ($conversations as $conversation) {
            $totalUnread += $conversation->unreadCount($user->id);
        }
        
        return response()->json(['unread_count' => $totalUnread]);
    }
}
