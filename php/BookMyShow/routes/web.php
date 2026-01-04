<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('index');
});

// Catch-all route for React SPA - must be last
Route::get('/{any}', function () {
    return view('index');
})->where('any', '.*');
