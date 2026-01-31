import { GoogleGenAI } from "@google/genai";

export const getPropertyAdvice = async (propertyTitle: string, price: number, transaction: string): Promise<string> => {
    try {
        // El SDK requiere el uso de process.env.API_KEY. 
        // Gracias al shim en index.html, esto no fallará aunque estemos en un navegador local.
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Proporciona un breve consejo de inversión (max 30 palabras) para una propiedad de ${transaction} llamada "${propertyTitle}" con un precio de ${price}. Menciona algo relevante sobre el mercado inmobiliario de Córdoba, Argentina.`
        });

        return response.text ?? "No hay consejos disponibles en este momento.";
    } catch (error) {
        console.error("Error al obtener consejo de AI:", error);
        return "Consulte con nuestros agentes para un asesoramiento personalizado.";
    }
};


// import { GoogleGenAI } from "@google/genai";

// // Initialize GoogleGenAI using the recommended named parameter and direct process.env.API_KEY access
// const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// export const getPropertyAdvice = async (propertyTitle: string, price: number, transaction: string): Promise<string> => {
//     try {
//         const response = await ai.models.generateContent({
//             model: 'gemini-3-flash-preview',
//             contents: `Proporciona un breve consejo de inversión (max 30 palabras) para una propiedad de ${transaction} llamada "${propertyTitle}" con un precio de ${price}. Menciona algo relevante sobre el mercado inmobiliario de Córdoba, Argentina.`
//         });
//         // response.text puede ser undefined según la definición del tipo en el SDK
//         return response.text ?? "No hay consejos disponibles en este momento.";
//     } catch (error) {
//         console.error("Gemini Error:", error);
//         return "Consulte con nuestros agentes para un asesoramiento personalizado.";
//     }
// };



