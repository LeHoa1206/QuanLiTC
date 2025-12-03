<?php

namespace App\Http\Controllers;

use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReviewController extends Controller
{
    public function index(Request $request)
    {
        $query = Review::with('user');

        if ($request->has('reviewable_type')) {
            $query->where('reviewable_type', $request->reviewable_type);
        }

        if ($request->has('reviewable_id')) {
            $query->where('reviewable_id', $request->reviewable_id);
        }

        if ($request->has('rating') && $request->rating !== 'all') {
            $query->where('rating', $request->rating);
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('comment', 'like', "%{$search}%")
                  ->orWhereHas('user', function($q2) use ($search) {
                      $q2->where('name', 'like', "%{$search}%");
                  });
            });
        }

        $reviews = $query->orderBy('created_at', 'desc')->paginate(20);

        return response()->json($reviews);
    }

    public function store(Request $request)
    {
        try {
            \Log::info('Review store request received', [
                'data' => $request->all(),
                'user' => Auth::check() ? Auth::id() : 'not authenticated'
            ]);

            $request->validate([
                'reviewable_type' => 'required|in:product,service',
                'reviewable_id' => 'required|integer',
                'rating' => 'required|integer|min:1|max:5',
                'comment' => 'nullable|string',
            ]);

            // Check if user is authenticated
            if (!Auth::check()) {
                \Log::warning('Review attempt without authentication');
                return response()->json([
                    'error' => 'Unauthorized',
                    'message' => 'Bạn phải đăng nhập để đánh giá!'
                ], 401);
            }

            $user = Auth::user();
            \Log::info('User authenticated', ['user_id' => $user->id, 'email' => $user->email]);

            // Check if user has purchased this product and order is delivered
            if ($request->reviewable_type === 'product') {
                $hasPurchased = \DB::table('orders')
                    ->join('order_items', 'orders.id', '=', 'order_items.order_id')
                    ->where('orders.user_id', $user->id)
                    ->where('orders.order_status', 'delivered')
                    ->where('order_items.product_id', $request->reviewable_id)
                    ->exists();

                if (!$hasPurchased) {
                    return response()->json([
                        'error' => 'Not purchased',
                        'message' => 'Bạn chỉ có thể đánh giá sản phẩm đã mua và đơn hàng đã hoàn thành!'
                    ], 403);
                }
            }

            // Check if user already reviewed this item
            $existingReview = Review::where('user_id', $user->id)
                ->where('reviewable_type', $request->reviewable_type)
                ->where('reviewable_id', $request->reviewable_id)
                ->first();

            if ($existingReview) {
                return response()->json([
                    'error' => 'Already reviewed',
                    'message' => 'Bạn đã đánh giá sản phẩm này rồi!'
                ], 400);
            }

            $review = Review::create([
                'user_id' => $user->id,
                'reviewable_type' => $request->reviewable_type,
                'reviewable_id' => $request->reviewable_id,
                'rating' => $request->rating,
                'comment' => $request->comment,
                'status' => 'approved',
            ]);
            
            \Log::info('Review created successfully', ['review_id' => $review->id]);

            // Update product rating average
            if ($request->reviewable_type === 'product') {
                $this->updateProductRating($request->reviewable_id);
            }

            return response()->json([
                'message' => 'Review submitted successfully',
                'review' => [
                    'id' => $review->id,
                    'rating' => $review->rating,
                    'comment' => $review->comment,
                    'created_at' => $review->created_at,
                    'user' => [
                        'id' => $user->id,
                        'name' => $user->name
                    ]
                ],
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            \Log::error('Review validation failed', ['errors' => $e->errors()]);
            return response()->json([
                'error' => 'Validation failed',
                'message' => $e->getMessage(),
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            \Log::error('Review creation error: ' . $e->getMessage());
            \Log::error('Stack trace: ' . $e->getTraceAsString());
            
            return response()->json([
                'error' => 'Server error',
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine()
            ], 500);
        }
    }

    private function updateProductRating($productId)
    {
        try {
            $avgRating = Review::where('reviewable_type', 'product')
                ->where('reviewable_id', $productId)
                ->where('status', 'approved')
                ->avg('rating');
            
            \DB::table('products')
                ->where('id', $productId)
                ->update(['rating_average' => round($avgRating, 2)]);
        } catch (\Exception $e) {
            \Log::warning('Failed to update product rating: ' . $e->getMessage());
        }
    }

    public function reply(Request $request, $id)
    {
        $request->validate([
            'reply_text' => 'required|string',
        ]);

        $review = Review::findOrFail($id);
        $review->update(['reply_text' => $request->reply_text]);

        return response()->json([
            'message' => 'Reply added successfully',
            'review' => $review,
        ]);
    }

    public function destroy($id)
    {
        $review = Review::findOrFail($id);
        
        // Only allow user to delete their own review
        if ($review->user_id !== Auth::id() && Auth::user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $review->delete();

        return response()->json(['message' => 'Review deleted successfully']);
    }
}
