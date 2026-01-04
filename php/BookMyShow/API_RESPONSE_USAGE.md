# API Response Trait - Usage Examples

## Overview
The `ApiResponseTrait` provides standardized JSON:API compliant responses with support for pagination, relationships, and error handling.

## Quick Start

```php
use App\Http\Traits\ApiResponseTrait;

class YourController extends Controller
{
    use ApiResponseTrait;
}
```

## Response Methods

### 1. Success Response
```php
// Simple success response
return $this->successResponse($data, 'Operation successful');

// With metadata
return $this->successResponse($data, 'Data retrieved', 200, [
    'timestamp' => now(),
    'version' => '1.0'
]);
```

**Output:**
```json
{
    "data": [...],
    "message": "Operation successful",
    "meta": {
        "timestamp": "2026-01-04T10:00:00.000000Z",
        "version": "1.0"
    }
}
```

### 2. Paginated Response
```php
$users = User::paginate(15);
return $this->paginatedResponse($users, 'Users retrieved successfully');
```

**Output:**
```json
{
    "data": [...],
    "message": "Users retrieved successfully",
    "links": {
        "first": "http://api.example.com/users?page=1",
        "last": "http://api.example.com/users?page=5",
        "prev": null,
        "next": "http://api.example.com/users?page=2",
        "self": "http://api.example.com/users?page=1"
    },
    "meta": {
        "current_page": 1,
        "from": 1,
        "to": 15,
        "per_page": 15,
        "total": 75,
        "last_page": 5,
        "path": "http://api.example.com/users"
    }
}
```

### 3. Resource Response (with relationships)
```php
$user = User::with('roles', 'permissions')->find($id);
return $this->resourceResponse($user);
```

**Output:**
```json
{
    "data": {
        "type": "user",
        "id": "1",
        "attributes": {
            "name": "John Doe",
            "email": "john@example.com"
        },
        "relationships": {
            "roles": {...},
            "permissions": {...}
        }
    }
}
```

### 4. Collection Response
```php
$roles = Role::all();
return $this->collectionResponse($roles, [], 'Roles retrieved');
```

**Output:**
```json
{
    "data": [
        {
            "type": "role",
            "id": "1",
            "attributes": {...}
        },
        {
            "type": "role",
            "id": "2",
            "attributes": {...}
        }
    ],
    "message": "Roles retrieved"
}
```

### 5. Error Responses

#### Generic Error
```php
return $this->errorResponse('Something went wrong', 400);
```

**Output:**
```json
{
    "errors": [
        {
            "status": "400",
            "title": "Bad Request",
            "detail": "Something went wrong"
        }
    ]
}
```

#### Validation Error
```php
$validator = Validator::make($request->all(), $rules);

if ($validator->fails()) {
    return $this->validationErrorResponse($validator->errors()->toArray());
}
```

**Output:**
```json
{
    "errors": [
        {
            "status": "422",
            "title": "Validation Error",
            "detail": "The email field is required.",
            "source": {
                "pointer": "/data/attributes/email"
            }
        }
    ],
    "message": "Validation failed"
}
```

#### Not Found
```php
return $this->notFoundResponse('User not found');
```

#### Unauthorized
```php
return $this->unauthorizedResponse('Invalid credentials');
```

#### Forbidden
```php
return $this->forbiddenResponse('Access denied');
```

### 6. Created Response
```php
$user = User::create($data);
return $this->createdResponse($user, 'User created successfully');
```

### 7. No Content Response
```php
$user->delete();
return $this->noContentResponse();
```

## Complete Controller Example

```php
<?php

namespace App\Http\Controllers;

use App\Http\Traits\ApiResponseTrait;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    use ApiResponseTrait;

    /**
     * Display a listing of users with pagination.
     */
    public function index(Request $request)
    {
        $perPage = $request->input('per_page', 15);
        $users = User::with('roles')->paginate($perPage);

        return $this->paginatedResponse($users, 'Users retrieved successfully');
    }

    /**
     * Display the specified user.
     */
    public function show($id)
    {
        $user = User::with('roles', 'permissions')->find($id);

        if (!$user) {
            return $this->notFoundResponse('User not found');
        }

        return $this->resourceResponse($user, [], 'User retrieved successfully');
    }

    /**
     * Store a newly created user.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:8',
        ]);

        if ($validator->fails()) {
            return $this->validationErrorResponse($validator->errors()->toArray());
        }

        $user = User::create($validator->validated());

        return $this->createdResponse($user, 'User created successfully');
    }

    /**
     * Update the specified user.
     */
    public function update(Request $request, $id)
    {
        $user = User::find($id);

        if (!$user) {
            return $this->notFoundResponse('User not found');
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|email|unique:users,email,' . $id,
        ]);

        if ($validator->fails()) {
            return $this->validationErrorResponse($validator->errors()->toArray());
        }

        $user->update($validator->validated());

        return $this->successResponse($user, 'User updated successfully');
    }

    /**
     * Remove the specified user.
     */
    public function destroy($id)
    {
        $user = User::find($id);

        if (!$user) {
            return $this->notFoundResponse('User not found');
        }

        $user->delete();

        return $this->noContentResponse();
    }
}
```

## Custom Resource Type and Relationships

You can customize how your models are formatted by adding these methods to your models:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    /**
     * Get the resource type for JSON:API.
     */
    public function getResourceType(): string
    {
        return 'users';
    }

    /**
     * Get API relationships.
     */
    public function getApiRelationships(): array
    {
        $relationships = [];

        if ($this->relationLoaded('roles')) {
            $relationships['roles'] = [
                'data' => $this->roles->map(fn($role) => [
                    'type' => 'roles',
                    'id' => (string) $role->id,
                ])->toArray(),
            ];
        }

        if ($this->relationLoaded('permissions')) {
            $relationships['permissions'] = [
                'data' => $this->permissions->map(fn($perm) => [
                    'type' => 'permissions',
                    'id' => (string) $perm->id,
                ])->toArray(),
            ];
        }

        return $relationships;
    }
}
```

## Benefits

✅ **JSON:API Compliant** - Follows official JSON:API specification  
✅ **Consistent Responses** - Same structure across all endpoints  
✅ **Pagination Support** - Built-in pagination with metadata and links  
✅ **Relationship Handling** - Easy inclusion of related resources  
✅ **Error Handling** - Standardized error responses  
✅ **Type Safety** - Proper type hints and return types  
✅ **Flexible** - Easy to extend and customize
