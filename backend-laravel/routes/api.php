<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\PetController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\StatisticsController;
use App\Http\Controllers\Sales\SalesDashboardController;
use App\Http\Controllers\Staff\StaffDashboardController;
use App\Http\Controllers\VnpayController;

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/check-email', [AuthController::class, 'checkEmail']);

// Products (public)
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{id}', [ProductController::class, 'show']);
Route::get('/product-categories', [ProductController::class, 'categories']);

// Services (public)
Route::get('/services', [ServiceController::class, 'index']);
Route::get('/services/{id}', [ServiceController::class, 'show']);
Route::get('/service-categories', [ServiceController::class, 'categories']);

// Reviews (public read)
Route::get('/reviews', [ReviewController::class, 'index']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    Route::put('/user/profile', [AuthController::class, 'updateProfile']);
    Route::put('/user/password', [AuthController::class, 'updatePassword']);
    
    // Pets
    Route::get('/pets', [PetController::class, 'index']);
    Route::post('/pets', [PetController::class, 'store']);
    Route::get('/pets/{id}', [PetController::class, 'show']);
    Route::put('/pets/{id}', [PetController::class, 'update']);
    Route::delete('/pets/{id}', [PetController::class, 'destroy']);
    
    // Cart
    Route::get('/cart', [CartController::class, 'index']);
    Route::post('/cart', [CartController::class, 'add']);
    Route::put('/cart/{id}', [CartController::class, 'update']);
    Route::delete('/cart/{id}', [CartController::class, 'remove']);
    Route::delete('/cart', [CartController::class, 'clear']);
    
    // Orders
    Route::get('/orders', [OrderController::class, 'index']);
    Route::post('/orders', [OrderController::class, 'store']);
    Route::get('/orders/{id}', [OrderController::class, 'show']);
    Route::put('/orders/{id}/cancel', [OrderController::class, 'cancel']);
    
    // Appointments
    Route::get('/appointments', [AppointmentController::class, 'index']);
    Route::get('/appointments/booked-times', [AppointmentController::class, 'getBookedTimes']);
    Route::post('/appointments', [AppointmentController::class, 'store']);
    Route::get('/appointments/{id}', [AppointmentController::class, 'show']);
    Route::put('/appointments/{id}', [AppointmentController::class, 'update']);
    Route::delete('/appointments/{id}', [AppointmentController::class, 'destroy']);
    
    // Reviews
    Route::post('/reviews', [ReviewController::class, 'store']);
    Route::delete('/reviews/{id}', [ReviewController::class, 'destroy']);
    
    // Addresses
    Route::get('/addresses', [App\Http\Controllers\AddressController::class, 'index']);
    Route::get('/addresses/default', [App\Http\Controllers\AddressController::class, 'getDefault']);
    Route::post('/addresses', [App\Http\Controllers\AddressController::class, 'store']);
    Route::put('/addresses/{id}', [App\Http\Controllers\AddressController::class, 'update']);
    Route::delete('/addresses/{id}', [App\Http\Controllers\AddressController::class, 'destroy']);
    Route::post('/addresses/{id}/set-default', [App\Http\Controllers\AddressController::class, 'setDefault']);
    
    // Chat
    Route::get('/conversations', [ChatController::class, 'index']);
    Route::get('/conversations/my', [ChatController::class, 'getOrCreateConversation']);
    Route::get('/conversations/{id}', [ChatController::class, 'show']);
    Route::post('/conversations/{id}/messages', [ChatController::class, 'sendMessage']);
    Route::get('/conversations/{id}/new-messages', [ChatController::class, 'getNewMessages']);
    Route::post('/conversations/{id}/mark-read', [ChatController::class, 'markAsRead']);
    Route::post('/conversations/{id}/close', [ChatController::class, 'closeConversation']);
    Route::get('/chat/unread-count', [ChatController::class, 'getUnreadCount']);
    
    // Admin routes
    Route::middleware('admin')->prefix('admin')->group(function () {
        Route::get('/users', [UserController::class, 'index']);
        Route::post('/users', [UserController::class, 'store']);
        Route::get('/users/{id}', [UserController::class, 'show']);
        Route::put('/users/{id}', [UserController::class, 'update']);
        Route::delete('/users/{id}', [UserController::class, 'destroy']);
        Route::post('/users/{id}/toggle-status', [UserController::class, 'toggleStatus']);
        Route::post('/users/bulk-delete', [UserController::class, 'bulkDelete']);
        
        Route::post('/products', [ProductController::class, 'store']);
        Route::put('/products/{id}', [ProductController::class, 'update']);
        Route::delete('/products/{id}', [ProductController::class, 'destroy']);
        
        Route::post('/services', [ServiceController::class, 'store']);
        Route::put('/services/{id}', [ServiceController::class, 'update']);
        Route::delete('/services/{id}', [ServiceController::class, 'destroy']);
        
        Route::get('/orders', [OrderController::class, 'adminIndex']);
        Route::get('/orders/{id}', [OrderController::class, 'adminShow']);
        Route::put('/orders/{id}/status', [OrderController::class, 'updateStatus']);
        Route::delete('/orders/{id}', [OrderController::class, 'adminDestroy']);
        Route::post('/orders/bulk-delete', [OrderController::class, 'bulkDelete']);
        
        Route::get('/statistics', [StatisticsController::class, 'index']);
        Route::put('/reviews/{id}/reply', [ReviewController::class, 'reply']);
    });
    
    // Staff routes
    Route::middleware('staff')->prefix('staff')->group(function () {
        Route::get('/dashboard', [StaffDashboardController::class, 'index']);
        Route::get('/schedule', [StaffDashboardController::class, 'schedule']);
        Route::get('/appointments', [StaffDashboardController::class, 'appointments']);
        Route::put('/appointments/{id}/status', [StaffDashboardController::class, 'updateAppointmentStatus']);
    });
    
    // Sales routes
    Route::middleware('sales')->prefix('sales')->group(function () {
        Route::get('/dashboard', [SalesDashboardController::class, 'index']);
        Route::get('/customers', [SalesDashboardController::class, 'customers']);
        Route::get('/customers/{id}', [SalesDashboardController::class, 'customerDetail']);
        Route::put('/customers/{id}/notes', [SalesDashboardController::class, 'updateCustomerNotes']);
    });
});
Route::middleware('auth:api')->post('/vnpay/create', [VnpayController::class, 'create']);
Route::get('/vnpay/return', [VnpayController::class, 'return']);  // Không auth
Route::get('/vnpay/ipn', [VnpayController::class, 'ipn']);  // Không auth

