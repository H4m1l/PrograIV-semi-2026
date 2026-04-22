<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Conductor extends Model
{
    protected $table = 'conductores';
    protected $fillable = ['dui', 'nombres', 'apellidos', 'licencia_tipo', 'telefono'];

    public function vehiculos()
    {
        return $this->hasMany(Vehiculo::class);
    }
}
