<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class StaffMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        if (!$request->user() || !in_array($request->user()->role, ['staff', 'admin'])) {
            return response()->json(['message' => 'Unauthorized. Staff access required.'], 403);
        }

        return $next($request);
    }
}
