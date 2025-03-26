
import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Crop } from "@/services/userDataService";

interface CropFormProps {
  onAdd: (crop: Omit<Crop, 'user_id'>) => Promise<void>;
  onCancel: () => void;
}

const CropForm = ({ onAdd, onCancel }: CropFormProps) => {
  const [newCrop, setNewCrop] = useState<Omit<Crop, 'user_id'>>({ 
    crop_name: '', 
    status: 'growing' 
  });

  const handleSubmit = async () => {
    if (!newCrop.crop_name.trim()) {
      toast({
        title: "Error",
        description: "Crop name is required",
        variant: "destructive",
      });
      return;
    }
    
    await onAdd(newCrop);
    setNewCrop({ crop_name: '', status: 'growing' });
  };

  return (
    <Card className="p-4 border-gray-200 bg-gray-50">
      <h3 className="text-md font-medium mb-3">Add New Crop</h3>
      <div className="space-y-3">
        <div>
          <Label htmlFor="crop-name">Crop Name</Label>
          <Input 
            id="crop-name" 
            value={newCrop.crop_name}
            onChange={(e) => setNewCrop({...newCrop, crop_name: e.target.value})}
            placeholder="e.g., Wheat, Rice, Tomato"
          />
        </div>
        
        <div>
          <Label htmlFor="crop-status">Status</Label>
          <Select 
            value={newCrop.status} 
            onValueChange={(value) => setNewCrop({...newCrop, status: value})}
          >
            <SelectTrigger id="crop-status">
              <SelectValue placeholder="Select crop status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="growing">Growing</SelectItem>
              <SelectItem value="ready">Ready for Harvest</SelectItem>
              <SelectItem value="harvested">Harvested</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex justify-end gap-2 pt-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button 
            size="sm"
            onClick={handleSubmit}
          >
            Add Crop
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default CropForm;
