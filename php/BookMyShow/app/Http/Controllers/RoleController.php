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
        $perPage = $request->input('per_page', 15);

        if ($perPage == 0) {
            $roles = Role::all();
            return $this->successResponse($roles, 'Roles retrieved successfully');
        }

        $roles = Role::paginate($perPage);
        return $this->paginatedResponse($roles, 'Roles retrieved successfully');
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
