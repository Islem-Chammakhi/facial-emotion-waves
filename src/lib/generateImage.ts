import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleGenAI } from "@google/genai"

export default async function generateImage(contents: string): Promise<{ text?: string; imageUrl?: string }> {
    // 1. Vérification obligatoire de la clé API
    const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
    if (!API_KEY) {
        console.error("Erreur : La clé API Gemini n'est pas configurée");
        return { text: "Service indisponible" };
    }

    // 2. Initialisation de l'API
    const genAI = new GoogleGenAI({apiKey:API_KEY});
    // const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp-image-generation" }); // Version optimisée
    const imagePrompt = `Create an image based on the following description: ${contents}`;


    try {
        // 4. Appel API avec timeout implicite
        const result = await genAI.models.generateContent({
            model: "gemini-2.0-flash-exp-image-generation",
            contents: imagePrompt,
            config: {
              responseModalities: ["Text", "Image"],
            },
          });

        // 5. Vérification de la réponse
        let responseText = "";
        let imageUrl = "";

        for (const part of result.candidates[0].content.parts) {
            if (part.text) {
                responseText = part.text;
            } 
            else if (part.inlineData) {
                // Créer une URL de données pour l'image
                imageUrl = `data:image/png;base64,${part.inlineData.data}`;
            }
        }

        return {
            text: responseText,
            imageUrl: imageUrl || "Aucune image générée"
        };

    } catch (error) {
        console.error("Erreur API:", error);
        return {
            text: error.message.includes("safety") 
                ? "Contenu sensible détecté" 
                : "Erreur de génération"
        };
    }
}


