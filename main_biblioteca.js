const { createApp } = Vue,
    Dexie = window.Dexie,
    db = new Dexie("db_usss032024_biblioteca");
sha256 = CryptoJS.SHA256;


createApp({
    components: {
        autores,
        busqueda_autores,
        libros,
        busqueda_libros
    },
    data() {
        return {
            forms: {
                autores: { mostrar: false },
                busqueda_autores: { mostrar: false },
                libros: { mostrar: false },
                busqueda_libros: { mostrar: false }
            }
        }
    },
    methods: {
        buscar(ventana, metodo) {
            this.$refs[ventana][metodo]();
        },
        abrirVentana(ventana) {
            this.forms[ventana].mostrar = !this.forms[ventana].mostrar;
        },
        modificar(ventana, metodo, data) {
            this.$refs[ventana][metodo](data);
        }
    },
    mounted() {
        db.version(1).stores({
            "autor": "idAutor, codigo, nombre, pais, telefono",
            "libros": "idLibro, idAutor, isbn, titulo, editorial, edicion"
        });
    }
}).mount("#app");
