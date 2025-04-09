
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";

interface EmotionBarProps {
  emotion: string;
  percentage: number;
  color: string;
  emoji: string;
}

interface EmotionsDisplayProps {
  expressions: {
    neutral: number;
    happy: number;
    sad: number;
    angry: number;
    fearful: number;
    disgusted: number;
    surprised: number;
  };
}

// Composant pour une barre d'émotion individuelle
const EmotionBar: React.FC<EmotionBarProps> = ({ emotion, percentage, color, emoji }) => {
  const formattedPercentage = Math.round(percentage * 100);
  
  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1">
        <div className="flex items-center">
          <span className="emoji-indicator">{emoji}</span>
          <span className="font-medium text-sm">{emotion}</span>
        </div>
        <span className="text-sm font-semibold">{formattedPercentage}%</span>
      </div>
      <div className="emotion-bar">
        <div 
          className="emotion-bar-fill"
          style={{ 
            '--target-width': `${formattedPercentage}%`,
            backgroundColor: color
          } as React.CSSProperties}
        />
      </div>
    </div>
  );
};

// Composant principal pour afficher toutes les émotions
const EmotionsDisplay: React.FC<EmotionsDisplayProps> = ({ expressions }) => {
  // Configuration des émotions avec leurs couleurs et emojis
  const emotions = [
    { key: 'neutral', label: 'Neutre', color: '#64748b', emoji: '😐' },
    { key: 'happy', label: 'Heureux', color: '#10b981', emoji: '😊' },
    { key: 'sad', label: 'Triste', color: '#60a5fa', emoji: '😢' },
    { key: 'angry', label: 'En colère', color: '#ef4444', emoji: '😠' },
    { key: 'fearful', label: 'Craintif', color: '#8b5cf6', emoji: '😨' },
    { key: 'disgusted', label: 'Dégoûté', color: '#84cc16', emoji: '🤢' },
    { key: 'surprised', label: 'Surpris', color: '#f59e0b', emoji: '😲' },
  ];

  // Trier les émotions par intensité, avec la plus forte en premier
  const sortedEmotions = [...emotions].sort(
    (a, b) => expressions[b.key as keyof typeof expressions] - expressions[a.key as keyof typeof expressions]
  );

  // Trouver l'émotion dominante
  const dominantEmotion = sortedEmotions[0];
  const dominantValue = expressions[dominantEmotion.key as keyof typeof expressions];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <span className="text-2xl mr-2">{dominantEmotion.emoji}</span>
          Analyse des Expressions
        </CardTitle>
        <CardDescription>
          Émotion dominante: {dominantEmotion.label} ({Math.round(dominantValue * 100)}%)
        </CardDescription>
      </CardHeader>
      <CardContent>
        {sortedEmotions.map((emotion) => (
          <EmotionBar
            key={emotion.key}
            emotion={emotion.label}
            percentage={expressions[emotion.key as keyof typeof expressions]}
            color={emotion.color}
            emoji={emotion.emoji}
          />
        ))}
      </CardContent>
    </Card>
  );
};

export default EmotionsDisplay;
