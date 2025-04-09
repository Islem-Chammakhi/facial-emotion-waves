
import React, { useRef, useEffect, useState } from 'react';
import * as faceapi from 'face-api.js';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import EmotionsDisplay from './EmotionsDisplay';
import { generateVoice } from "@/lib/generateVoice";
import generateImage from "@/lib/generateContent";


interface Detection {
  expressions: {
    neutral: number;
    happy: number;
    sad: number;
    angry: number;
    fearful: number;
    disgusted: number;
    surprised: number;
  };
  landmarks?: faceapi.FaceLandmarks68;
}

const FaceDetection: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [showVideo, setShowVideo] = useState(true);
  const [detection, setDetection] = useState<Detection | null>(null);
  const [showLandmarksOnly, setShowLandmarksOnly] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  // Fonction pour jouer l'audio
  const playAudio = () => {
    if (audioRef.current && audioUrl) {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(e => console.error("Erreur de lecture:", e));
    }
  };

  // Fonction pour arrêter l'audio
  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };
  // Charger les modèles face-api.js
  useEffect(() => {
    const loadModels = async () => {
      try {
        const MODEL_URL = './models';
        
        // Vérifier si les modèles sont déjà chargés
        if (!faceapi.nets.tinyFaceDetector.isLoaded) {
          toast.info("Chargement des modèles de détection faciale...");
          
          // Utiliser Promise.all pour charger tous les modèles en parallèle
          await Promise.all([
            faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
            faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
            faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL)
          ]);
          
          toast.success("Modèles chargés avec succès");
          setIsModelLoaded(true);
        } else {
          setIsModelLoaded(true);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des modèles:', error);
        toast.error("Erreur lors du chargement des modèles");
      }
    };

    loadModels();

    // Cleanup function
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  // Démarrer la webcam
  const startWebcam = async () => {
    if (!isModelLoaded) {
      toast.error("Les modèles de détection ne sont pas encore chargés");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: 640,
          height: 480,
          facingMode: 'user'
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          setIsCameraReady(true);
          toast.success("Caméra activée");
        };
      }
    } catch (error) {
      console.error('Erreur lors de l\'accès à la webcam:', error);
      toast.error("Impossible d'accéder à la caméra");
    }
  };

  // Détecter le visage en temps réel
  useEffect(() => {
    if (!isModelLoaded || !isCameraReady || !videoRef.current || !canvasRef.current) {
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;

    // Ajuster la taille du canvas pour correspondre à la vidéo
    const adjustCanvas = () => {
      if (video && canvas) {
        const { videoWidth, videoHeight } = video;
        canvas.width = videoWidth;
        canvas.height = videoHeight;
      }
    };

    // Créer le ResizeObserver pour surveiller la taille de la vidéo
    const resizeObserver = new ResizeObserver(() => {
      adjustCanvas();
  });

    // Commencer l'observation
    resizeObserver.observe(video);

    // Appeler une première fois pour ajuster immédiatement
    adjustCanvas();

    if (showLandmarksOnly) {
      return; // Arrêter la détection en temps réel lors de l'affichage des landmarks
    }

    let animationFrameId: number;

    // Fonction de détection
    const detectFace = async () => {
      if (video.paused || video.ended || !canvas) {
        return;
      }

      // try {
      //   const detections = await faceapi
      //     .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
      //     .withFaceLandmarks()
      //     .withFaceExpressions();

      //   // Dessiner sur le canvas
      //   const context = canvas.getContext('2d');
      //   if (context) {
      //     context.clearRect(0, 0, canvas.width, canvas.height);
          
      //     if (detections && detections.length > 0) {
      //       const resizedDetections = faceapi.resizeResults(detections, {
      //         width: canvas.width,
      //         height: canvas.height
      //       });

      //       // Dessiner seulement le contour du visage et les landmarks
      //       faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);

      //       // Mettre à jour l'état avec les expressions détectées du premier visage
      //       const firstFace = resizedDetections[0];
      //       if (firstFace && !showLandmarksOnly) {
      //         setDetection({
      //           expressions: firstFace.expressions,
      //           landmarks: firstFace.landmarks
      //         });
      //       }
      //     }
      //   }
      // } catch (error) {
      //   console.error('Erreur lors de la détection:', error);
      // }

      // Continuer la boucle de détection
      animationFrameId = requestAnimationFrame(detectFace);
    };

    detectFace();

    // Cleanup
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      resizeObserver.disconnect();
    };
  }, [isModelLoaded, isCameraReady, showLandmarksOnly]);

  useEffect(() => {
    if (audioUrl && audioRef.current) {
      // Démarrer la lecture automatiquement
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(error => {
          console.error("Erreur de lecture automatique:", error);
          // Afficher un bouton de lecture manuelle en cas d'échec
          toast.info("Cliquez sur le bouton pour écouter l'analyse");
        });
    }
  }, [audioUrl]);

  // Prendre une photo et analyser les expressions
  const captureAndAnalyze = async () => {
    if (!videoRef.current || !canvasRef.current) {
      toast.error("La caméra n'est pas prête");
      return;
    }

    setIsProcessing(true);

    try {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (context) {
        context.clearRect(0, 0, canvas.width, canvas.height);

        // Détecter le visage sur l'image actuelle
        const detections = await faceapi
          .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceExpressions();

        if (detections && detections.length > 0) {
          const resizedDetections = faceapi.resizeResults(detections, {
            width: canvas.width,
            height: canvas.height
          });

          // Définir l'affichage uniquement des landmarks
          setShowLandmarksOnly(true);
          setShowVideo(false);

          if (video.srcObject) {
            const stream = video.srcObject as MediaStream;
            // Stopper chaque piste du flux
            stream.getTracks().forEach(track => track.stop());
            // Optionnellement, vider la source
            video.srcObject = null;
          }
          // Dessiner seulement les landmarks du visage
          context.clearRect(0, 0, canvas.width, canvas.height);
          faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);

          // Enregistrer les expressions détectées
          const firstFace = resizedDetections[0];
          if (firstFace) {
            setDetection({
              expressions: firstFace.expressions,
              landmarks: firstFace.landmarks
            });
            
            toast.success("Analyse des expressions terminée");
            // Extraire l'émotion dominante
            const dominantEmotion = Object.keys(firstFace.expressions).reduce((a, b) => firstFace.expressions[a] > firstFace.expressions[b] ? a : b);
            const intensity = Math.round(firstFace.expressions[dominantEmotion] * 10);
            // Générer le contenu apaisant
            const calmingContent = await generateImage(dominantEmotion, intensity.toString());
            const url = await generateVoice(calmingContent);
            setAudioUrl(url);
          }
        } else {
          toast.error("Aucun visage détecté");
          setShowLandmarksOnly(false);
        }
      }
    } catch (error) {
      console.error('Erreur lors de la capture et de l\'analyse:', error);
      toast.error("Erreur lors de l'analyse");
    } finally {
      setIsProcessing(false);
    }
  };

  // Réinitialiser l'état
  const resetDetection =async () => {
    setShowLandmarksOnly(false);
    setDetection(null);
    setShowVideo(true);
    await startWebcam()
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <Card className="w-full p-4">
        <div className="camera-container">
        {showVideo &&<video
            ref={videoRef}
            className="video-element"
            autoPlay
            muted
            playsInline
          />}
          <canvas ref={canvasRef} className="canvas-overlay" />
        </div>

        <div className="flex flex-wrap justify-center gap-4 mt-4">
          {!isCameraReady ? (
            <Button onClick={startWebcam} disabled={!isModelLoaded}>
              {isModelLoaded ? "Activer la caméra" : (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Chargement des modèles...
                </>
              )}
            </Button>
          ) : (
            <>
              <Button
                onClick={captureAndAnalyze}
                disabled={showLandmarksOnly || isProcessing}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyse en cours...
                  </>
                ) : "Prendre une photo"}
              </Button>
              
              {showLandmarksOnly && (
                <Button
                  onClick={resetDetection}
                  variant="outline"
                >
                  Réinitialiser
                </Button>
              )}
            </>
          )}
        </div>
      </Card>

      {detection && showLandmarksOnly && (
        <EmotionsDisplay expressions={detection.expressions} />
      )}
      <audio 
        ref={audioRef} 
        src={audioUrl} 
        hidden
        onEnded={() => setIsPlaying(false)}
      />
    </div>
  );
};

export default FaceDetection;
