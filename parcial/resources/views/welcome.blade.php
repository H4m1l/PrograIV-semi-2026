<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Panel VMT - Segundo Parcial</title>
    <!-- Bootstrap 5 CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- SweetAlert2 CSS -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css">
    <!-- Vue 3 -->
    <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
    <!-- Axios -->
    <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
    <!-- SweetAlert2 JS -->
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <style>
        body { background-color: #f4f6f9; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
        .navbar { background-color: #004080; }
        .nav-tabs .nav-link.active { font-weight: bold; color: #004080; border-bottom: 3px solid #004080; }
        .card-header { background-color: #004080; color: white; }
    </style>
</head>
<body>

<div id="app">
    <!-- Navbar -->
    <nav class="navbar navbar-dark mb-4 shadow-sm">
        <div class="container">
            <a class="navbar-brand" href="#">
                <strong>VMT</strong> - Panel de Gestión de Transporte
            </a>
        </div>
    </nav>

    <div class="container">
        <!-- Tabs -->
        <ul class="nav nav-tabs mb-4" id="myTab" role="tablist">
            <li class="nav-item" role="presentation">
                <button class="nav-link active" id="conductores-tab" data-bs-toggle="tab" data-bs-target="#conductores" type="button" role="tab" @click="currentTab = 'conductores'">Gestión de Conductores</button>
            </li>
            <li class="nav-item" role="presentation">
                <button class="nav-link" id="vehiculos-tab" data-bs-toggle="tab" data-bs-target="#vehiculos" type="button" role="tab" @click="currentTab = 'vehiculos'">Gestión de Vehículos</button>
            </li>
        </ul>

        <div class="tab-content" id="myTabContent">
            <!-- Conductores Tab -->
            <div class="tab-pane fade show active" id="conductores" role="tabpanel">
                <div class="row">
                    <!-- Formulario -->
                    <div class="col-md-4">
                        <div class="card shadow-sm mb-4">
                            <div class="card-header">
                                <h5 class="mb-0">@{{ conductorForm.id ? 'Editar' : 'Nuevo' }} Conductor</h5>
                            </div>
                            <div class="card-body">
                                <form @submit.prevent="saveConductor">
                                    <div class="mb-3">
                                        <label>DUI</label>
                                        <input type="text" v-model="conductorForm.dui" class="form-control" required maxlength="10" placeholder="00000000-0">
                                    </div>
                                    <div class="mb-3">
                                        <label>Nombres</label>
                                        <input type="text" v-model="conductorForm.nombres" class="form-control" required>
                                    </div>
                                    <div class="mb-3">
                                        <label>Apellidos</label>
                                        <input type="text" v-model="conductorForm.apellidos" class="form-control" required>
                                    </div>
                                    <div class="mb-3">
                                        <label>Tipo de Licencia</label>
                                        <select v-model="conductorForm.licencia_tipo" class="form-select" required>
                                            <option value="">Seleccione...</option>
                                            <option value="Liviana">Liviana</option>
                                            <option value="Pesada">Pesada</option>
                                            <option value="Motocicleta">Motocicleta</option>
                                        </select>
                                    </div>
                                    <div class="mb-3">
                                        <label>Teléfono</label>
                                        <input type="text" v-model="conductorForm.telefono" class="form-control" required>
                                    </div>
                                    <button type="submit" class="btn btn-primary w-100">Guardar Conductor</button>
                                    <button type="button" class="btn btn-secondary w-100 mt-2" v-if="conductorForm.id" @click="resetConductorForm">Cancelar Edición</button>
                                </form>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Lista / Buscador -->
                    <div class="col-md-8">
                        <div class="card shadow-sm">
                            <div class="card-header d-flex justify-content-between align-items-center">
                                <h5 class="mb-0">Lista de Conductores</h5>
                                <input type="text" v-model="searchConductor" class="form-control form-control-sm w-50" placeholder="Buscar por DUI o Nombres..." @input="fetchConductores">
                            </div>
                            <div class="card-body p-0">
                                <div class="table-responsive">
                                    <table class="table table-striped table-hover mb-0">
                                        <thead>
                                            <tr>
                                                <th>DUI</th>
                                                <th>Nombres</th>
                                                <th>Apellidos</th>
                                                <th>Licencia</th>
                                                <th>Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="c in conductores" :key="c.id">
                                                <td>@{{ c.dui }}</td>
                                                <td>@{{ c.nombres }}</td>
                                                <td>@{{ c.apellidos }}</td>
                                                <td><span class="badge bg-info text-dark">@{{ c.licencia_tipo }}</span></td>
                                                <td>
                                                    <button class="btn btn-sm btn-warning me-1" @click="editConductor(c)">Editar</button>
                                                    <button class="btn btn-sm btn-danger" @click="deleteConductor(c.id)">Eliminar</button>
                                                </td>
                                            </tr>
                                            <tr v-if="conductores.length === 0">
                                                <td colspan="5" class="text-center">No se encontraron conductores.</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Vehiculos Tab -->
            <div class="tab-pane fade" id="vehiculos" role="tabpanel">
                <div class="row">
                    <!-- Formulario -->
                    <div class="col-md-4">
                        <div class="card shadow-sm mb-4">
                            <div class="card-header">
                                <h5 class="mb-0">@{{ vehiculoForm.id ? 'Editar' : 'Nuevo' }} Vehículo</h5>
                            </div>
                            <div class="card-body">
                                <form @submit.prevent="saveVehiculo">
                                    <div class="mb-3">
                                        <label>Placa</label>
                                        <input type="text" v-model="vehiculoForm.placa" class="form-control" required placeholder="P123456">
                                    </div>
                                    <div class="mb-3">
                                        <label>Marca</label>
                                        <input type="text" v-model="vehiculoForm.marca" class="form-control" required>
                                    </div>
                                    <div class="mb-3">
                                        <label>Modelo</label>
                                        <input type="text" v-model="vehiculoForm.modelo" class="form-control" required>
                                    </div>
                                    <div class="mb-3">
                                        <label>Año</label>
                                        <input type="number" v-model="vehiculoForm.anio" class="form-control" required min="1950" max="2026">
                                    </div>
                                    <div class="mb-3">
                                        <label>Conductor (Propietario)</label>
                                        <select v-model="vehiculoForm.conductor_id" class="form-select" required>
                                            <option value="">Seleccione...</option>
                                            <option v-for="c in allConductores" :value="c.id" :key="c.id">@{{ c.nombres }} @{{ c.apellidos }} (@{{ c.dui }})</option>
                                        </select>
                                    </div>
                                    <button type="submit" class="btn btn-primary w-100">Guardar Vehículo</button>
                                    <button type="button" class="btn btn-secondary w-100 mt-2" v-if="vehiculoForm.id" @click="resetVehiculoForm">Cancelar Edición</button>
                                </form>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Lista / Buscador -->
                    <div class="col-md-8">
                        <div class="card shadow-sm">
                            <div class="card-header d-flex justify-content-between align-items-center">
                                <h5 class="mb-0">Lista de Vehículos</h5>
                                <input type="text" v-model="searchVehiculo" class="form-control form-control-sm w-50" placeholder="Buscar por Placa o Marca..." @input="fetchVehiculos">
                            </div>
                            <div class="card-body p-0">
                                <div class="table-responsive">
                                    <table class="table table-striped table-hover mb-0">
                                        <thead>
                                            <tr>
                                                <th>Placa</th>
                                                <th>Marca</th>
                                                <th>Modelo</th>
                                                <th>Año</th>
                                                <th>Conductor</th>
                                                <th>Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="v in vehiculos" :key="v.id">
                                                <td><strong>@{{ v.placa }}</strong></td>
                                                <td>@{{ v.marca }}</td>
                                                <td>@{{ v.modelo }}</td>
                                                <td>@{{ v.anio }}</td>
                                                <td>@{{ v.conductor ? v.conductor.nombres + ' ' + v.conductor.apellidos : 'N/A' }}</td>
                                                <td>
                                                    <button class="btn btn-sm btn-warning me-1" @click="editVehiculo(v)">Editar</button>
                                                    <button class="btn btn-sm btn-danger" @click="deleteVehiculo(v.id)">Eliminar</button>
                                                </td>
                                            </tr>
                                            <tr v-if="vehiculos.length === 0">
                                                <td colspan="6" class="text-center">No se encontraron vehículos.</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Bootstrap JS Bundle -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>

<script>
    const { createApp, ref, onMounted } = Vue;

    createApp({
        setup() {
            // Estado para Conductores
            const conductores = ref([]);
            const allConductores = ref([]); // Para el select de vehículos
            const searchConductor = ref('');
            const conductorForm = ref({ id: null, dui: '', nombres: '', apellidos: '', licencia_tipo: '', telefono: '' });

            // Estado para Vehículos
            const vehiculos = ref([]);
            const searchVehiculo = ref('');
            const vehiculoForm = ref({ id: null, placa: '', marca: '', modelo: '', anio: '', conductor_id: '' });

            const currentTab = ref('conductores');

            // --- MÉTODOS DE CONDUCTORES ---
            const fetchConductores = async () => {
                try {
                    const response = await axios.get(`/api/conductores?search=${searchConductor.value}`);
                    conductores.value = response.data;
                    if(searchConductor.value === '') {
                        allConductores.value = response.data; // Actualizar lista completa para el select
                    }
                } catch (error) {
                    console.error(error);
                }
            };

            const saveConductor = async () => {
                try {
                    if (conductorForm.value.id) {
                        await axios.put(`/api/conductores/${conductorForm.value.id}`, conductorForm.value);
                        Swal.fire('¡Actualizado!', 'Conductor actualizado correctamente.', 'success');
                    } else {
                        await axios.post('/api/conductores', conductorForm.value);
                        Swal.fire('¡Guardado!', 'Conductor registrado correctamente.', 'success');
                    }
                    resetConductorForm();
                    fetchConductores();
                } catch (error) {
                    let msg = 'Ocurrió un error al guardar.';
                    if (error.response && error.response.data && error.response.data.message) {
                        msg = error.response.data.message;
                    }
                    Swal.fire('Error', msg, 'error');
                }
            };

            const editConductor = (c) => {
                conductorForm.value = { ...c };
            };

            const deleteConductor = async (id) => {
                const result = await Swal.fire({
                    title: '¿Estás seguro?',
                    text: "Esta acción eliminará al conductor y todos sus vehículos asociados.",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#d33',
                    cancelButtonColor: '#3085d6',
                    confirmButtonText: 'Sí, eliminar'
                });

                if (result.isConfirmed) {
                    try {
                        await axios.delete(`/api/conductores/${id}`);
                        Swal.fire('Eliminado!', 'El conductor ha sido eliminado.', 'success');
                        fetchConductores();
                        fetchVehiculos(); // Refrescar vehículos por si se borraron
                    } catch (error) {
                        Swal.fire('Error', 'No se pudo eliminar.', 'error');
                    }
                }
            };

            const resetConductorForm = () => {
                conductorForm.value = { id: null, dui: '', nombres: '', apellidos: '', licencia_tipo: '', telefono: '' };
            };

            // --- MÉTODOS DE VEHÍCULOS ---
            const fetchVehiculos = async () => {
                try {
                    const response = await axios.get(`/api/vehiculos?search=${searchVehiculo.value}`);
                    vehiculos.value = response.data;
                } catch (error) {
                    console.error(error);
                }
            };

            const saveVehiculo = async () => {
                try {
                    if (vehiculoForm.value.id) {
                        await axios.put(`/api/vehiculos/${vehiculoForm.value.id}`, vehiculoForm.value);
                        Swal.fire('¡Actualizado!', 'Vehículo actualizado correctamente.', 'success');
                    } else {
                        await axios.post('/api/vehiculos', vehiculoForm.value);
                        Swal.fire('¡Guardado!', 'Vehículo registrado correctamente.', 'success');
                    }
                    resetVehiculoForm();
                    fetchVehiculos();
                } catch (error) {
                    let msg = 'Ocurrió un error al guardar.';
                    if (error.response && error.response.data && error.response.data.message) {
                        msg = error.response.data.message;
                    }
                    Swal.fire('Error', msg, 'error');
                }
            };

            const editVehiculo = (v) => {
                vehiculoForm.value = { ...v };
            };

            const deleteVehiculo = async (id) => {
                const result = await Swal.fire({
                    title: '¿Estás seguro?',
                    text: "Esta acción no se puede deshacer.",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#d33',
                    cancelButtonColor: '#3085d6',
                    confirmButtonText: 'Sí, eliminar'
                });

                if (result.isConfirmed) {
                    try {
                        await axios.delete(`/api/vehiculos/${id}`);
                        Swal.fire('Eliminado!', 'El vehículo ha sido eliminado.', 'success');
                        fetchVehiculos();
                    } catch (error) {
                        Swal.fire('Error', 'No se pudo eliminar.', 'error');
                    }
                }
            };

            const resetVehiculoForm = () => {
                vehiculoForm.value = { id: null, placa: '', marca: '', modelo: '', anio: '', conductor_id: '' };
            };

            // Init
            onMounted(() => {
                fetchConductores();
                fetchVehiculos();
            });

            return {
                currentTab,
                // Conductores
                conductores, allConductores, searchConductor, conductorForm,
                fetchConductores, saveConductor, editConductor, deleteConductor, resetConductorForm,
                // Vehiculos
                vehiculos, searchVehiculo, vehiculoForm,
                fetchVehiculos, saveVehiculo, editVehiculo, deleteVehiculo, resetVehiculoForm
            };
        }
    }).mount('#app');
</script>
</body>
</html>
