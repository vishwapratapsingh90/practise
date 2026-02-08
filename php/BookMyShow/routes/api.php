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
        Route::get('/role/{id}', [RoleController::class, 'getRole']);
        Route::post('/role', [RoleController::class, 'createRole']);
        Route::put('/role/{id}', [RoleController::class, 'updateRole']);
        Route::delete('/role/{id}', [RoleController::class, 'deleteRole']);

        Route::get('/role/{id}/permissions', [RoleController::class, 'getRolePermissions']);
        Route::post('/role/{id}/permissions/{permissionId}', [RoleController::class, 'assignRolePermission']);
        Route::delete('/role/{id}/permissions/{permissionId}', [RoleController::class, 'revokeRolePermission']);

        Route::get('/permissions', [PermissionController::class, 'getPermissions']);
        Route::get('/permission/{id}', [PermissionController::class, 'getPermission']);
        Route::post('/permission', [PermissionController::class, 'createPermission']);
        Route::put('/permission/{id}', [PermissionController::class, 'updatePermission']);
        Route::delete('/permission/{id}', [PermissionController::class, 'deletePermission']);
    });
});
