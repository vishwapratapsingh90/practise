<?php

namespace App\Http\Controllers;

use App\Http\Traits\ApiResponseTrait;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class AuthController extends Controller
{
    use ApiResponseTrait;
    /**
     * Handle user login and token generation.
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
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

            return $this->successResponse([
                'token' => $token,
                'role' => $roleName,
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $roleName,
                ],
                'permissions' => User::find($user->id)->permissions()->toArray(),
            ], 'Login successful');
        }

        return $this->unauthorizedResponse('Invalid email or password');
    }

    /**
     * Handle user logout and token revocation.
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return $this->successResponse([], 'Successfully logged out');
    }

    /**
     * Handle user registration.
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function register(Request $request) {

        // Validate the incoming request data
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users',
                'password' => 'required|string|min:6|confirmed',
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->errors()->toArray());
        }

        // Check if email already exists
        $emailAvailable = User::where('email', $validated['email'])->exists();
        if ($emailAvailable) {
            return $this->errorResponse('Email already in use', 409, 'Conflict');
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

            return $this->createdResponse([
                'token' => $token,
                'role' => $roleName,
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $roleName,
                ],
            ], 'User registered successfully');
        } catch (\Exception $e) {
            return $this->errorResponse('User registration failed: ' . $e->getMessage(), 500, 'Internal Server Error');
        }
    }

    /**
     * Authorize user based on provided data and permission.
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
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
            return $this->errorResponse('Invalid user data provided', 400, 'Bad Request', ['isAuthorized' => false]);
        }

        // Check if authenticated user matches the provided user data
        if ($user->id != $userParam['id'] || $user->email != $userParam['email']) {
            return $this->forbiddenResponse('User authentication mismatch');
        }

        // User data matches, proceed with permission check if needed
        if ($permissionSlug) {
            if ($user->hasPermission($permissionSlug)) {
                return $this->successResponse(['isAuthorized' => true], 'User authenticated with required permission');
            }
        }

        // if permission check failed or by default, behavior will be blocking.
        return $this->forbiddenResponse('User lacks required permission');
    }

    /**
     * Get permissions for the authenticated user with optional pagination.
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getUserPermissions(Request $request)
    {
        $user = $request->user();
        $perPage = $request->input('per_page', 15);

        // Get all unique permissions for the user
        $permissions = $user->roles()->with('permissions')->get()
            ->pluck('permissions')->flatten()->unique('id')->values();

        if ($perPage == 0) {
            return $this->successResponse($permissions, 'Permissions retrieved successfully');
        }

        // Manual pagination for collection
        $page = $request->input('page', 1);
        $paginator = new \Illuminate\Pagination\LengthAwarePaginator(
            $permissions->forPage($page, $perPage),
            $permissions->count(),
            $perPage,
            $page,
            ['path' => $request->url(), 'query' => $request->query()]
        );

        return $this->paginatedResponse($paginator, 'Permissions retrieved successfully');
    }
}
