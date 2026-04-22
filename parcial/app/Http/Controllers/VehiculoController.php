<?php

namespace App\Http\Controllers;

use App\Models\Vehiculo;
use Illuminate\Http\Request;

class VehiculoController extends Controller
{
    public function index(Request $request)
    {
        $query = Vehiculo::with('conductor');
        if ($request->has('search') && $request->search != '') {
            $search = $request->search;
            $query->where('placa', 'LIKE', "%{$search}%")
                  ->orWhere('marca', 'LIKE', "%{$search}%")
                  ->orWhere('modelo', 'LIKE', "%{$search}%");
        }
        return response()->json($query->orderBy('id', 'desc')->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'placa' => 'required|string|max:20|unique:vehiculos',
            'marca' => 'required|string|max:255',
            'modelo' => 'required|string|max:255',
            'anio' => 'required|integer',
            'conductor_id' => 'required|exists:conductores,id',
        ]);

        $vehiculo = Vehiculo::create($request->all());
        return response()->json(['message' => 'Vehículo registrado con éxito', 'data' => $vehiculo], 201);
    }

    public function show($id)
    {
        $vehiculo = Vehiculo::with('conductor')->findOrFail($id);
        return response()->json($vehiculo);
    }

    public function update(Request $request, $id)
    {
        $vehiculo = Vehiculo::findOrFail($id);
        
        $request->validate([
            'placa' => 'required|string|max:20|unique:vehiculos,placa,' . $vehiculo->id,
            'marca' => 'required|string|max:255',
            'modelo' => 'required|string|max:255',
            'anio' => 'required|integer',
            'conductor_id' => 'required|exists:conductores,id',
        ]);

        $vehiculo->update($request->all());
        return response()->json(['message' => 'Vehículo actualizado con éxito', 'data' => $vehiculo]);
    }

    public function destroy($id)
    {
        $vehiculo = Vehiculo::findOrFail($id);
        $vehiculo->delete();
        return response()->json(['message' => 'Vehículo eliminado con éxito']);
    }
}
