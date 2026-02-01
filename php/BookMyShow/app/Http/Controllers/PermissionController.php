<?php

namespace App\Http\Controllers;

use App\Http\Traits\ApiResponseTrait;
use App\Models\Permission;
use Illuminate\Http\Request;

class PermissionController extends Controller
{
    use ApiResponseTrait;

    /**
     * Retrieve permissions with optional pagination.
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getPermissions(Request $request)
    {
        $message = 'Permissions retrieved successfully';

        // Validate inputs
        $validated = $request->validate([
            'per_page' => 'integer|min:0|max:100',
            'page' => 'nullable|integer|min:1',
            'search' => 'nullable|string|min:1',
            'sort_by' => 'nullable|string|in:slug,created_at,updated_at',
            'sort_order' => 'nullable|string|in:asc,desc',
        ]);

        $perPage = $validated['per_page'] ?? 10;
        $page = $validated['page'] ?? 1;
        $keyword = $validated['search'] ?? null;
        $sortBy = $validated['sort_by'] ?? 'created_at';
        $sortOrder = $validated['sort_order'] ?? 'desc';

        $query = Permission::query()
            ->when($keyword, fn($q) => $q->where('slug', 'like', "%{$keyword}%"))
            ->orderBy($sortBy, $sortOrder);

        // Return all records or paginated
        if ($perPage === 0) {
            $permissions = $query->get();
            return $this->successResponse($permissions, $message);
        }

        // Laravel automatically handles page parameter from query string
        $permissions = $query->paginate($perPage, ['*'], 'page', $page);

        return $this->paginatedResponse($permissions, $message);
    }

    /**
     * Retrieve a single permission.
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function getPermission($id)
    {
        $permission = Permission::find($id);

        // Check if permission exists
        if (!$permission) {
            return $this->notFoundResponse('Permission not found');
        }

        $message = 'Permission retrieved successfully';
        return $this->successResponse($permission, $message);
    }

    /**
     * Create a new permission.
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function createPermission(Request $request)
    {
        $message = 'Permission created successfully';

        // Validate inputs
        $validated = $request->validate([
            'slug' => 'required|string|unique:permissions,slug|min:3|max:100',
            'description' => 'nullable|string|max:255',
        ]);

        $permission = Permission::create([
            'slug' => $validated['slug'],
            'description' => $validated['description'] ?? null,
        ]);

        return $this->successResponse($permission, $message, 201);
    }

    /**
     * Update an existing permission.
     * @param Request $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function updatePermission(Request $request, $id)
    {
        $permission = Permission::find($id);

        // Check if permission exists
        if (!$permission) {
            return $this->notFoundResponse('Permission not found');
        }

        // Validate inputs
        $validated = $request->validate([
            'slug' => 'required|string|unique:permissions,slug,' . $id . '|min:3|max:100',
            'description' => 'nullable|string|max:255',
            'status' => 'nullable|integer|in:' . implode(',', [Permission::STATUS_ACTIVE, Permission::STATUS_INACTIVE]),
        ]);

        // Update permission
        $permission->update($validated);

        $message = 'Permission updated successfully';
        return $this->successResponse($permission, $message);
    }

    /**
     * Delete a permission.
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function deletePermission($id)
    {
        $permission = Permission::find($id);

        // Check if permission exists
        if (!$permission) {
            return $this->notFoundResponse('Permission not found');
        }

        // Delete permission
        $permission->delete();

        $message = 'Permission deleted successfully';
        return $this->successResponse(null, $message);
    }
}
