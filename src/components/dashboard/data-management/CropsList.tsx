
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Crop } from "@/services/userDataService";
import CropForm from "./CropForm";
import CropItem from "./CropItem";

interface CropsListProps {
  crops: Crop[];
  loading: boolean;
  showAddCrop: boolean;
  setShowAddCrop: (show: boolean) => void;
  handleAddCrop: (crop: Omit<Crop, 'user_id'>) => Promise<void>;
  handleUpdateCrop: (updatedCrop: Crop) => Promise<void>;
  setDeletingCrop: (cropId: string) => void;
}

const CropsList = ({ 
  crops, 
  loading, 
  showAddCrop, 
  setShowAddCrop, 
  handleAddCrop, 
  handleUpdateCrop,
  setDeletingCrop 
}: CropsListProps) => {
  return (
    <div className="space-y-4">
      {/* Add New Crop Form */}
      {showAddCrop ? (
        <CropForm 
          onAdd={handleAddCrop}
          onCancel={() => setShowAddCrop(false)}
        />
      ) : (
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full"
          onClick={() => setShowAddCrop(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Crop
        </Button>
      )}
      
      {/* Crop List */}
      <div className="space-y-2">
        {loading ? (
          <p className="text-center py-4 text-gray-500">Loading crops...</p>
        ) : crops.length === 0 ? (
          <p className="text-center py-4 text-gray-500">No crops added yet</p>
        ) : (
          crops.map(crop => (
            <CropItem 
              key={crop.id} 
              crop={crop} 
              onUpdate={handleUpdateCrop}
              onDelete={setDeletingCrop}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default CropsList;
