
import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Crop } from "@/services/userDataService";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from '@/context/AuthContext';

interface CropFormProps {
  onAdd: (crop: Omit<Crop, 'user_id'>) => Promise<void>;
  onCancel: () => void;
}

const CropForm = ({ onAdd, onCancel }: CropFormProps) => {
  const { user } = useAuth();
  const [newCrop, setNewCrop] = useState<Omit<Crop, 'user_id'>>({ 
    crop_name: '', 
    status: 'growing',
    planted_date: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [errors, setErrors] = useState({
    crop_name: ''
  });

  const validate = () => {
    const newErrors = {
      crop_name: ''
    };
    let isValid = true;

    if (!newCrop.crop_name.trim()) {
      newErrors.crop_name = 'Crop name is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validate()) {
      return;
    }
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to add crops",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    try {
      const cropToAdd = {
        ...newCrop,
        planted_date: date ? date.toISOString() : null
      };
      
      await onAdd(cropToAdd);
      setNewCrop({ crop_name: '', status: 'growing', planted_date: null });
      setDate(undefined);
      setErrors({ crop_name: '' });
    } catch (error) {
      console.error('Error adding crop:', error);
      toast({
        title: "Error",
        description: "Failed to add crop. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
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
            className={errors.crop_name ? "border-red-500" : ""}
          />
          {errors.crop_name && (
            <p className="text-xs text-red-500 mt-1">{errors.crop_name}</p>
          )}
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

        <div>
          <Label htmlFor="planted-date">Planted Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="planted-date"
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="flex justify-end gap-2 pt-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            size="sm"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-krishi-600 hover:bg-krishi-700"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Adding...
              </>
            ) : 'Add Crop'}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default CropForm;
