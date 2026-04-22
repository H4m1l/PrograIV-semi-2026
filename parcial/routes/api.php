<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

use App\Http\Controllers\ConductorController;
use App\Http\Controllers\VehiculoController;

Route::apiResource('conductores', ConductorController::class);
Route::apiResource('vehiculos', VehiculoController::class);
