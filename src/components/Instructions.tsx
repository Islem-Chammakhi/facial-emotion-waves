
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { FileDown, Camera, BarChart } from "lucide-react";

const Instructions = () => {
  return (
    <div className="mb-8">
      <Alert className="mb-4">
        <AlertTitle className="text-lg font-semibold">Comment utiliser cette application</AlertTitle>
        <AlertDescription>
          <ol className="list-decimal pl-5 space-y-2 mt-2">
            <li className="flex items-start">
              <FileDown className="mr-2 h-4 w-4 mt-1 flex-shrink-0" />
              <span>Les modèles de détection se chargent automatiquement au démarrage de l'application.</span>
            </li>
            <li className="flex items-start">
              <Camera className="mr-2 h-4 w-4 mt-1 flex-shrink-0" />
              <span>Cliquez sur "Activer la caméra" puis positionnez votre visage au centre de l'écran.</span>
            </li>
            <li className="flex items-start">
              <BarChart className="mr-2 h-4 w-4 mt-1 flex-shrink-0" />
              <span>Appuyez sur "Prendre une photo" pour capturer et analyser vos expressions faciales.</span>
            </li>
          </ol>
        </AlertDescription>
      </Alert>
      
      <Alert variant="destructive" className="bg-amber-50 text-amber-800 border-amber-200">
        <AlertTitle>Téléchargement des modèles requis</AlertTitle>
        <AlertDescription>
          <p className="mt-2">
            Pour que cette application fonctionne correctement, vous devez télécharger les modèles face-api.js depuis le dépôt officiel et les placer dans le dossier <code className="px-1 py-0.5 bg-amber-100 rounded">/public/models</code>.
          </p>
          <p className="mt-2">
            Consultez le fichier <code className="px-1 py-0.5 bg-amber-100 rounded">public/models/readme.txt</code> pour plus d'informations.
          </p>
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default Instructions;
