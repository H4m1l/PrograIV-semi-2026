const autores = {
    props: ['forms'],
    data() {
        return {
            autor: {
                idAutor: 0,
                codigo: "",
                nombre: "",
                pais: "",
                telefono: ""
            },
            accion: 'nuevo',
            idAutor: 0,
            data_autores: []
        }
    },
    methods: {
        buscarAutor() {
            this.forms.busqueda_autores.mostrar = !this.forms.busqueda_autores.mostrar;
            this.$emit('buscar');
        },
        modificarAutor(autor) {
            this.accion = 'modificar';
            this.idAutor = autor.idAutor;
            this.autor.codigo = autor.codigo;
            this.autor.nombre = autor.nombre;
            this.autor.pais = autor.pais;
            this.autor.telefono = autor.telefono;
        },
        async guardarAutor() {
            let datos = {
                idAutor: this.accion == 'modificar' ? this.idAutor : this.getId(),
                codigo: this.autor.codigo,
                nombre: this.autor.nombre,
                pais: this.autor.pais,
                telefono: this.autor.telefono
            };
            this.buscar = datos.codigo;

            db.autor.put(datos);
            this.limpiarFormulario();
            alertify.success(`${datos.nombre} guardado correctamente`);
        },
        getId() {
            return new Date().getTime();
        },
        limpiarFormulario() {
            this.accion = 'nuevo';
            this.idAutor = 0;
            this.autor.codigo = '';
            this.autor.nombre = '';
            this.autor.pais = '';
            this.autor.telefono = '';
        },
    },
    template: `
        <div class="row">
            <div class="col-6">
                <form id="frmAutores" @submit.prevent="guardarAutor" @reset.prevent="limpiarFormulario">
                    <div class="card text-bg-dark mb-3 mt-4" style="max-width: 48rem; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);">
                        <div class="card-header" style="background: linear-gradient(to right, #4f46e5, #818cf8); color: white; font-weight: 600; font-size: 1.25rem;">REGISTRO DE AUTORES</div>
                        <div class="card-body">
                            <div class="row mb-3 align-items-center">
                                <div class="col-4">
                                    <label class="form-label mb-0">CODIGO:</label>
                                </div>
                                <div class="col-4">
                                    <input placeholder="codigo" required v-model="autor.codigo" type="text" class="form-control">
                                </div>
                            </div>
                            <div class="row mb-3 align-items-center">
                                <div class="col-4">
                                    <label class="form-label mb-0">NOMBRE:</label>
                                </div>
                                <div class="col-8">
                                    <input placeholder="nombre" required v-model="autor.nombre" type="text" class="form-control">
                                </div>
                            </div>
                            <div class="row mb-3 align-items-center">
                                <div class="col-4">
                                    <label class="form-label mb-0">PAIS:</label>
                                </div>
                                <div class="col-8">
                                    <input placeholder="pais" required v-model="autor.pais" type="text" class="form-control">
                                </div>
                            </div>
                            <div class="row mb-3 align-items-center">
                                <div class="col-4">
                                    <label class="form-label mb-0">TELEFONO:</label>
                                </div>
                                <div class="col-4">
                                    <input placeholder="telefono" required v-model="autor.telefono" type="text" class="form-control">
                                </div>
                            </div>
                        </div>
                        <div class="card-footer">
                            <div class="row">
                                <div class="col text-center">
                                    <button type="submit" id="btnGuardarAutor" class="btn btn-primary">GUARDAR</button>
                                    <button type="reset" id="btnCancelarAutor" class="btn btn-warning">NUEVO</button>
                                    <button type="button" @click="buscarAutor" id="btnBuscarAutor" class="btn btn-success">BUSCAR</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    `
};
