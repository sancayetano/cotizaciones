// ============================================
// FRONTEND CON DATOS DE PRUEBA
// ============================================

// Datos de ejemplo (simulan la API)
const datosEjemplo = {
    "USD": {
        "valor": "6.850,00",
        "tendencia": "subiendo",
        "nombre": "Dólar Americano",
        "bandera": "🇺🇸",
        "actualizado": new Date().toLocaleTimeString('es-PY')
    },
    "BRL": {
        "valor": "1.320,50",
        "tendencia": "bajando", 
        "nombre": "Real Brasileño",
        "bandera": "🇧🇷",
        "actualizado": new Date().toLocaleTimeString('es-PY')
    },
    "EUR": {
        "valor": "7.420,75",
        "tendencia": "subiendo",
        "nombre": "Euro",
        "bandera": "🇪🇺",
        "actualizado": new Date().toLocaleTimeString('es-PY')
    },
    "ARS": {
        "valor": "7,85",
        "tendencia": "estable",
        "nombre": "Peso Argentino",
        "bandera": "🇦🇷",
        "actualizado": new Date().toLocaleTimeString('es-PY')
    }
};

// Elementos del DOM
const monedasContainer = document.getElementById('monedas-container');
const errorMensaje = document.getElementById('error-mensaje');
const refreshBtn = document.getElementById('refresh-btn');
const actualizacionTexto = document.getElementById('actualizacion-texto');

// Función para crear una tarjeta de moneda
function crearTarjetaMoneda(codigo, datos) {
    return `
        <div class="moneda-card ${datos.tendencia}">
            <div class="moneda-info">
                <div class="bandera">${datos.bandera}</div>
                <div class="moneda-texto">
                    <h3>${datos.nombre}</h3>
                    <div class="codigo">${codigo}</div>
                </div>
            </div>
            <div class="moneda-valor">
                <div class="valor">${datos.valor}</div>
                <div class="tendencia ${datos.tendencia}">
                    <span class="material-icons">
                        ${datos.tendencia === 'subiendo' ? 'arrow_upward' : 
                          datos.tendencia === 'bajando' ? 'arrow_downward' : 'remove'}
                    </span>
                    ${datos.tendencia === 'subiendo' ? 'Subiendo' : 
                      datos.tendencia === 'bajando' ? 'Bajando' : 'Estable'}
                </div>
            </div>
        </div>
    `;
}

// Función para mostrar monedas
function mostrarMonedas(datos) {
    let html = '';
    
    for (const [codigo, info] of Object.entries(datos)) {
        html += crearTarjetaMoneda(codigo, info);
    }
    
    monedasContainer.innerHTML = html;
    actualizacionTexto.textContent = `Última actualización: ${new Date().toLocaleTimeString('es-PY')}`;
    errorMensaje.style.display = 'none';
}

// Función para simular carga con datos de prueba
function cargarDatosPrueba() {
    // Mostrar estado de carga
    refreshBtn.innerHTML = '<span class="material-icons">autorenew</span> Cargando...';
    refreshBtn.disabled = true;
    
    // Simular delay de red (1.5 segundos)
    setTimeout(() => {
        // Aquí normalmente harías fetch a una API real
        // Por ahora usamos datos de ejemplo
        
        // Simular variación aleatoria en los valores
        const datosActualizados = JSON.parse(JSON.stringify(datosEjemplo));
        
        // Actualizar timestamp
        for (const moneda in datosActualizados) {
            datosActualizados[moneda].actualizado = new Date().toLocaleTimeString('es-PY');
        }
        
        mostrarMonedas(datosActualizados);
        
        // Restaurar botón
        refreshBtn.innerHTML = '<span class="material-icons">refresh</span> Actualizar';
        refreshBtn.disabled = false;
        
        console.log('Datos actualizados (modo prueba)');
    }, 1500);
}

// Función para mostrar error
function mostrarError(mensaje) {
    errorMensaje.textContent = `⚠️ ${mensaje}`;
    errorMensaje.style.display = 'flex';
    
    // Mostrar datos de ejemplo si hay error
    mostrarMonedas(datosEjemplo);
}

// Event Listeners
refreshBtn.addEventListener('click', cargarDatosPrueba);

// Cargar datos iniciales
document.addEventListener('DOMContentLoaded', () => {
    cargarDatosPrueba();
    
    // Auto-actualizar cada 60 segundos
    setInterval(cargarDatosPrueba, 60000);
});

// Detectar visibilidad de la página
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        cargarDatosPrueba();
    }
});
