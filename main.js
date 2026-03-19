import { getDB } from './db.js';
import { alumnos } from './componentes/alumnos.js';
import { busqueda_alumnos } from './componentes/busqueda_alumnos.js';
import { materias } from './componentes/materias.js';
import { busqueda_materias } from './componentes/busqueda_materias.js';
import { docentes } from './componentes/docentes.js';
import { busqueda_docentes } from './componentes/busqueda_docentes.js';
import { inscripciones } from './componentes/inscripciones.js';

const { createApp } = Vue;
const sha256 = CryptoJS.SHA256;

async function iniciarAplicacion() {
    console.log("Esperando instanciación de Base de Datos (SQLite WASM)...");
    
    try {
        await getDB();
    } catch (e) {
        console.error("No se pudo iniciar la DB. Revisa los logs. ", e);
        alertify.error("Error crítico inicializando SQLite");
        return;
    }

    createApp({
        components:{
            alumnos,
            busqueda_alumnos,
            materias,
            busqueda_materias,
            docentes,
            busqueda_docentes,
            inscripciones
        },
        data(){
            return{
                forms:{
                    alumnos:{mostrar:false},
                    busqueda_alumnos:{mostrar:false},
                    materias:{mostrar:false},
                    busqueda_materias:{mostrar:false},
                    docentes:{mostrar:false},
                    busqueda_docentes:{mostrar:false},
                    matriculas:{mostrar:false},
                    inscripciones:{mostrar:false}
                }
            }
        },
        methods:{
            buscar(ventana, metodo){
                this.$refs[ventana][metodo]();
            },
            abrirVentana(ventana){
                this.forms[ventana].mostrar = !this.forms[ventana].mostrar;
            },
            modificar(ventana, metodo, data){
                this.$refs[ventana][metodo](data);
            }
        }
    }).mount("#app");
    console.log("Aplicación Vue montada exitosamente");
}

window.addEventListener('load', iniciarAplicacion);