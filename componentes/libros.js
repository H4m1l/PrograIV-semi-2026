const libros = {
    props: ['forms'],
    data() {
        return {
            libro: {
                idLibro: 0,
                idAutor: "",
                isbn: "",
                titulo: "",
                editorial: "",
                edicion: ""
            },
            accion: 'nuevo',
            idLibro: 0,
            data_libros: []
        }
    },
    methods: {
        buscarLibro() {
            this.forms.busqueda_libros.mostrar = !this.forms.busqueda_libros.mostrar;
            this.$emit('buscar');
        },
        modificarLibro(libro) {
            this.accion = 'modificar';
            this.idLibro = libro.idLibro;
            this.libro.idAutor = libro.idAutor;
            this.libro.isbn = libro.isbn;
            this.libro.titulo = libro.titulo;
            this.libro.editorial = libro.editorial;
            this.libro.edicion = libro.edicion;
        },
        async guardarLibro() {
            let datos = {
                idLibro: this.accion == 'modificar' ? this.idLibro : this.getId(),
                idAutor: this.libro.idAutor,
                isbn: this.libro.isbn,
                titulo: this.libro.titulo,
                editorial: this.libro.editorial,
                edicion: this.libro.edicion
            };
            this.buscar = datos.isbn;

            db.libros.put(datos);
            this.limpiarFormulario();
            alertify.success(`${datos.titulo} guardado correctamente`);
        },
        getId() {
            return new Date().getTime();
        },
        limpiarFormulario() {
            this.accion = 'nuevo';
            this.idLibro = 0;
            this.libro.idAutor = '';
            this.libro.isbn = '';
            this.libro.titulo = '';
            this.libro.editorial = '';
            this.libro.edicion = '';
        },
    },
    template: `
        <div class="row">
            <div class="col-8">
                <form id="frmLibros" @submit.prevent="guardarLibro" @reset.prevent="limpiarFormulario">
                    <div class="card text-bg-dark mb-3 mt-4" style="max-width: 48rem; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);">
                        <div class="card-header" style="background: linear-gradient(to right, #4f46e5, #818cf8); color: white; font-weight: 600; font-size: 1.25rem;">REGISTRO DE LIBROS</div>
                        <div class="card-body">
                            <div class="row mb-3 align-items-center">
                                <div class="col-3">
                                    <label class="form-label mb-0">ID AUTOR:</label>
                                </div>
                                <div class="col-4">
                                    <input placeholder="idAutor" required v-model="libro.idAutor" type="text" class="form-control">
                                </div>
                            </div>
                            <div class="row mb-3 align-items-center">
                                <div class="col-3">
                                    <label class="form-label mb-0">ISBN:</label>
                                </div>
                                <div class="col-5">
                                    <input placeholder="ISBN" required v-model="libro.isbn" type="text" class="form-control">
                                </div>
                            </div>
                            <div class="row mb-3 align-items-center">
                                <div class="col-3">
                                    <label class="form-label mb-0">TITULO:</label>
                                </div>
                                <div class="col-9">
                                    <input placeholder="Título del libro" required v-model="libro.titulo" type="text" class="form-control">
                                </div>
                            </div>
                            <div class="row mb-3 align-items-center">
                                <div class="col-3">
                                    <label class="form-label mb-0">EDITORIAL:</label>
                                </div>
                                <div class="col-6">
                                    <input placeholder="Editorial" required v-model="libro.editorial" type="text" class="form-control">
                                </div>
                            </div>
                            <div class="row mb-3 align-items-center">
                                <div class="col-3">
                                    <label class="form-label mb-0">EDICION:</label>
                                </div>
                                <div class="col-6">
                                    <input placeholder="Edición" required v-model="libro.edicion" type="text" class="form-control">
                                </div>
                            </div>
                        </div>
                        <div class="card-footer">
                            <div class="row">
                                <div class="col text-center">
                                    <button type="submit" id="btnGuardarLibro" class="btn btn-primary">GUARDAR</button>
                                    <button type="reset" id="btnCancelarLibro" class="btn btn-warning">NUEVO</button>
                                    <button type="button" @click="buscarLibro" id="btnBuscarLibro" class="btn btn-success">BUSCAR</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    `
};
