<?php

namespace App\Http\Controllers;

use App\Http\Traits\ApiResponseTrait;
use App\Models\Permission;
use Illuminate\Http\Request;

class PermissionController extends Controller
{
    use ApiResponseTrait;

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

}
