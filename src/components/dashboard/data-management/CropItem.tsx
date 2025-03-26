
import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit, Trash2, X, Check } from "lucide-react";
import { Crop } from "@/services/userDataService";

interface CropItemProps {
  crop: Crop;
  onUpdate: (updatedCrop: Crop) => Promise<void>;
  onDelete: (cropId: string) => void;
}

const CropItem = ({ crop, onUpdate, onDelete }: CropItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingCrop, setEditingCrop] = useState<Crop>(crop);

  const handleUpdate = async () => {
    await onUpdate(editingCrop);
    setIsEditing(false);
  };

  return (
    <Card key={crop.id} className="p-3 border-gray-200">
      {isEditing ? (
        <div className="space-y-3">
          <Input 
            value={editingCrop.crop_name}
            onChange={(e) => setEditingCrop({...editingCrop, crop_name: e.target.value})}
          />
          <Select 
            value={editingCrop.status} 
            onValueChange={(value) => setEditingCrop({...editingCrop, status: value})}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="growing">Growing</SelectItem>
              <SelectItem value="ready">Ready for Harvest</SelectItem>
              <SelectItem value="harvested">Harvested</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex justify-end gap-2">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setIsEditing(false)}
            >
              <X className="h-4 w-4" />
            </Button>
            <Button 
              variant="default" 
              size="sm"
              onClick={handleUpdate}
            >
              <Check className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex justify-between items-center">
          <div>
            <p className="font-medium">{crop.crop_name}</p>
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              crop.status === 'ready' 
                ? 'bg-green-100 text-green-800' 
                : crop.status === 'growing' 
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-800'
            }`}>
              {crop.status === 'growing' ? 'Growing' : 
               crop.status === 'ready' ? 'Ready for Harvest' : 'Harvested'}
            </span>
          </div>
          <div className="flex gap-1">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => {
                setEditingCrop(crop);
                setIsEditing(true);
              }}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onDelete(crop.id!)}
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};

export default CropItem;
