const { createApp } = Vue;

createApp({
    data() {
        return {
            accion: "Nuevo",
            id: 0,
            alumno: {
                codigo: "",
                nombre: "",
                direccion: "",
                municipio: "",
                departamento: "",
                telefono: "",
                fechaNacimiento: "",
                sexo: "",
                email: ""
            },
            buscar: "",
            alumnos: []
        }
    },
    methods: {
        obtenerAlumnos() {
            let n = localStorage.length;
            this.alumnos = [];
            for (let i = 0; i < n; i++) {
                let key = localStorage.key(i);
                if (!isNaN(Number(key))) {
                    try {
                        let data = JSON.parse(localStorage.getItem(key));
                       
                        if (data.nombre.toUpperCase().includes(this.buscar.toUpperCase()) ||
                            data.codigo.toUpperCase().includes(this.buscar.toUpperCase())) {
                            this.alumnos.push(data);
                        }
                    } catch (e) {
                        console.error("Error reading key: " + key, e);
                    }
                }
            }
        },
        eliminarAlumno(id, event) {
            event.stopPropagation();
            if (confirm("¿Está seguro de eliminar el alumno?")) {
                localStorage.removeItem(id);
                this.obtenerAlumnos();
            }
        },
        modificarAlumno(alumno) {
            this.accion = "Modificar";
            this.id = alumno.id;
           
            this.alumno = { ...alumno };
        },
        guardarAlumno() {
            let datos = {
                id: this.accion == "Modificar" ? this.id : this.getId(),
                codigo: this.alumno.codigo,
                nombre: this.alumno.nombre,
                direccion: this.alumno.direccion,
                municipio: this.alumno.municipio,
                departamento: this.alumno.departamento,
                telefono: this.alumno.telefono,
                fechaNacimiento: this.alumno.fechaNacimiento,
                sexo: this.alumno.sexo,
                email: this.alumno.email
            };

            let codigoDuplicado = this.buscarAlumno(datos.codigo);
            if (codigoDuplicado && this.accion == "Nuevo") {
                alert("El código del alumno ya existe, pertenece a: " + codigoDuplicado.nombre);
                return;
            }

            localStorage.setItem(datos.id, JSON.stringify(datos));
            this.limpiarFormulario();
            this.obtenerAlumnos();
        },
        getId() {
            return new Date().getTime();
        },
        limpiarFormulario() {
            this.accion = "Nuevo";
            this.id = 0;
            this.alumno = {
                codigo: "",
                nombre: "",
                direccion: "",
                municipio: "",
                departamento: "",
                telefono: "",
                fechaNacimiento: "",
                sexo: "",
                email: ""
            };
        },
        buscarAlumno(codigo = '') {
            let n = localStorage.length;
            for (let i = 0; i < n; i++) {
                let key = localStorage.key(i);
                if (!isNaN(Number(key))) {
                    try {
                        let datos = JSON.parse(localStorage.getItem(key));
                        if (datos?.codigo && datos.codigo.trim().toUpperCase() == codigo.trim().toUpperCase()) {
                            return datos;
                        }
                    } catch (e) { }
                }
            }
            return null;
        }
    },
    mounted() {
        this.obtenerAlumnos();
    }
}
).mount("#app");
