import { getDB } from '../db.js';

export const busqueda_materias = {
    data(){
        return{
            buscar:'',
            materias:[]
        }
    },
    methods:{
        modificarMateria(materia){
            this.$emit('modificar', materia);
        },
        async obtenerMaterias(){
            const db = await getDB();
            let query = "SELECT * FROM materias";
            let binds = [];
            
            if (this.buscar.trim() !== '') {
                query += " WHERE lower(codigo) LIKE ? OR lower(nombre) LIKE ?";
                const likeStr = '%' + this.buscar.toLowerCase() + '%';
                binds = [likeStr, likeStr];
            }
            query += " ORDER BY codigo ASC";
            
            const results = [];
            db.exec({
                sql: query,
                bind: binds,
                rowMode: 'object',
                callback: (row) => results.push(row)
            });
            this.materias = results;
        },
        async eliminarMateria(materia, e){
            e.stopPropagation();
            alertify.confirm('Eliminar materias', `¿Está seguro de eliminar el materia ${materia.nombre}?`, async e=>{
                const db = await getDB();
                db.exec({
                    sql: "DELETE FROM materias WHERE idMateria = ?",
                    bind: [materia.idMateria]
                });
                this.obtenerMaterias();
                alertify.success(`Materia ${materia.nombre} eliminada correctamente`);
            }, () => {
                //No hacer nada
            });
        },
    },
    template: `
        <div class="row">
            <div class="col-6">
                <table class="table table-striped table-hover" id="tblMaterias">
                    <thead>
                        <tr>
                            <th colspan="6">
                                <input autocomplete="off" type="search" @keyup="obtenerMaterias()" v-model="buscar" placeholder="Buscar materia" class="form-control">
                            </th>
                        </tr>
                        <tr>
                            <th>CODIGO</th>
                            <th>NOMBRE</th>
                            <th>UV</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="materia in materias" :key="materia.idMateria" @click="modificarMateria(materia)">
                            <td>{{ materia.codigo }}</td>
                            <td>{{ materia.nombre }}</td>
                            <td>{{ materia.uv }}</td>
                            <td>
                                <button class="btn btn-danger" @click="eliminarMateria(materia, $event)">DEL</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    `
};