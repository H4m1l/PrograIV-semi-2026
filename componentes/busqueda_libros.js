const busqueda_libros = {
    data() {
        return {
            buscar: '',
            libros: []
        }
    },
    methods: {
        modificarLibro(libro) {
            this.$emit('modificar', libro);
        },
        async obtenerLibros() {
            this.libros = await db.libros.filter(
                libro => libro.isbn.toLowerCase().includes(this.buscar.toLowerCase())
                    || libro.titulo.toLowerCase().includes(this.buscar.toLowerCase())
            ).toArray();
        },
        async eliminarLibro(libro, e) {
            e.stopPropagation();
            alertify.confirm('Eliminar libro', `¿Está seguro de eliminar el libro ${libro.titulo}?`, async e => {
                await db.libros.delete(libro.idLibro);
                this.obtenerLibros();
                alertify.success(`Libro ${libro.titulo} eliminado correctamente`);
            }, () => {
                //No hacer nada
            });
        },
    },
    template: `
        <div class="row">
            <div class="col-10">
                <div class="card text-bg-dark mb-3 mt-4" style="border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);">
                    <div class="card-header" style="background: linear-gradient(to right, #4f46e5, #818cf8); color: white; font-weight: 600; font-size: 1.25rem;">
                        BUSQUEDA DE LIBROS
                    </div>
                    <div class="card-body p-0">
                        <div class="p-3">
                            <input autocomplete="off" type="search" @keyup="obtenerLibros()" v-model="buscar" placeholder="Buscar libro por ISBN o título..." class="form-control" style="border-radius: 20px; padding-left: 1.5rem;">
                        </div>
                        <div class="table-responsive">
                            <table class="table table-dark table-hover mb-0" id="tblLibros" style="border-radius: 0; background-color: transparent;">
                                <thead>
                                    <tr>
                                        <th>AUTOR</th>
                                        <th>ISBN</th>
                                        <th>TITULO</th>
                                        <th>EDITORIAL</th>
                                        <th>EDICION</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="libro in libros" :key="libro.idLibro" @click="modificarLibro(libro)" style="cursor: pointer;">
                                        <td>{{ libro.idAutor }}</td>
                                        <td>{{ libro.isbn }}</td>
                                        <td>{{ libro.titulo }}</td>
                                        <td>{{ libro.editorial }}</td>
                                        <td>{{ libro.edicion }}</td>
                                        <td>
                                            <button class="btn btn-danger btn-sm" @click="eliminarLibro(libro, $event)">DEL</button>
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
