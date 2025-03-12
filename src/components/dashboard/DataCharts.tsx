
import CropHealthChart from './CropHealthChart';
import WaterConsumptionChart from './WaterConsumptionChart';

const DataCharts = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <CropHealthChart />
      <WaterConsumptionChart />
    </div>
  );
};

export default DataCharts;
