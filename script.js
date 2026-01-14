// ============================================
// DATOS DE PRUEBA PARA SAN CAYETANO
// ============================================

// Datos de ejemplo con COMPRA y VENTA
const datosEjemplo = {
    "USD": {
        "compra": "6.820",
        "venta": "6.850",
        "tendencia": "subiendo",
        "nombre": "Dólar Americano",
        "bandera": "🇺🇸",
        "actualizado": new Date().toLocaleTimeString('es-PY')
    },
    "BRL": {
        "compra": "1.310",
        "venta": "1.320",
        "tendencia": "bajando", 
        "nombre": "Real Brasileño",
        "bandera": "🇧🇷",
        "actualizado": new Date().toLocaleTimeString('es-PY')
    },
    "BRL•USD": {
        "compra": "5,18",
        "venta": "5,22",
        "tendencia": "estable",
        "nombre": "Real Paralelo",
        "bandera": "🇧🇷🇺🇸",
        "actualizado": new Date().toLocaleTimeString('es-PY')
    }
};

// Elementos del DOM
const monedasContainer = document.getElementById('monedas-container');
const errorMensaje = document.getElementById('error-mensaje');
const refreshBtn = document.getElementById('refresh-btn');
const actualizacionTexto = document.getElementById('actualizacion-texto');

// Función para crear una fila de moneda
function crearFilaMoneda(codigo, datos) {
    return `
        <div class="moneda-card ${datos.tendencia}">
            <div class="moneda-info">
                <div class="bandera">${datos.bandera}</div>
                <div class="moneda-texto">
                    <h3>${datos.nombre}</h3>
                    <div class="codigo">${codigo}</div>
                </div>
            </div>
            <div class="valor-compra">${datos.compra}</div>
            <div class="valor-venta">${datos.venta}</div>
            <div class="tendencia-container">
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
    
    // Orden específico: USD, BRL, BRL•USD
    const orden = ['USD', 'BRL', 'BRL•USD'];
    
    for (const codigo of orden) {
        if (datos[codigo]) {
            html += crearFilaMoneda(codigo, datos[codigo]);
        }
    }
    
    monedasContainer.innerHTML = html;
    actualizacionTexto.textContent = `Última actualización: ${new Date().toLocaleTimeString('es-PY')}`;
    errorMensaje.style.display = 'none';
}

// Función para simular variación de precios
function variarPrecio(precioStr) {
    const precio = parseFloat(precioStr.replace('.', '').replace(',', '.'));
    const variacion = (Math.random() - 0.5) * 10; // ±5
    const nuevoPrecio = Math.max(0, precio + variacion);
    
    if (precioStr.includes(',')) {
        return nuevoPrecio.toFixed(2).replace('.', ',');
    }
    return nuevoPrecio.toFixed(0);
}

// Función para cargar datos
function cargarDatosPrueba() {
    // Mostrar estado de carga
    refreshBtn.innerHTML = '<span class="material-icons">autorenew</span> Cargando...';
    refreshBtn.disabled = true;
    
    // Simular delay de red (1 segundo)
    setTimeout(() => {
        const datosActualizados = JSON.parse(JSON.stringify(datosEjemplo));
        
        // Variar precios ligeramente (simulación realista)
        for (const moneda in datosActualizados) {
            datosActualizados[moneda].compra = variarPrecio(datosActualizados[moneda].compra);
            datosActualizados[moneda].venta = variarPrecio(datosActualizados[moneda].venta);
            
            // Determinar tendencia basada en cambio
            const cambio = Math.random();
            if (cambio > 0.6) datosActualizados[moneda].tendencia = 'subiendo';
            else if (cambio < 0.4) datosActualizados[moneda].tendencia = 'bajando';
            else datosActualizados[moneda].tendencia = 'estable';
            
            datosActualizados[moneda].actualizado = new Date().toLocaleTimeString('es-PY');
        }
        
        mostrarMonedas(datosActualizados);
        
        // Restaurar botón
        refreshBtn.innerHTML = '<span class="material-icons">refresh</span> Actualizar';
        refreshBtn.disabled = false;
        
        console.log('✅ Datos actualizados - San Cayetano');
    }, 1000);
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
    
    // Auto-actualizar cada 30 segundos
    setInterval(cargarDatosPrueba, 30000);
});

// Detectar visibilidad de la página
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        cargarDatosPrueba();
    }
});
