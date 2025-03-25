
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Leaf, Droplets, Sun } from "lucide-react";

const CropPerformanceCard = () => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Crop Performance</CardTitle>
        <CardDescription>AI-powered growth analysis</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Leaf className="h-4 w-4 mr-2 text-green-600" />
                <span className="text-sm font-medium">Growth Rate</span>
              </div>
              <span className="text-sm font-medium">92%</span>
            </div>
            <Progress value={92} className="h-2" />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Droplets className="h-4 w-4 mr-2 text-blue-600" />
                <span className="text-sm font-medium">Water Efficiency</span>
              </div>
              <span className="text-sm font-medium">87%</span>
            </div>
            <Progress value={87} className="h-2" />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Sun className="h-4 w-4 mr-2 text-yellow-600" />
                <span className="text-sm font-medium">Sunlight Utilization</span>
              </div>
              <span className="text-sm font-medium">76%</span>
            </div>
            <Progress value={76} className="h-2" />
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-100">
          <h4 className="text-sm font-medium text-green-800 mb-1">AI Recommendation</h4>
          <p className="text-xs text-green-700">Increase irrigation by 10% during morning hours to improve growth rate by an estimated 8-12%.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CropPerformanceCard;
