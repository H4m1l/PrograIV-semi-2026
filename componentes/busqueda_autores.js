const busqueda_autores = {
    data() {
        return {
            buscar: '',
            autores: []
        }
    },
    methods: {
        modificarAutor(autor) {
            this.$emit('modificar', autor);
        },
        async obtenerAutores() {
            this.autores = await db.autor.filter(
                autor => autor.codigo.toLowerCase().includes(this.buscar.toLowerCase())
                    || autor.nombre.toLowerCase().includes(this.buscar.toLowerCase())
            ).toArray();
        },
        async eliminarAutor(autor, e) {
            e.stopPropagation();
            alertify.confirm('Eliminar autores', `¿Está seguro de eliminar el autor ${autor.nombre}?`, async e => {
                await db.autor.delete(autor.idAutor);
                this.obtenerAutores();
                alertify.success(`Autor ${autor.nombre} eliminado correctamente`);
            }, () => {
                //No hacer nada
            });
        },
    },
    template: `
        <div class="row">
            <div class="col-8">
                <div class="card text-bg-dark mb-3 mt-4" style="border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);">
                    <div class="card-header" style="background: linear-gradient(to right, #4f46e5, #818cf8); color: white; font-weight: 600; font-size: 1.25rem;">
                        BUSQUEDA DE AUTORES
                    </div>
                    <div class="card-body p-0">
                        <div class="p-3">
                            <input autocomplete="off" type="search" @keyup="obtenerAutores()" v-model="buscar" placeholder="Buscar autor por código o nombre..." class="form-control" style="border-radius: 20px; padding-left: 1.5rem;">
                        </div>
                        <div class="table-responsive">
                            <table class="table table-dark table-hover mb-0" id="tblAutores" style="border-radius: 0; background-color: transparent;">
                                <thead>
                                    <tr>
                                        <th>CODIGO</th>
                                        <th>NOMBRE</th>
                                        <th>PAIS</th>
                                        <th>TELEFONO</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="autor in autores" :key="autor.idAutor" @click="modificarAutor(autor)" style="cursor: pointer;">
                                        <td>{{ autor.codigo }}</td>
                                        <td>{{ autor.nombre }}</td>
                                        <td>{{ autor.pais }}</td>
                                        <td>{{ autor.telefono }}</td>
                                        <td>
                                            <button class="btn btn-danger btn-sm" @click="eliminarAutor(autor, $event)">DEL</button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
};
