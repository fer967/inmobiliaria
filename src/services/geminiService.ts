import { GoogleGenAI } from "@google/genai";
import { type Property } from "../types";

// Helper to get chat response using Gemini 3 Flash
export const getChatResponse = async (
  history: { role: 'user' | 'model', text: string }[],
  properties: Property[]
): Promise<string> => {
  try {
    // Always use process.env.API_KEY directly as per guidelines
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
    
    const propertyContext = properties.map(p => 
      `- ${p.title}: ${p.type} en ${p.transaction} por USD ${p.price}. Ubicación: ${p.address}. IDECOR: ${p.idecor.nomenclatura}. Sup: ${p.idecor.superficieM2}m2.`
    ).join('\n');

    const systemInstruction = `Eres "ConnectBot", el asistente experto de Inmobiliaria Connect en Córdoba.
    
    CATÁLOGO DISPONIBLE:
    ${propertyContext}
    
    INSTRUCCIONES:
    1. Si Ana pregunta por Rafael Nuñez 3500, confirma disponibilidad de los 850m2 validados por IDECOR.
    2. Responde siempre de forma profesional, cordial y breve (máximo 50 palabras).
    3. Usa datos técnicos reales cuando sea posible.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: history.map(m => ({ role: m.role, parts: [{ text: m.text }] })),
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      },
    });

    return response.text || "La propiedad está disponible. ¿Te gustaría coordinar una visita?";
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return "Lo siento Ana, tuve un error de conexión. ¿Podrías repetir tu consulta sobre la propiedad del Cerro?";
  }
};

// Helper for property valuation using Gemini 3 Flash
export const getAIValuation = async (data: any): Promise<string> => {
  try {
    // Always use process.env.API_KEY directly as per guidelines
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
    const prompt = `Actúa como tasador experto en Córdoba, Argentina. 
    Tasa la siguiente propiedad:
    Dirección: ${data.address}
    Barrio: ${data.neighborhood}
    Superficie: ${data.m2} m2
    Ambientes: ${data.rooms}
    Estado: ${data.condition}
    
    Responde con un informe técnico breve que incluya un rango de precio estimado y una justificación basada en la zona.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        temperature: 0.2,
      }
    });
    
    return response.text || "Tasación calculada según mercado actual.";
  } catch (error) {
    console.error("Gemini Valuation Error:", error);
    return "Servicio de tasación en mantenimiento.";
  }
};

// Helper to compose valuation emails using Gemini 3 Flash
export const composeValuationEmail = async (clientName: string, valuationResult: string): Promise<string> => {
  try {
    // Always use process.env.API_KEY directly as per guidelines
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
    const prompt = `Redacta un correo electrónico profesional y elegante para un cliente llamado ${clientName} que acaba de solicitar una tasación online en Inmobiliaria Connect (Córdoba).
    
    Resultado de la tasación:
    ${valuationResult}
    
    El correo debe ser:
    1. Cordial y profesional.
    2. Incluir el resultado de la tasación.
    3. Invitar a una reunión presencial para una tasación física definitiva.
    4. Mencionar que somos expertos en datos de IDECOR.
    
    No incluyas el asunto, solo el cuerpo del mensaje.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ parts: [{ text: prompt }] }],
    });

    return response.text || "Estimado cliente, adjuntamos su informe.";
  } catch (e) {
    return "Estimado cliente, aquí tiene su tasación.";
  }
};

// Fix: Added missing getPropertyAdvice export for PropertyDetails component
export const getPropertyAdvice = async (title: string, price: number, transaction: string): Promise<string> => {
  try {
    // Always use process.env.API_KEY directly as per guidelines
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
    const prompt = `Actúa como asesor inmobiliario experto en Córdoba, Argentina. 
    Brinda un consejo breve y atractivo (máximo 30 palabras) para un cliente interesado en:
    Propiedad: ${title}
    Precio: ${transaction === 'Venta' ? 'USD' : '$'} ${price.toLocaleString()}
    Operación: ${transaction}
    
    Destaca el potencial de inversión o la ubicación estratégica en Córdoba.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        temperature: 0.7,
      },
    });

    return response.text || "Excelente oportunidad de inversión con alta rentabilidad en zona consolidada de Córdoba.";
  } catch (error) {
    console.error("Gemini Advice Error:", error);
    return "Una propiedad con gran proyección de revalorización en el mercado local cordobés.";
  }
};




















