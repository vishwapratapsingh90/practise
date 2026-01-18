<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Permission extends Model {
    use HasFactory;

    // Status constants
    const STATUS_ACTIVE = 1;
    const STATUS_INACTIVE = 2;
    const STATUS_DELETED = 3;

    // Status labels for display
    const STATUS_LABELS = [
        self::STATUS_ACTIVE => 'Active',
        self::STATUS_INACTIVE => 'Inactive',
        self::STATUS_DELETED => 'Deleted',
    ];

    protected $fillable = [
        'slug',
        'description',
        'status',
    ];

    protected $casts = [
        'status' => 'integer',
    ];

    /**
     * Get the roles that have this permission.
     */
    public function roles() {
        return $this->belongsToMany(Role::class, 'permission_role', 'permission_id', 'role_id')
            ->withPivot('status')
            ->withTimestamps();
    }

    /**
     * Get only roles where this permission is active.
     */
    public function activeRoles() {
        return $this->belongsToMany(Role::class, 'permission_role', 'permission_id', 'role_id')
            ->wherePivot('status', Role::STATUS_ACTIVE)
            ->withPivot('status')
            ->withTimestamps();
    }

    /**
     * Get status label
     */
    public function getStatusLabelAttribute()
    {
        return self::STATUS_LABELS[$this->status] ?? 'Unknown';
    }

    /**
     * Check if permission is active
     */
    public function isActive()
    {
        return $this->status === self::STATUS_ACTIVE;
    }

    /**
     * Check if permission is inactive
     */
    public function isInactive()
    {
        return $this->status === self::STATUS_INACTIVE;
    }

    /**
     * Check if permission is deleted
     */
    public function isDeleted()
    {
        return $this->status === self::STATUS_DELETED;
    }

    /**
     * Scope to get only active permissions
     */
    public function scopeActive($query)
    {
        return $query->where('status', self::STATUS_ACTIVE);
    }

    /**
     * Scope to get only non-deleted permissions
     */
    public function scopeNotDeleted($query)
    {
        return $query->where('status', '!=', self::STATUS_DELETED);
    }
}
