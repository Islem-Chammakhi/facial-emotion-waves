
import React from "react";
import FaceDetection from "@/components/FaceDetection";
import Instructions from "@/components/Instructions";
import ImageGenerator from "@/components/ImageGenerator";
const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50 py-8 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-700 mb-2">
            Détection d'Expressions Faciales
          </h1>
          <p className="text-gray-600">
            Une application de détection et d'analyse des émotions faciales en temps réel
          </p>
        </header>

        {/* <Instructions /> */}
        
        <div className="mb-10">
          <FaceDetection />
        </div>
        
        <footer className="text-center text-sm text-gray-500 mt-12">
          <p>
            Développé avec React, Tailwind CSS et face-api.js
          </p>
          <p className="mt-1">
            &copy; {new Date().getFullYear()} - Tous droits réservés
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
