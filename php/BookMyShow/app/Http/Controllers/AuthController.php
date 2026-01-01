<?php

namespace App\Http\Controllers;

use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string|min:6',
        ]);

        $credentials = $request->only('email', 'password');

        if (Auth::attempt($credentials)) {
            $user = Auth::user();

            // Create token for the user
            $token = $user->createToken('auth_token')->plainTextToken;

            // Get role name from relationship
            $roleName = $user->getRoleName();

            return response()->json([
                'token' => $token,
                'role' => $roleName,
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $roleName,
                ],
            ], 200);
        }

        return response()->json([
            'message' => 'Invalid email or password',
        ], 401);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Successfully logged out',
        ], 200);
    }

    public function register(Request $request) {

        // Validate the incoming request data
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users',
                'password' => 'required|string|min:6|confirmed',
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        }

        // Check if email already exists
        $emailAvailable = User::where('email', $validated['email'])->exists();
        if ($emailAvailable) {
            return response()->json([
                'message' => 'Email already in use',
            ], 409);
        }

        // Create a new user
        try {
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
            ]);

            // Attach role to the user
            $roleId = Role::where('name', $request->role ?? 'customer')->first()->id;
            $user->roles()->attach($roleId);

            // Create token for the new user
            $token = $user->createToken('auth_token')->plainTextToken;

            // Get role name from relationship
            $roleName = $user->getRoleName();

            return response()->json([
                'token' => $token,
                'role' => $roleName,
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $roleName,
                ],
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'User registration failed',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function authorize(Request $request)
    {
        $user = $request->user();
        $userParam = $request->input('user');
        $permissionSlug = $request->input('permission');

        // Parse user data if it's JSON string
        if (is_string($userParam)) {
            $userParam = json_decode($userParam, true);
        }

        // Compare id and email
        if (!$userParam || !isset($userParam['id']) || !isset($userParam['email'])) {
            return response()->json([
                'message' => 'Invalid user data provided',
                'isAuthorized' => false,
            ], 400);
        }

        // Check if authenticated user matches the provided user data
        if ($user->id != $userParam['id'] || $user->email != $userParam['email']) {
            return response()->json([
                'message' => 'User authentication mismatch',
                'isAuthorized' => false,
            ], 403);
        }

        // User data matches, proceed with permission check if needed
        if ($permissionSlug) {
            if ($user->hasPermission($permissionSlug)) {
                return response()->json([
                    'message' => 'User authenticated with required permission',
                    'isAuthorized' => true,
                ], 200);
            }
        }

        // if permission check failed or by default, behavior will be blocking.
        return response()->json([
                    'message' => 'User lacks required permission',
                    'isAuthorized' => false,
        ], 403);
    }
}
