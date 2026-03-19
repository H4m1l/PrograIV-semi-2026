// componentes/inscripciones.js
import { getDB } from '../db.js'; // Importamos la conexión SQLite

export const inscripciones = {
    props:['forms'],
    data(){
        return{
            inscripcion:{
                idInscripcion:0,
                idAlumno:"",
                idMateria:"",
                fecha:""
            },
            accion:'nuevo',
            idInscripcion:0,
            data_inscripciones:[],
            alumnos_lista: [],
            materias_lista: []
        }
    },
    methods:{
        // Corregido: Usamos SQLite getDB(), y llenamos los arreglos usando rowMode: 'object'
        async obtenerAlumnosYMaterias(){
            try {
                const db = await getDB();
                
                // 1. Obtener Alumnos
                const alumnosLocales = [];
                db.exec({
                    sql: "SELECT * FROM alumnos ORDER BY nombre ASC",
                    rowMode: 'object',
                    callback: (fila) => {
                        alumnosLocales.push(fila);
                    }
                });
                // Asignamos a la variable usada por Vue
                this.alumnos_lista = alumnosLocales;

                // 2. Obtener Materias
                const materiasLocales = [];
                db.exec({
                    sql: "SELECT * FROM materias ORDER BY nombre ASC",
                    rowMode: 'object',
                    callback: (fila) => {
                        materiasLocales.push(fila);
                    }
                });
                // Asignamos a la variable usada por Vue
                this.materias_lista = materiasLocales;

            } catch (error) {
                console.error("Error al obtener listas de select:", error);
            }
        },
        modificarInscripcion(inscripcion){
            this.accion = 'modificar';
            this.idInscripcion = inscripcion.idInscripcion;
            this.inscripcion.idAlumno = inscripcion.idAlumno;
            this.inscripcion.idMateria = inscripcion.idMateria;
            this.inscripcion.fecha = inscripcion.fecha;
        },
        async guardarInscripcion() {
            let datos = {
                idInscripcion: this.accion=='modificar' ? this.idInscripcion : this.getId(),
                idAlumno: this.inscripcion.idAlumno,
                idMateria: this.inscripcion.idMateria,
                fecha: this.inscripcion.fecha
            };
            
            try {
                const db = await getDB();
                
                if (this.accion == 'modificar') {
                    // Update
                    db.exec({
                        sql: "UPDATE inscripciones SET idAlumno = ?, idMateria = ?, fecha = ? WHERE idInscripcion = ?",
                        bind: [datos.idAlumno, datos.idMateria, datos.fecha, datos.idInscripcion]
                    });
                } else {
                    // Insert
                    db.exec({
                        sql: "INSERT INTO inscripciones (idInscripcion, idAlumno, idMateria, fecha) VALUES (?, ?, ?, ?)",
                        bind: [datos.idInscripcion, datos.idAlumno, datos.idMateria, datos.fecha]
                    });
                }

                this.limpiarFormulario();
                alertify.success(`Inscripción guardada correctamente en Local DB`);
            } catch (error) {
                console.error("Error al guardar en BD local:", error);
                alertify.error(`Error guardando: ${error.message}`);
            }
        },
        getId(){
            return new Date().getTime();
        },
        limpiarFormulario(){
            this.accion = 'nuevo';
            this.idInscripcion = 0;
            this.inscripcion.idAlumno = '';
            this.inscripcion.idMateria = '';
            this.inscripcion.fecha = '';
        },
    },
    mounted(){
        this.obtenerAlumnosYMaterias();
    },
    template: `
        <div class="row">
            <div class="col-6">
                <form id="frmInscripciones" @submit.prevent="guardarInscripcion" @reset.prevent="limpiarFormulario">
                    <div class="card text-bg-dark mb-3" style="max-width: 36rem;">
                        <div class="card-header">REGISTRO DE INSCRIPCIONES</div>
                        <!-- Retiré el click="@obtenerAlumnosYMaterias" de aquí para evitar recargas constantes y conflictos, mounted lo hará por nosotros -->
                        <div class="card-body">
                            <div class="row p-1">
                                <div class="col-3">
                                    ALUMNO:
                                </div>
                                <div class="col-8">
                                    <select required v-model="inscripcion.idAlumno" class="form-select">
                                        <option value="" disabled>Seleccione un alumno</option>
                                        <option v-for="a in alumnos_lista" :key="a.idAlumno" :value="a.idAlumno">{{a.codigo}} - {{a.nombre}}</option>
                                    </select>
                                </div>
                            </div>
                            <div class="row p-1">
                                <div class="col-3">
                                    MATERIA:
                                </div>
                                <div class="col-8">
                                    <select required v-model="inscripcion.idMateria" class="form-select">
                                        <option value="" disabled>Seleccione una materia</option>
                                        <option v-for="m in materias_lista" :key="m.idMateria" :value="m.idMateria">{{m.codigo}} - {{m.nombre}}</option>
                                    </select>
                                </div>
                            </div>
                            <div class="row p-1">
                                <div class="col-3">
                                    FECHA:
                                </div>
                                <div class="col-6">
                                    <input required v-model="inscripcion.fecha" type="date" class="form-control">
                                </div>
                            </div>
                        </div>
                        <div class="card-footer">
                            <div class="row">
                                <div class="col text-center">
                                    <button type="submit" id="btnGuardarInscripcion" class="btn btn-primary">GUARDAR</button>
                                    <button type="reset" id="btnCancelarInscripcion" class="btn btn-warning">NUEVO</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    `
};

