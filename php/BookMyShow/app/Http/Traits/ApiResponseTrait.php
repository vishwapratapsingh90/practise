<?php

namespace App\Http\Traits;

use Illuminate\Http\JsonResponse;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

trait ApiResponseTrait
{
    /**
     * Return a successful JSON:API response.
     *
     * @param mixed $data
     * @param string|null $message
     * @param int $statusCode
     * @param array $meta
     * @return JsonResponse
     */
    protected function successResponse($data, ?string $message = null, int $statusCode = 200, array $meta = []): JsonResponse
    {
        $response = [
            'data' => $data,
        ];

        if ($message) {
            $response['message'] = $message;
        }

        if (!empty($meta)) {
            $response['meta'] = $meta;
        }

        return response()->json($response, $statusCode);
    }

    /**
     * Return a paginated JSON:API response.
     *
     * @param LengthAwarePaginator $paginator
     * @param string|null $message
     * @param array $meta
     * @return JsonResponse
     */
    protected function paginatedResponse(LengthAwarePaginator $paginator, ?string $message = null, array $meta = []): JsonResponse
    {
        $response = [
            'data' => $paginator->items(),
            'links' => [
                'first' => $paginator->url(1),
                'last' => $paginator->url($paginator->lastPage()),
                'prev' => $paginator->previousPageUrl(),
                'next' => $paginator->nextPageUrl(),
                'self' => $paginator->url($paginator->currentPage()),
            ],
            'meta' => array_merge([
                'current_page' => $paginator->currentPage(),
                'from' => $paginator->firstItem(),
                'to' => $paginator->lastItem(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
                'last_page' => $paginator->lastPage(),
                'path' => $paginator->path(),
            ], $meta),
        ];

        if ($message) {
            $response['message'] = $message;
        }

        return response()->json($response, 200);
    }

    /**
     * Return a resource response with relationships.
     *
     * @param mixed $data
     * @param array $included
     * @param string|null $message
     * @param int $statusCode
     * @param array $meta
     * @return JsonResponse
     */
    protected function resourceResponse($data, array $included = [], ?string $message = null, int $statusCode = 200, array $meta = []): JsonResponse
    {
        $response = [
            'data' => $this->formatResource($data),
        ];

        if (!empty($included)) {
            $response['included'] = $included;
        }

        if ($message) {
            $response['message'] = $message;
        }

        if (!empty($meta)) {
            $response['meta'] = $meta;
        }

        return response()->json($response, $statusCode);
    }

    /**
     * Return a collection response with relationships.
     *
     * @param Collection|array $data
     * @param array $included
     * @param string|null $message
     * @param int $statusCode
     * @param array $meta
     * @return JsonResponse
     */
    protected function collectionResponse($data, array $included = [], ?string $message = null, int $statusCode = 200, array $meta = []): JsonResponse
    {
        $formattedData = is_array($data) ? $data : $data->map(function ($item) {
            return $this->formatResource($item);
        })->toArray();

        $response = [
            'data' => $formattedData,
        ];

        if (!empty($included)) {
            $response['included'] = $included;
        }

        if ($message) {
            $response['message'] = $message;
        }

        if (!empty($meta)) {
            $response['meta'] = $meta;
        }

        return response()->json($response, $statusCode);
    }

    /**
     * Return an error JSON:API response.
     *
     * @param string|array $errors
     * @param int $statusCode
     * @param string|null $title
     * @param array $meta
     * @return JsonResponse
     */
    protected function errorResponse($errors, int $statusCode = 400, ?string $title = null, array $meta = []): JsonResponse
    {
        $formattedErrors = is_array($errors) ? $errors : [$errors];

        $response = [
            'errors' => array_map(function ($error) use ($statusCode, $title) {
                if (is_string($error)) {
                    return [
                        'status' => (string) $statusCode,
                        'title' => $title ?? $this->getDefaultErrorTitle($statusCode),
                        'detail' => $error,
                    ];
                }
                return $error;
            }, $formattedErrors),
        ];

        if (!empty($meta)) {
            $response['meta'] = $meta;
        }

        return response()->json($response, $statusCode);
    }

    /**
     * Return a validation error response.
     *
     * @param array $errors
     * @param string|null $message
     * @return JsonResponse
     */
    protected function validationErrorResponse(array $errors, ?string $message = 'Validation failed'): JsonResponse
    {
        $formattedErrors = [];

        foreach ($errors as $field => $messages) {
            foreach ((array) $messages as $message) {
                $formattedErrors[] = [
                    'status' => '422',
                    'title' => 'Validation Error',
                    'detail' => $message,
                    'source' => [
                        'pointer' => "/data/attributes/{$field}",
                    ],
                ];
            }
        }

        return response()->json([
            'errors' => $formattedErrors,
            'message' => $message,
        ], 422);
    }

    /**
     * Return a not found error response.
     *
     * @param string $message
     * @return JsonResponse
     */
    protected function notFoundResponse(string $message = 'Resource not found'): JsonResponse
    {
        return $this->errorResponse($message, 404, 'Not Found');
    }

    /**
     * Return an unauthorized error response.
     *
     * @param string $message
     * @return JsonResponse
     */
    protected function unauthorizedResponse(string $message = 'Unauthorized'): JsonResponse
    {
        return $this->errorResponse($message, 401, 'Unauthorized');
    }

    /**
     * Return a forbidden error response.
     *
     * @param string $message
     * @return JsonResponse
     */
    protected function forbiddenResponse(string $message = 'Forbidden'): JsonResponse
    {
        return $this->errorResponse($message, 403, 'Forbidden');
    }

    /**
     * Return a created response.
     *
     * @param mixed $data
     * @param string|null $message
     * @param array $meta
     * @return JsonResponse
     */
    protected function createdResponse($data, ?string $message = 'Resource created successfully', array $meta = []): JsonResponse
    {
        return $this->successResponse($data, $message, 201, $meta);
    }

    /**
     * Return a no content response.
     *
     * @return JsonResponse
     */
    protected function noContentResponse(): JsonResponse
    {
        return response()->json(null, 204);
    }

    /**
     * Format a single resource according to JSON:API spec.
     *
     * @param mixed $resource
     * @return array
     */
    protected function formatResource($resource): array
    {
        if (is_array($resource)) {
            return $resource;
        }

        $formatted = [
            'type' => $this->getResourceType($resource),
            'id' => (string) ($resource->id ?? $resource->getKey()),
            'attributes' => $this->getResourceAttributes($resource),
        ];

        // Add relationships if available
        $relationships = $this->getResourceRelationships($resource);
        if (!empty($relationships)) {
            $formatted['relationships'] = $relationships;
        }

        return $formatted;
    }

    /**
     * Get resource type from model.
     *
     * @param mixed $resource
     * @return string
     */
    protected function getResourceType($resource): string
    {
        if (method_exists($resource, 'getResourceType')) {
            return $resource->getResourceType();
        }

        $className = class_basename($resource);
        return strtolower(str_replace('_', '-', preg_replace('/(?<!^)[A-Z]/', '_$0', $className)));
    }

    /**
     * Get resource attributes.
     *
     * @param mixed $resource
     * @return array
     */
    protected function getResourceAttributes($resource): array
    {
        if (method_exists($resource, 'toArray')) {
            $attributes = $resource->toArray();
            // Remove id and relationship keys
            unset($attributes['id']);
            return $attributes;
        }

        return [];
    }

    /**
     * Get resource relationships.
     *
     * @param mixed $resource
     * @return array
     */
    protected function getResourceRelationships($resource): array
    {
        if (method_exists($resource, 'getApiRelationships')) {
            return $resource->getApiRelationships();
        }

        return [];
    }

    /**
     * Get default error title based on status code.
     *
     * @param int $statusCode
     * @return string
     */
    protected function getDefaultErrorTitle(int $statusCode): string
    {
        $titles = [
            400 => 'Bad Request',
            401 => 'Unauthorized',
            403 => 'Forbidden',
            404 => 'Not Found',
            422 => 'Unprocessable Entity',
            500 => 'Internal Server Error',
        ];

        return $titles[$statusCode] ?? 'Error';
    }
}
