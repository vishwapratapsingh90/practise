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
            'status' => 'nullable|integer|in:' . implode(',', [Role::STATUS_ACTIVE, Role::STATUS_INACTIVE, Role::STATUS_DELETED]),
        ]);

        $perPage = $validated['per_page'] ?? 10;
        $page = $validated['page'] ?? 1;
        $keyword = $validated['search'] ?? null;
        $sortBy = $validated['sort_by'] ?? 'created_at';
        $sortOrder = $validated['sort_order'] ?? 'desc';
        $status = $validated['status'] ?? null;

        // Build query once - exclude deleted roles by default
        $query = Role::notDeleted()
            ->when($keyword, fn($q) => $q->where('name', 'like', "%{$keyword}%"))
            ->when($status !== null, fn($q) => $q->where('status', $status))
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
            'status' => 'nullable|integer|in:' . implode(',', [Role::STATUS_ACTIVE, Role::STATUS_INACTIVE, Role::STATUS_DELETED]),
        ]);

        // Set default status if not provided
        $validated['status'] = $validated['status'] ?? Role::STATUS_ACTIVE;

        $role = Role::create($validated);

        return $this->createdResponse($role, 'Role created successfully');
    }

    /**
     * Update an existing role.
     * @param Request $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateRole(Request $request, $id)
    {
        $role = Role::find($id);

        if (!$role) {
            return $this->notFoundResponse('Role not found');
        }

        $validated = $request->validate([
            'name' => 'required|string|unique:roles,name,' . $id,
            'status' => 'nullable|integer|in:' . implode(',', [Role::STATUS_ACTIVE, Role::STATUS_INACTIVE, Role::STATUS_DELETED]),
        ]);

        // Update role with validated data
        $role->update($validated);

        return $this->successResponse($role, 'Role updated successfully');
    }

    public function deleteRole($id)
    {
        $role = Role::find($id);

        if (!$role) {
            return $this->notFoundResponse('Role not found');
        }

        // Soft delete by setting status to deleted
        $role->status = Role::STATUS_DELETED;
        $role->save();

        return $this->successResponse([], 'Role deleted successfully');
    }
}
