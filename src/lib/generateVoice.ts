import { ElevenLabsClient, play } from "elevenlabs";



export const generateVoice = async (text: string): Promise<string> => {
    const elevenlabs = new ElevenLabsClient({
        apiKey: import.meta.env.VITE_ELEVEN_LAB_API_KEY,
    });
    const VOICE_THERAPY_PROFILE = {
        voice: "Sarah", // Voix officiellement disponible
        model_id: "eleven_multilingual_v2",
        stability: 0.65,
        similarity_boost: 0.75,
        style: 0.35,
        use_speaker_boost: false // Désactivé pour les voix standard
      };
    try {
        const audio = await elevenlabs.generate({
            text: text,
            ...VOICE_THERAPY_PROFILE

        });
        const audioChunks: Uint8Array[] = [];
        for await (const chunk of audio) {
            audioChunks.push(chunk);
        }
        const audioBlob = new Blob(audioChunks, { type: 'audio/mpeg' });
        const url = URL.createObjectURL(audioBlob);
        return url;
    }
    catch (error) {
        console.error("Erreur de génération vocale:", error);
        return "Erreur de génération vocale";
    }


    
}