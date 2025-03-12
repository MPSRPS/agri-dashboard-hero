
import { useState, useRef } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileImage, Upload, Camera, AlertTriangle, CheckCircle, Info } from "lucide-react";
import { toast } from "sonner";
import Chatbot from "@/components/Chatbot";

const DiseasePrediction = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("upload");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<{
    disease: string;
    confidence: number;
    description: string;
    treatment: string;
    severity: "low" | "medium" | "high";
  } | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage(event.target?.result as string);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const captureImage = () => {
    // In a real app, this would access the device camera
    // For this demo, we'll just trigger the file input
    triggerFileInput();
  };

  const analyzeImage = () => {
    if (!selectedImage) return;
    
    setIsAnalyzing(true);
    
    // Simulate API call delay
    setTimeout(() => {
      // Mock diseases
      const diseases = [
        {
          disease: "Late Blight",
          confidence: 92.7,
          description: "Late blight is a devastating disease caused by the fungus-like oomycete pathogen Phytophthora infestans. It affects potatoes and tomatoes primarily, causing rapid browning and death of leaf tissue.",
          treatment: "Apply copper-based fungicides early when conditions favor disease. Practice crop rotation and remove infected plant material. Use resistant varieties when available.",
          severity: "high"
        },
        {
          disease: "Powdery Mildew",
          confidence: 88.3,
          description: "Powdery mildew is a fungal disease that appears as white powdery spots on leaves, stems, and sometimes fruit. It reduces photosynthesis and weakens the plant.",
          treatment: "Improve air circulation by proper spacing. Apply sulfur-based fungicides or neem oil. Remove and destroy infected plant parts.",
          severity: "medium"
        },
        {
          disease: "Bacterial Leaf Spot",
          confidence: 79.5,
          description: "Bacterial leaf spot causes dark, water-soaked lesions on leaves that eventually turn brown with a yellow halo. Severely affected leaves may drop prematurely.",
          treatment: "Avoid overhead irrigation. Apply copper-based bactericides. Practice crop rotation and remove crop debris from the field.",
          severity: "medium"
        }
      ];
      
      const randomIndex = Math.floor(Math.random() * diseases.length);
      setResult(diseases[randomIndex] as any);
      setIsAnalyzing(false);
      toast.success("Analysis complete!");
    }, 2500);
  };

  const clearImage = () => {
    setSelectedImage(null);
    setResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <FileImage className="text-krishi-500" />
          {t("disease_prediction")}
        </h1>
        <p className="text-gray-500 mt-1">
          Upload a photo of your plant to identify diseases and get treatment recommendations
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="overflow-hidden border border-gray-200 shadow-sm">
            <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="p-4 border-b border-gray-100">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="upload">Upload Image</TabsTrigger>
                  <TabsTrigger value="camera">Take Photo</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="upload" className="p-6">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
                
                {!selectedImage ? (
                  <div 
                    className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={triggerFileInput}
                  >
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-4 text-sm text-gray-600">
                      <button type="button" className="font-semibold text-krishi-600 hover:text-krishi-500">
                        Click to upload
                      </button>{" "}
                      or drag and drop
                    </div>
                    <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 10MB</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="relative rounded-lg overflow-hidden">
                      <img
                        src={selectedImage}
                        alt="Uploaded plant"
                        className="w-full object-contain max-h-[400px] rounded-lg"
                      />
                      <button
                        onClick={clearImage}
                        className="absolute top-2 right-2 bg-black/50 text-white p-1.5 rounded-full hover:bg-black/70 transition-colors"
                      >
                        ✕
                      </button>
                    </div>
                    
                    <div className="flex justify-center">
                      <Button
                        onClick={analyzeImage}
                        disabled={isAnalyzing}
                        className="bg-krishi-500 hover:bg-krishi-600"
                      >
                        {isAnalyzing ? "Analyzing..." : "Analyze Image"}
                      </Button>
                    </div>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="camera" className="p-6">
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-krishi-100 text-krishi-500 mb-4">
                    <Camera size={32} />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Take a Photo</h3>
                  <p className="text-gray-500 mb-6 max-w-md mx-auto">
                    Use your device's camera to take a clear photo of the plant showing the suspected disease symptoms.
                  </p>
                  <Button 
                    onClick={captureImage}
                    className="bg-krishi-500 hover:bg-krishi-600"
                  >
                    Access Camera
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
        
        <div className="lg:col-span-1">
          <Card className="h-full border border-gray-200 shadow-sm">
            <div className="p-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">Analysis Results</h2>
            </div>
            
            <div className="p-6">
              {!selectedImage ? (
                <div className="text-center py-8">
                  <Info className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-4 text-sm text-gray-600">
                    Upload or take a photo of your plant to see disease analysis results
                  </p>
                </div>
              ) : isAnalyzing ? (
                <div className="text-center py-8">
                  <div className="mx-auto h-12 w-12 border-4 border-gray-200 border-t-krishi-500 rounded-full animate-spin"></div>
                  <p className="mt-4 text-sm text-gray-600">
                    Analyzing your plant image...
                  </p>
                </div>
              ) : result ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    {result.severity === "high" ? (
                      <AlertTriangle className="text-red-500" size={24} />
                    ) : result.severity === "medium" ? (
                      <AlertTriangle className="text-yellow-500" size={24} />
                    ) : (
                      <CheckCircle className="text-green-500" size={24} />
                    )}
                    <div>
                      <h3 className="font-semibold text-gray-900">{result.disease}</h3>
                      <p className="text-sm text-gray-500">
                        Confidence: {result.confidence.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-800 mb-1">Description</h4>
                    <p className="text-sm text-gray-600">{result.description}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-800 mb-1">Recommended Treatment</h4>
                    <p className="text-sm text-gray-600">{result.treatment}</p>
                  </div>
                  
                  <div className="pt-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">Severity</span>
                      <span className={`text-sm font-medium ${
                        result.severity === "high" ? "text-red-600" : 
                        result.severity === "medium" ? "text-yellow-600" : 
                        "text-green-600"
                      }`}>
                        {result.severity.charAt(0).toUpperCase() + result.severity.slice(1)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          result.severity === "high" ? "bg-red-500" : 
                          result.severity === "medium" ? "bg-yellow-500" : 
                          "bg-green-500"
                        }`}
                        style={{ 
                          width: result.severity === "high" ? "100%" : 
                                 result.severity === "medium" ? "60%" : "30%" 
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <CheckCircle className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-4 text-sm text-gray-600">
                    Click "Analyze Image" to process your photo
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      <Chatbot />
    </div>
  );
};

export default DiseasePrediction;
