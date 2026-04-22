<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Vehiculo extends Model
{
    protected $table = 'vehiculos';
    protected $fillable = ['placa', 'marca', 'modelo', 'anio', 'conductor_id'];

    public function conductor()
    {
        return $this->belongsTo(Conductor::class);
    }
}
