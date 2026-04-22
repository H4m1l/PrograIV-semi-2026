<?php

namespace App\Http\Controllers;

use App\Models\Conductor;
use Illuminate\Http\Request;

class ConductorController extends Controller
{
    public function index(Request $request)
    {
        $query = Conductor::query();
        if ($request->has('search') && $request->search != '') {
            $search = $request->search;
            $query->where('dui', 'LIKE', "%{$search}%")
                  ->orWhere('nombres', 'LIKE', "%{$search}%")
                  ->orWhere('apellidos', 'LIKE', "%{$search}%");
        }
        return response()->json($query->orderBy('id', 'desc')->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'dui' => 'required|string|max:10|unique:conductores',
            'nombres' => 'required|string|max:255',
            'apellidos' => 'required|string|max:255',
            'licencia_tipo' => 'required|string|max:50',
            'telefono' => 'required|string|max:20',
        ]);

        $conductor = Conductor::create($request->all());
        return response()->json(['message' => 'Conductor registrado con éxito', 'data' => $conductor], 201);
    }

    public function show($id)
    {
        $conductor = Conductor::findOrFail($id);
        return response()->json($conductor);
    }

    public function update(Request $request, $id)
    {
        $conductor = Conductor::findOrFail($id);
        
        $request->validate([
            'dui' => 'required|string|max:10|unique:conductores,dui,' . $conductor->id,
            'nombres' => 'required|string|max:255',
            'apellidos' => 'required|string|max:255',
            'licencia_tipo' => 'required|string|max:50',
            'telefono' => 'required|string|max:20',
        ]);

        $conductor->update($request->all());
        return response()->json(['message' => 'Conductor actualizado con éxito', 'data' => $conductor]);
    }

    public function destroy($id)
    {
        $conductor = Conductor::findOrFail($id);
        $conductor->delete();
        return response()->json(['message' => 'Conductor eliminado con éxito']);
    }
}
