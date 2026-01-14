// ============================================
// DATOS DE PRUEBA PARA SAN CAYETANO
// ============================================

// Datos de ejemplo con COMPRA y VENTA
const datosEjemplo = {
    "USD": {
        "compra": "6.820",
        "venta": "6.850",
        "nombre": "Dólar Americano",
        "bandera": "🇺🇸"
    },
    "BRL": {
        "compra": "1.310",
        "venta": "1.320",
        "nombre": "Real Brasileño",
        "bandera": "🇧🇷"
    },
    "BRL-USD": {
        "compra": "5,18",
        "venta": "5,22",
        "nombre": "Real Paralelo",
        "bandera": "🇧🇷🇺🇸"
    }
};

// Elementos del DOM
const monedasContainer = document.getElementById('monedas-container');
const refreshBtn = document.getElementById('refresh-btn');
const actualizacionTexto = document.getElementById('actualizacion-texto');

// Función para crear una fila de moneda
function crearFilaMoneda(codigo, datos) {
    return `
        <div class="moneda-card">
            <div class="moneda-info">
                <div class="bandera">${datos.bandera}</div>
                <div class="moneda-texto">
                    <h3>${datos.nombre}</h3>
                    <div class="codigo">${codigo}</div>
                </div>
            </div>
            <div class="valor-compra">${datos.compra}</div>
            <div class="valor-venta">${datos.venta}</div>
        </div>
    `;
}

// Función para mostrar monedas
function mostrarMonedas(datos) {
    let html = '';
    
    // Orden específico: USD, BRL, BRL-USD
    const orden = ['USD', 'BRL', 'BRL-USD'];
    
    for (const codigo of orden) {
        if (datos[codigo]) {
            html += crearFilaMoneda(codigo, datos[codigo]);
        }
    }
    
    monedasContainer.innerHTML = html;
    actualizacionTexto.textContent = `Última actualización: ${new Date().toLocaleTimeString('es-PY')}`;
}

// Función para variar precios ligeramente
function variarPrecio(precioStr) {
    const tieneComa = precioStr.includes(',');
    const tienePunto = precioStr.includes('.');
    
    // Convertir a número
    let precio;
    if (tieneComa) {
        precio = parseFloat(precioStr.replace('.', '').replace(',', '.'));
    } else if (tienePunto) {
        precio = parseFloat(precioStr.replace('.', ''));
    } else {
        precio = parseFloat(precioStr);
    }
    
    // Variación pequeña (±0.5% del valor)
    const variacion = precio * (Math.random() - 0.5) * 0.005;
    const nuevoPrecio = Math.max(1, precio + variacion);
    
    // Formatear de vuelta
    if (tieneComa) {
        return nuevoPrecio.toFixed(2).replace('.', ',');
    } else if (tienePunto && precioStr.includes('.')) {
        // Si tenía punto como separador de miles (ej: 6.820)
        return Math.round(nuevoPrecio).toLocaleString('es-PY');
    }
    
    return nuevoPrecio.toFixed(tieneComa ? 2 : 0);
}

// Función para cargar datos
function cargarDatos() {
    // Mostrar estado de carga
    refreshBtn.textContent = 'Cargando...';
    refreshBtn.disabled = true;
    
    // Simular delay de red
    setTimeout(() => {
        const datosActualizados = JSON.parse(JSON.stringify(datosEjemplo));
        
        // Variar precios ligeramente
        for (const moneda in datosActualizados) {
            datosActualizados[moneda].compra = variarPrecio(datosActualizados[moneda].compra);
            datosActualizados[moneda].venta = variarPrecio(datosActualizados[moneda].venta);
        }
        
        mostrarMonedas(datosActualizados);
        
        // Restaurar botón
        refreshBtn.textContent = 'Actualizar';
        refreshBtn.disabled = false;
        
        console.log('✅ Datos actualizados');
    }, 800);
}

// Event Listeners
refreshBtn.addEventListener('click', cargarDatos);

// Cargar datos iniciales
document.addEventListener('DOMContentLoaded', () => {
    cargarDatos();
    
    // Auto-actualizar cada 30 segundos
    setInterval(cargarDatos, 30000);
});
