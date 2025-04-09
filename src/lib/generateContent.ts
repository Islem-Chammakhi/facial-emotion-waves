import { GoogleGenerativeAI } from "@google/generative-ai";
// import { GoogleGenAI } from "@google/genai"

export default async function generateCalmingContent(emotion: string,intensity:string): Promise<string> {
    // 1. Vérification obligatoire de la clé API
    const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
    if (!API_KEY) {
        console.error("Erreur : La clé API Gemini n'est pas configurée");
        return "Service temporairement indisponible. Veuillez réessayer plus tard.";
    }

    // 2. Initialisation de l'API
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Version optimisée

    // 3. VOTRE PROMPT ORIGINAL (inchangé)
    const systemContext = `Agis comme un expert en psychologie positive combiné à un coach de pleine conscience. 
    Je détecte une émotion dominante de type "${emotion}" avec une intensité de ${intensity}/10.
    
    Génère une réponse qui :
    1. Valide l'émotion sans jugement ("C'est normal de ressentir...")
    2. Offre un soutien basé sur des preuves scientifiques (CBT, ACT, TCC)
    3. Propose une micro-action concrète (30s à 2min)
    4. Utilise une métaphore poétique adaptée
    5. Termine par une affirmation positive personnalisée
    
    Format de réponse EXCLUSIF :
    {
      "validation": "Phrase de validation émotionnelle",
      "support": "2 lignes max de conseil expert",
      "action": "Action ultra-concrète avec timing précis",
      "metaphore": "Métaphore imagée courte",
      "affirmation": "Affirmation positive au présent"
    }
    
    Exemple pour "triste" :
    {
      "validation": "La tristesse est une vague naturelle qui nettoie l'âme",
      "support": "Des études en neurosciences montrent que 90s de respiration consciente peuvent recalibrer le système limbique",
      "action": "Inspire doucement en comptant jusqu'à 4, retiens 2s, expire sur 6s (à répéter 3x)",
      "metaphore": "Comme un saule pleureur qui plie mais ne rompt pas sous le vent",
      "affirmation": "Je suis digne d'amour même dans mes moments fragiles"
    }
    `;

    try {
        // 4. Appel API avec timeout implicite
        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: systemContext }] }],
            generationConfig: {
                temperature: 0.9, // Plus créatif
                topP: 0.95
            }
        });

        // 5. Vérification de la réponse
        if (!result?.response?.text) {
            throw new Error("Réponse vide de l'API");
        }

        return result.response.text();

    } catch (error) {
        console.error("Erreur Gemini API:", error);
        
        // 6. Messages de repli contextuels
        if (error.message.includes("safety")) {
            return "Je détecte une requête sensible. Pour votre sécurité, je vous recommande de contacter un professionnel. Vous pouvez appeler le 3114 en France (SOS Suicide).";
        }
        
        return `Je rencontre des difficultés techniques. Voici un exercice apaisant : 
        Inspirez profondément (4s), retenez (4s), expirez lentement (6s). Répétez 3 fois.`;
    }
}