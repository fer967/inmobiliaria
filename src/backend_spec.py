from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import httpx
import json
import csv
import os
from datetime import datetime
from typing import Optional, List

app = FastAPI(title="Connect Inmobiliaria API - Córdoba")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

IDECOR_WFS_URL = "https://mapas.cba.gov.ar/geoserver/wfs"
CRM_FILE = 'crm_leads.csv'

class Lead(BaseModel):
    name: str
    email: str
    phone: str
    message: str
    propertyId: str
    status: Optional[str] = "Nuevo"

# Inicializar CRM CSV si no existe
if not os.path.exists(CRM_FILE):
    with open(CRM_FILE, mode='w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow(['timestamp', 'name', 'email', 'phone', 'property_id', 'message', 'status'])

@app.get("/api/leads")
async def get_leads():
    """Retorna todos los leads registrados en el CRM local."""
    leads = []
    if os.path.exists(CRM_FILE):
        with open(CRM_FILE, mode='r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                leads.append(row)
    return sorted(leads, key=lambda x: x['timestamp'], reverse=True)

@app.post("/api/leads")
async def create_lead(lead: Lead):
    try:
        with open(CRM_FILE, mode='a', newline='', encoding='utf-8') as file:
            writer = csv.writer(file)
            writer.writerow([
                datetime.now().isoformat(),
                lead.name, lead.email, lead.phone, lead.propertyId, lead.message, "Nuevo"
            ])
        return {"status": "success"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.patch("/api/leads/{email}")
async def update_lead_status(email: str, status: str):
    """Actualiza el estado de un lead buscando por email (simplificado para el ejemplo)."""
    updated_rows = []
    found = False
    if os.path.exists(CRM_FILE):
        with open(CRM_FILE, mode='r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                if row['email'] == email:
                    row['status'] = status
                    found = True
                updated_rows.append(row)
        
        if found:
            with open(CRM_FILE, mode='w', newline='', encoding='utf-8') as f:
                writer = csv.DictWriter(f, fieldnames=updated_rows[0].keys())
                writer.writeheader()
                writer.writerows(updated_rows)
            return {"status": "updated"}
    
    raise HTTPException(status_code=404, detail="Lead no encontrado")

@app.get("/api/idecor/{nomenclatura}")
async def get_idecor_data(nomenclatura: str):
    params = {
        "service": "WFS",
        "version": "2.0.0",
        "request": "GetFeature",
        "typeName": "informacion_catastral:parcelas",
        "outputFormat": "application/json",
        "cql_filter": f"nomenclatura='{nomenclatura}'"
    }
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(IDECOR_WFS_URL, params=params, timeout=10.0)
            data = response.json()
            if data.get("features"):
                props = data["features"][0]["properties"]
                return {
                    "nomenclatura": props.get("nomenclatura"),
                    "valorFiscal": props.get("v_fiscal_total", 0),
                    "tipoSuelo": props.get("tipo_suelo", "Urbano"),
                    "superficieM2": props.get("superficie_grafica", 0),
                    "verificado": True
                }
        except:
            pass
        return {"nomenclatura": nomenclatura, "verificado": False}

@app.get("/api/stats")
async def get_stats():
    leads = await get_leads()
    return {
        "visitas_hoy": 1420,
        "leads_totales": len(leads),
        "leads_nuevos": len([l for l in leads if l.get('status') == 'Nuevo']),
        "api_status": "online"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)



# from fastapi import FastAPI, HTTPException, Query
# from fastapi.middleware.cors import CORSMiddleware
# from pydantic import BaseModel
# import httpx
# import json
# import csv
# import os
# from datetime import datetime
# from typing import Optional

# app = FastAPI(title="Connect Inmobiliaria API - Córdoba")

# # Configuración de CORS para que el frontend pueda conectar
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # Configuración IDECOR
# IDECOR_WFS_URL = "https://mapas.cba.gov.ar/geoserver/wfs"
# CRM_FILE = 'crm_leads.csv'

# class Lead(BaseModel):
#     name: str
#     email: str
#     phone: str
#     message: str
#     propertyId: str

# # Inicializar CRM CSV si no existe
# if not os.path.exists(CRM_FILE):
#     with open(CRM_FILE, mode='w', newline='') as f:
#         writer = csv.writer(f)
#         writer.writerow(['timestamp', 'name', 'email', 'phone', 'property_id', 'message'])

# @app.get("/api/idecor/{nomenclatura}")
# async def get_idecor_data(nomenclatura: str):
#     """
#     Consulta real al WFS de IDECOR (Información Catastral).
#     Busca parcelas por nomenclatura provincial.
#     """
#     params = {
#         "service": "WFS",
#         "version": "2.0.0",
#         "request": "GetFeature",
#         "typeName": "informacion_catastral:parcelas",
#         "outputFormat": "application/json",
#         "cql_filter": f"nomenclatura='{nomenclatura}'"
#     }
    
#     async with httpx.AsyncClient() as client:
#         try:
#             response = await client.get(IDECOR_WFS_URL, params=params, timeout=10.0)
#             response.raise_for_status()
#             data = response.json()
            
#             if not data.get("features"):
#                 raise HTTPException(status_code=404, detail="Nomenclatura no encontrada en el catastro provincial")
            
#             # Extraemos los atributos de la primera coincidencia
#             feature = data["features"][0]
#             props = feature["properties"]
            
#             # Mapeo de campos típicos de IDECOR a nuestro modelo
#             return {
#                 "nomenclatura": props.get("nomenclatura"),
#                 "valorFiscal": props.get("v_fiscal_total", 0),
#                 "tipoSuelo": props.get("tipo_suelo", "No especificado"),
#                 "superficieM2": props.get("superficie_grafica", 0),
#                 "departamento": props.get("nomb_depto"),
#                 "pedania": props.get("nomb_pedan"),
#                 "verificado": True,
#                 "fuente": "IDECOR - Provincia de Córdoba"
#             }
#         except httpx.HTTPStatusError as e:
#             raise HTTPException(status_code=502, detail="Error de comunicación con IDECOR")
#         except Exception as e:
#             # Fallback controlado para desarrollo si IDECOR no responde
#             print(f"Error IDECOR: {str(e)}")
#             return {
#                 "nomenclatura": nomenclatura,
#                 "valorFiscal": 12500000,
#                 "tipoSuelo": "Residencial (Fallback)",
#                 "superficieM2": 450,
#                 "verificado": False,
#                 "nota": "Datos simulados por error de conexión"
#             }

# @app.post("/api/leads")
# async def create_lead(lead: Lead):
#     try:
#         with open(CRM_FILE, mode='a', newline='', encoding='utf-8') as file:
#             writer = csv.writer(file)
#             writer.writerow([
#                 datetime.now().isoformat(),
#                 lead.name, lead.email, lead.phone, lead.propertyId, lead.message
#             ])
#         return {"status": "success", "message": "Lead registrado en CRM local"}
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Error al guardar lead: {str(e)}")

# @app.get("/api/stats")
# async def get_stats():
#     # Leer el CSV para generar estadísticas reales
#     leads_count = 0
#     if os.path.exists(CRM_FILE):
#         with open(CRM_FILE, mode='r') as f:
#             leads_count = sum(1 for line in f) - 1 # Menos el header
            
#     return {
#         "visitas_hoy": 1420, # Esto vendría de GA4/Redis en un sistema real
#         "leads_totales": leads_count,
#         "api_status": "online"
#     }

# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run(app, host="0.0.0.0", port=8000)



# from fastapi import FastAPI, HTTPException
# from pydantic import BaseModel
# from typing import List, Optional
# import requests
# import json
# import csv
# from datetime import datetime

# app = FastAPI(title="Connect Inmobiliaria API")

# # Modelo para los Leads (CRM)
# class Lead(BaseModel):
#     name: str
#     email: str
#     phone: str
#     message: str
#     propertyId: str

# # 1. PROXY IDECOR (Consulta de Catastro)
# @app.get("/api/idecor/{nomenclatura}")
# async def get_idecor_data(nomenclatura: string):
#     # Aquí consultarías el WFS oficial de Córdoba
#     # URL ejemplo: https://idecor-ws.lrh.com.ar/geoserver/wfs?...
#     try:
#         # Simulamos una respuesta del servidor oficial
#         return {
#             "nomenclatura": nomenclatura,
#             "valorFiscal": 15000000,
#             "tipoSuelo": "Urbano Residencial",
#             "superficieM2": 450,
#             "propietario_verificado": True
#         }
#     except Exception as e:
#         raise HTTPException(status_code=500, detail="Error conectando con IDECOR")

# # 2. CRM SIMPLIFICADO (Guardar en CSV por ahora)
# @app.post("/api/leads")
# async def create_lead(lead: Lead):
#     try:
#         with open('crm_leads.csv', mode='a', newline='') as file:
#             writer = csv.writer(file)
#             writer.writerow([
#                 datetime.now().isoformat(),
#                 lead.name, lead.email, lead.phone, lead.propertyId, lead.message
#             ])
#         return {"status": "success", "message": "Lead registrado en el CRM local"}
#     except Exception as e:
#         raise HTTPException(status_code=500, detail="Error al guardar el lead")

# # 3. ANALYTICS (Podría conectarse con BigQuery o una DB interna)
# @app.get("/api/stats")
# async def get_stats():
#     return {
#         "visitas_hoy": 1420,
#         "leads_nuevos": 24,
#         "conversion_rate": "1.8%"
#     }

# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run(app, host="0.0.0.0", port=8000)