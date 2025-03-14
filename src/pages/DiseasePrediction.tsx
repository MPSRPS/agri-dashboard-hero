
import { useRef } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useTranslation } from '@/hooks/useTranslation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Upload, X, Check, Info, Thermometer, Droplets, Leaf } from 'lucide-react';
import { usePlantDiseaseDetection } from '@/hooks/usePlantDiseaseDetection';
import { Skeleton } from '@/components/ui/skeleton';

const DiseasePrediction = () => {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    selectedImage,
    isDragging,
    setIsDragging,
    loading,
    prediction,
    handleFile,
    resetImage,
    analyzeImage
  } = usePlantDiseaseDetection();

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      handleFile(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      handleFile(file);
    }
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{t('diseasePrediction')}</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Upload a photo of your plant to identify diseases and get treatment recommendations.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left Column - Image Upload */}
          <div className="lg:col-span-2">
            <Card className="border-gray-200 h-full flex flex-col">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold">Upload Plant Image</h2>
                <p className="text-gray-500 text-sm mt-1">
                  Upload a clear image of the affected plant part (leaf, stem, fruit, etc.)
                </p>
              </div>
              
              <div className="p-6 flex-1 flex flex-col">
                {!selectedImage ? (
                  <div
                    className={`border-2 border-dashed rounded-lg flex flex-col items-center justify-center p-8 h-64 transition-colors ${
                      isDragging ? 'border-krishi-500 bg-krishi-50' : 'border-gray-300'
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <Upload className="h-10 w-10 text-gray-400 mb-4" />
                    <p className="text-gray-600 text-center mb-4">
                      Drag and drop an image here, or click to browse
                    </p>
                    <Button
                      onClick={handleUploadClick}
                      className="bg-krishi-600 hover:bg-krishi-700"
                    >
                      Browse Files
                    </Button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                    />
                    <p className="text-gray-500 text-xs mt-4">
                      Supported formats: JPG, PNG, JPEG
                    </p>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col">
                    <div className="relative mb-4 flex-1 flex items-center justify-center">
                      <img
                        src={selectedImage}
                        alt="Selected plant"
                        className="max-h-64 max-w-full mx-auto rounded-lg object-contain"
                      />
                      <Button
                        onClick={resetImage}
                        variant="outline"
                        size="icon"
                        className="absolute top-2 right-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
                      >
                        <X className="h-5 w-5 text-gray-600" />
                      </Button>
                    </div>
                    
                    <div className="flex justify-center">
                      <Button
                        onClick={analyzeImage}
                        disabled={loading}
                        className="px-6 py-2 bg-krishi-600 text-white rounded-md hover:bg-krishi-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        {loading ? (
                          <div className="flex items-center gap-2">
                            <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Analyzing...</span>
                          </div>
                        ) : (
                          <span>Analyze Image</span>
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="p-6 bg-gray-50 border-t border-gray-200 text-sm text-gray-600">
                <div className="flex items-start gap-2">
                  <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-700">Tips for better results:</p>
                    <ul className="list-disc pl-5 mt-1 space-y-1">
                      <li>Ensure good lighting when taking photos</li>
                      <li>Focus clearly on the affected area</li>
                      <li>Include both healthy and affected parts for comparison</li>
                      <li>Take multiple images from different angles if needed</li>
                    </ul>
                  </div>
                </div>
              </div>
            </Card>
          </div>
          
          {/* Right Column - Disease Information */}
          <div className="lg:col-span-3">
            <Card className="border-gray-200 h-full">
              {loading ? (
                <div className="p-6 h-full flex flex-col space-y-6">
                  <Skeleton className="h-20 w-full rounded-lg" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Skeleton className="h-40 w-full rounded-lg" />
                    <Skeleton className="h-40 w-full rounded-lg" />
                  </div>
                  <Skeleton className="h-40 w-full rounded-lg" />
                  <Skeleton className="h-40 w-full rounded-lg" />
                </div>
              ) : !prediction ? (
                <div className="h-full flex flex-col items-center justify-center p-10 text-center">
                  <AlertTriangle className="h-12 w-12 text-gray-300 mb-4" />
                  <h3 className="text-xl font-medium text-gray-700 mb-2">No Analysis Yet</h3>
                  <p className="text-gray-500 max-w-md">
                    Upload an image of your plant and click "Analyze Image" to get disease identification and treatment recommendations.
                  </p>
                </div>
              ) : (
                <div className="p-6 h-full flex flex-col">
                  <div className="bg-krishi-50 border border-krishi-100 rounded-lg p-4 mb-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800">
                          {prediction.mainDisease.name}
                        </h3>
                        <p className="text-gray-600 mt-1">
                          {prediction.mainDisease.description}
                        </p>
                      </div>
                      <div className="bg-white border border-green-100 rounded-full px-3 py-1 text-sm font-medium text-green-800 flex items-center gap-1">
                        <Check className="h-4 w-4" />
                        {Math.round((prediction.mainDisease.confidence || 0) * 100)}% Match
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="border border-gray-200 rounded-lg">
                      <div className="bg-gray-50 py-2 px-4 border-b border-gray-200">
                        <h4 className="font-medium text-gray-700 flex items-center gap-1">
                          <AlertTriangle className="h-4 w-4 text-amber-500" />
                          Symptoms
                        </h4>
                      </div>
                      <div className="p-4">
                        {prediction.mainDisease.symptoms && prediction.mainDisease.symptoms.length > 0 ? (
                          <ul className="space-y-2">
                            {prediction.mainDisease.symptoms.map((symptom, index) => (
                              <li key={index} className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-amber-500"></div>
                                <span className="text-gray-700 text-sm">{symptom}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-gray-500 text-sm">No symptoms information available</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="border border-gray-200 rounded-lg">
                      <div className="bg-gray-50 py-2 px-4 border-b border-gray-200">
                        <h4 className="font-medium text-gray-700 flex items-center gap-1">
                          <Leaf className="h-4 w-4 text-green-500" />
                          Environmental Factors
                        </h4>
                      </div>
                      <div className="p-4">
                        {prediction.mainDisease.environmental_factors && prediction.mainDisease.environmental_factors.length > 0 ? (
                          <div className="space-y-4">
                            {prediction.mainDisease.environmental_factors.map((factor, index) => (
                              <div key={index} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  {factor.name === 'Temperature' && <Thermometer className="h-4 w-4 text-red-500" />}
                                  {factor.name === 'Humidity' && <Droplets className="h-4 w-4 text-blue-500" />}
                                  {factor.name === 'Plant Stage' && <Leaf className="h-4 w-4 text-green-500" />}
                                  <span className="text-sm text-gray-700">{factor.name}</span>
                                </div>
                                <span className="text-sm font-medium">{factor.value}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500 text-sm">No environmental factors information available</p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg mb-6">
                    <div className="bg-gray-50 py-2 px-4 border-b border-gray-200">
                      <h4 className="font-medium text-gray-700 flex items-center gap-1">
                        <Check className="h-4 w-4 text-green-500" />
                        Treatment Recommendations
                      </h4>
                    </div>
                    <div className="p-4">
                      {prediction.mainDisease.treatments && prediction.mainDisease.treatments.length > 0 ? (
                        <ul className="space-y-2">
                          {prediction.mainDisease.treatments.map((item, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <div className="h-5 w-5 rounded-full bg-green-100 flex-shrink-0 flex items-center justify-center mt-0.5">
                                <Check className="h-3 w-3 text-green-600" />
                              </div>
                              <span className="text-gray-700 text-sm">{item}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-500 text-sm">No treatment recommendations available</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg">
                    <div className="bg-gray-50 py-2 px-4 border-b border-gray-200">
                      <h4 className="font-medium text-gray-700 flex items-center gap-1">
                        <Info className="h-4 w-4 text-blue-500" />
                        Preventive Measures
                      </h4>
                    </div>
                    <div className="p-4">
                      {prediction.mainDisease.preventive_measures && prediction.mainDisease.preventive_measures.length > 0 ? (
                        <ul className="space-y-2">
                          {prediction.mainDisease.preventive_measures.map((item, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <div className="h-5 w-5 rounded-full bg-blue-100 flex-shrink-0 flex items-center justify-center mt-0.5">
                                <Info className="h-3 w-3 text-blue-600" />
                              </div>
                              <span className="text-gray-700 text-sm">{item}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-500 text-sm">No preventive measures available</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-auto pt-6">
                    <h4 className="font-medium text-gray-700 mb-2">Other Possible Diseases</h4>
                    <div className="flex flex-wrap gap-2">
                      {prediction.diseases.slice(1).map((disease, index) => (
                        <div 
                          key={index}
                          className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-700 flex items-center gap-1"
                        >
                          <span>{disease.name}</span>
                          <span className="text-xs text-gray-500">
                            ({Math.round((disease.confidence || 0) * 100)}%)
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DiseasePrediction;
