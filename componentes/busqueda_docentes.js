import { getDB } from '../db.js';

export const busqueda_docentes = {
    data(){
        return{
            buscar:'',
            docentes:[]
        }
    },
    methods:{
        modificarDocente(docente){
            this.$emit('modificar', docente);
        },
        async obtenerDocentes(){
            const db = await getDB();
            let query = "SELECT * FROM docentes";
            let binds = [];
            
            if (this.buscar.trim() !== '') {
                query += " WHERE lower(codigo) LIKE ? OR lower(nombre) LIKE ?";
                const likeStr = '%' + this.buscar.toLowerCase() + '%';
                binds = [likeStr, likeStr];
            }
            query += " ORDER BY nombre ASC";
            
            const results = [];
            db.exec({
                sql: query,
                bind: binds,
                rowMode: 'object',
                callback: (row) => results.push(row)
            });
            this.docentes = results;
        },
        async eliminarDocente(docente, e){
            e.stopPropagation();
            alertify.confirm('Elimanar docentes', `¿Está seguro de eliminar el docente ${docente.nombre}?`, async e=>{
                const db = await getDB();
                db.exec({
                    sql: "DELETE FROM docentes WHERE idDocente = ?",
                    bind: [docente.idDocente]
                });
                this.obtenerDocentes();
                alertify.success(`Docente ${docente.nombre} eliminado correctamente`);
            }, () => {
                //No hacer nada
            });
        },
    },
    template: `
        <div class="row">
            <div class="col-6">
                <table class="table table-striped table-hover" id="tblDocentes">
                    <thead>
                        <tr>
                            <th colspan="6">
                                <input autocomplete="off" type="search" @keyup="obtenerDocentes()" v-model="buscar" placeholder="Buscar docente" class="form-control">
                            </th>
                        </tr>
                        <tr>
                            <th>CODIGO</th>
                            <th>NOMBRE</th>
                            <th>DIRECCION</th>
                            <th>EMAIL</th>
                            <th>TELEFONO</th>
                            <th>ESCALAFON</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="docente in docentes" :key="docente.idDocente" @click="modificarDocente(docente)">
                            <td>{{ docente.codigo }}</td>
                            <td>{{ docente.nombre }}</td>
                            <td>{{ docente.direccion }}</td>
                            <td>{{ docente.email }}</td>
                            <td>{{ docente.telefono }}</td>
                            <td>{{ docente.escalafon }}</td>
                            <td>
                                <button class="btn btn-danger" @click="eliminarDocente(docente, $event)">DEL</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    `
}; 