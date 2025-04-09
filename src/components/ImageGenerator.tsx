import { useState } from 'react';
import generateImage from '../lib/generateImage';

export default function ImageGenerator() {
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleGenerate = async () => {
        setLoading(true);
        try {
            const result = await generateImage("generate image tha avoid stress anxiaty and depression, and make you happy, and make you feel good, and make you feel better, and make you feel relaxed, and make you feel calm, and make you feel peaceful, with ghbli studio if possible ");
            if (result.imageUrl) {
                setImageUrl(result.imageUrl);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <button onClick={handleGenerate} disabled={loading}>
                {loading ? 'Génération...' : 'Générer une image'}
            </button>
            
            {imageUrl && (
                <div style={{ marginTop: 20 }}>
                    <img 
                        src={imageUrl} 
                        alt="Générée par AI" 
                        style={{ 
                            maxWidth: '100%', 
                            borderRadius: 8, 
                            boxShadow: '0 4px 8px rgba(0,0,0,0.1)' 
                        }}
                    />
                </div>
            )}
        </div>
    );
}