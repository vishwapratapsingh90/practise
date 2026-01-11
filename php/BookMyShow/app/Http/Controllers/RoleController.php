<?php

namespace App\Http\Controllers;

use App\Http\Traits\ApiResponseTrait;
use App\Models\Role;
use Illuminate\Http\Request;

class RoleController extends Controller
{
    use ApiResponseTrait;

    /**
     * Retrieve roles with optional pagination.
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getRoles(Request $request)
    {
        $message = 'Roles retrieved successfully';

        // Validate inputs
        $validated = $request->validate([
            'per_page' => 'integer|min:0|max:100',
            'page' => 'nullable|integer|min:1',
            'search' => 'nullable|string|min:1',
            'sort_by' => 'nullable|string|in:name,created_at,updated_at',
            'sort_order' => 'nullable|string|in:asc,desc',
        ]);

        $perPage = $validated['per_page'] ?? 10;
        $page = $validated['page'] ?? 1;
        $keyword = $validated['search'] ?? null;
        $sortBy = $validated['sort_by'] ?? 'created_at';
        $sortOrder = $validated['sort_order'] ?? 'desc';

        // Build query once
        $query = Role::query()
            ->when($keyword, fn($q) => $q->where('name', 'like', "%{$keyword}%"))
            ->orderBy($sortBy, $sortOrder);

        // Return all records or paginated
        if ($perPage === 0) {
            $roles = $query->get();
            return $this->successResponse($roles, $message);
        }

        // Laravel automatically handles page parameter from query string
        $roles = $query->paginate($perPage, ['*'], 'page', $page);

        return $this->paginatedResponse($roles, $message);
    }

    /**
     * Retrieve a single role with relationships.
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function getRole($id)
    {
        $role = Role::with('users')->find($id);

        if (!$role) {
            return $this->notFoundResponse('Role not found');
        }

        return $this->resourceResponse($role, [], 'Role retrieved successfully');
    }

    /**
     * Create a new role.
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function createRole(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|unique:roles,name',
            'description' => 'nullable|string',
        ]);

        $role = Role::create($validated);

        return $this->createdResponse($role, 'Role created successfully');
    }
}
