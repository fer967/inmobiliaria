from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import httpx
import csv
import os
from datetime import datetime
from typing import Optional, List

app = FastAPI(title="Connect Inmobiliaria CRM API")

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
    notes: Optional[str] = ""

# Inicializar CRM con soporte para estados inmobiliarios
if not os.path.exists(CRM_FILE):
    with open(CRM_FILE, mode='w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow(['timestamp', 'name', 'email', 'phone', 'property_id', 'message', 'status', 'notes'])

@app.get("/api/leads")
async def get_leads():
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
                lead.name, lead.email, lead.phone, lead.propertyId, lead.message, lead.status, lead.notes
            ])
        return {"status": "success"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.patch("/api/leads/{email}")
async def update_lead_status(email: str, status: str, notes: Optional[str] = None):
    updated_rows = []
    found = False
    if os.path.exists(CRM_FILE):
        with open(CRM_FILE, mode='r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                if row['email'] == email:
                    row['status'] = status
                    if notes: row['notes'] = notes
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















