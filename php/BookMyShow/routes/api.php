<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\RoleController;

Route::prefix('v1')->group(function () {
    // Public routes
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']);

    // Protected routes
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::post('/authorize', [AuthController::class, 'authorize']);
        Route::get('/user-permissions', [AuthController::class, 'getUserPermissions']);
        Route::get('/roles', [RoleController::class, 'getRoles']);
        Route::get('/permissions', [PermissionController::class, 'getPermissions']);
    });
});
