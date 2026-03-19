// db.js
let dbInstance = null;

export async function initDB() {
    if (dbInstance) return dbInstance;

    try {
        console.log('Initializing SQLite3...');
        const sqlite3 = await window.sqlite3InitModule({
            print: console.log,
            printErr: console.error,
        });

        console.log('Running SQLite3 version', sqlite3.version.libVersion);

        let opfsSuccess = false;
        try {
            if (sqlite3.installOpfsSAHPoolVfs) {
                console.log("Instalando OPFS SAH Pool para persistencia en Main Thread...");
                const poolUtil = await sqlite3.installOpfsSAHPoolVfs();
                dbInstance = new poolUtil.OpfsSAHPoolDb('/academica.sqlite3');
                console.log('OPFS SAH Pool inicializado de forma exitosa en el main thread.');
                opfsSuccess = true;
            } else if ('opfs' in sqlite3) {
                console.log("Intentando OPFS normal...");
                dbInstance = new sqlite3.oo1.OpfsDb('/academica.sqlite3');
                opfsSuccess = true;
            }
        } catch (opfsError) {
            console.warn("OPFS bloqueado o no soportado (tracking prevention/sin worker):", opfsError.message);
        }

        if (!opfsSuccess) {
            console.warn("Cayendo a LocalStorage para SQLite persistente de forma segura.");
            dbInstance = new sqlite3.oo1.JsStorageDb('local');
        }

        // Initialize tables
        dbInstance.exec(`
            CREATE TABLE IF NOT EXISTS alumnos (
                idAlumno INTEGER PRIMARY KEY,
                codigo TEXT,
                nombre TEXT,
                direccion TEXT,
                email TEXT,
                telefono TEXT
            );
            CREATE TABLE IF NOT EXISTS materias (
                idMateria INTEGER PRIMARY KEY,
                codigo TEXT,
                nombre TEXT,
                uv INTEGER
            );
            CREATE TABLE IF NOT EXISTS docentes (
                idDocente INTEGER PRIMARY KEY,
                codigo TEXT,
                nombre TEXT,
                direccion TEXT,
                email TEXT,
                telefono TEXT,
                escalafon TEXT
            );
            CREATE TABLE IF NOT EXISTS inscripciones (
                idInscripcion INTEGER PRIMARY KEY,
                idAlumno INTEGER,
                idMateria INTEGER,
                fecha TEXT
            );
        `);

        return dbInstance;
    } catch (err) {
        console.error('Initialization error:', err.name, err.message);
        throw err;
    }
}

export async function getDB() {
    if (!dbInstance) {
        await initDB();
    }
    return dbInstance;
}
