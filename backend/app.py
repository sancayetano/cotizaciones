from flask import Flask, jsonify
from flask_cors import CORS
import requests
from bs4 import BeautifulSoup
import schedule
import time
import threading
from datetime import datetime
import os
import re

app = Flask(__name__)
CORS(app)  # Permite que GitHub Pages acceda

# Cache inicial
cache = {
    "USD": {
        "compra": "0",
        "venta": "0",
        "nombre": "Dólar Americano",
        "bandera": "🇺🇸",
        "actualizado": None
    },
    "BRL": {
        "compra": "0",
        "venta": "0",
        "nombre": "Real Brasileño",
        "bandera": "🇧🇷",
        "actualizado": None
    }
}

def extraer_valores_nortecambios():
    """Extrae valores reales de Nortecambios"""
    print(f"[{datetime.now().strftime('%H:%M:%S')}] Scrapeando Nortecambios...")
    
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        }
        
        response = requests.get('https://www.nortecambios.com.py/', headers=headers, timeout=10)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Buscar USD
        usd_link = soup.find('a', href='/currency/USD')
        if usd_link:
            fila_usd = usd_link.find_parent('tr')
            valor_usd = fila_usd.find('p', class_=lambda x: x and ('text-xl' in x or 'text-2xl' in x))
            if valor_usd:
                valor = valor_usd.text.strip().replace('"', '').replace('.', '')
                # Para USD, asumimos compra y venta similares
                cache["USD"]["compra"] = str(float(valor) - 10)
                cache["USD"]["venta"] = valor
                cache["USD"]["actualizado"] = datetime.now().strftime('%H:%M:%S')
                print(f"  ✅ USD: {valor}")
        
        # Buscar BRL
        brl_link = soup.find('a', href='/currency/BRL')
        if brl_link:
            fila_brl = brl_link.find_parent('tr')
            valor_brl = fila_brl.find('p', class_=lambda x: x and ('text-xl' in x or 'text-2xl' in x))
            if valor_brl:
                valor = valor_brl.text.strip().replace('"', '').replace('.', '')
                cache["BRL"]["compra"] = str(float(valor) - 5)
                cache["BRL"]["venta"] = valor
                cache["BRL"]["actualizado"] = datetime.now().strftime('%H:%M:%S')
                print(f"  ✅ BRL: {valor}")
        
        # Calcular BRL-USD (paralelo) - aproximadamente 5% más
        if cache["USD"]["venta"] != "0" and cache["BRL"]["venta"] != "0":
            usd_val = float(cache["USD"]["venta"])
            brl_val = float(cache["BRL"]["venta"])
            # Cálculo aproximado del paralelo
            paralelo = (usd_val / brl_val) * 1.05  # +5%
            cache["BRL-USD"] = {
                "compra": f"{paralelo:.2f}".replace('.', ','),
                "venta": f"{paralelo * 1.01:.2f}".replace('.', ','),
                "nombre": "Real Paralelo",
                "bandera": "🇧🇷🇺🇸",
                "actualizado": datetime.now().strftime('%H:%M:%S')
            }
            print(f"  ✅ BRL-USD: {paralelo:.2f}")
        
        return True
        
    except Exception as e:
        print(f"  ❌ Error: {e}")
        return False

@app.route('/')
def home():
    return jsonify({
        "api": "San Cayetano API",
        "version": "1.0",
        "endpoint": "/api/cambios",
        "status": "active"
    })

@app.route('/api/cambios')
def get_cambios():
    """Devuelve todas las monedas"""
    return jsonify(cache)

@app.route('/api/health')
def health():
    return jsonify({"status": "healthy", "timestamp": datetime.now().isoformat()})

def actualizar_automatico():
    """Actualiza valores cada 5 minutos"""
    schedule.every(5).minutes.do(extraer_valores_nortecambios)
    
    while True:
        schedule.run_pending()
        time.sleep(1)

if __name__ == '__main__':
    print("🚀 Iniciando API San Cayetano...")
    
    # Primera extracción
    extraer_valores_nortecambios()
    
    # Iniciar actualizador automático en segundo plano
    scheduler_thread = threading.Thread(target=actualizar_automatico, daemon=True)
    scheduler_thread.start()
    
    port = int(os.environ.get('PORT', 5000))
    print(f"✅ API lista en puerto {port}")
    print(f"📊 Endpoint: http://localhost:{port}/api/cambios")
    
    app.run(host='0.0.0.0', port=port, debug=False)