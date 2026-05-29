import { useEffect, useState } from "react";
import { productService } from "../services/api";
import type { Product } from "../services/api";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  ReferenceLine 
} from "recharts";
import { TrendingUp, Percent, Clock, AlertTriangle, CheckCircle, HelpCircle } from "lucide-react";
import "./Futureprediction.css";

interface ForecastDataPoint {
  month: string;
  predictedDemand: number;
  remainingStock: number;
  safetyStock: number;
}

export default function FuturePrediction() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<number | "">("");
  const [growthRate, setGrowthRate] = useState<number>(12); 
  const [leadTime, setLeadTime] = useState<number>(2); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        setLoading(true);
        const data = await productService.getAllProducts();
        setProducts(data);
        if (data.length > 0 && data[0].id) {
          setSelectedProductId(data[0].id);
        }
      } catch (err) {
        console.error("Failed to load products for forecasting", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllProducts();
  }, []);

  const selectedProduct = products.find(p => p.id === Number(selectedProductId));

  
  const generateForecast = (): ForecastDataPoint[] => {
    if (!selectedProduct) return [];

    const currentStock = selectedProduct.quantity;
    
    
    const baselineMonthlyDemand = Math.max(5, Math.ceil(currentStock * 0.15) || 12);
    const forecastPoints: ForecastDataPoint[] = [];
    
    const months = ["Jun", "Jul", "Aug", "Sep", "Oct", "Nov"];
    let remainingStock = currentStock;

    months.forEach((month, idx) => {
      
      const factor = Math.pow(1 + growthRate / 100, idx);
      const predictedDemand = Math.round(baselineMonthlyDemand * factor);
      
      remainingStock = Math.max(0, remainingStock - predictedDemand);
      
     
      const weeklyDemand = predictedDemand / 4;
      const safetyStock = Math.round(weeklyDemand * leadTime * 1.5);

      forecastPoints.push({
        month,
        predictedDemand,
        remainingStock,
        safetyStock,
      });
    });

    return forecastPoints;
  };

  const forecastData = generateForecast();

  
  const outOfStockMonth = forecastData.find(pt => pt.remainingStock === 0)?.month;
  

  const weeklyDemand = forecastData[0] ? (forecastData[0].predictedDemand / 4) : 0;
  const reorderTriggerPoint = Math.round(weeklyDemand * leadTime);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Inventory Forecasting Simulator</h1>
        <p className="text-sm text-slate-500">Run simulations, configure growth constants, and predict stockout thresholds</p>
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="bg-white rounded-2xl border border-slate-150 p-5 shadow-sm space-y-5 h-fit">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Clock size={18} className="text-blue-600" />
              Simulator Configuration
            </h3>

            
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Pick Product</label>
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value === "" ? "" : Number(e.target.value))}
                className="w-full border border-slate-200 p-2.5 rounded-xl outline-none focus:border-blue-500 text-sm font-semibold bg-white"
              >
                {products.map(p => (
                  <option key={p.id} value={p.id}>{p.name} (Stock: {p.quantity})</option>
                ))}
              </select>
            </div>

           
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-semibold text-slate-500 flex items-center gap-1">
                  <Percent size={14} className="text-slate-400" />
                  Monthly Demand Growth
                </label>
                <span className="text-xs font-bold text-blue-600">{growthRate}%</span>
              </div>
              <input
                type="range"
                min="-20"
                max="50"
                value={growthRate}
                onChange={(e) => setGrowthRate(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <span className="text-[10px] text-slate-400 block mt-1">Simulates seasonal sales momentum</span>
            </div>

            
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-semibold text-slate-500 flex items-center gap-1">
                  <Clock size={14} className="text-slate-400" />
                  Supplier Lead Time
                </label>
                <span className="text-xs font-bold text-indigo-600">{leadTime} {leadTime === 1 ? "Week" : "Weeks"}</span>
              </div>
              <input
                type="range"
                min="1"
                max="6"
                value={leadTime}
                onChange={(e) => setLeadTime(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <span className="text-[10px] text-slate-400 block mt-1">Supplier shipment duration</span>
            </div>

            
            {selectedProduct && (
              <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100 space-y-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Current Inventory</p>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Name:</span>
                  <span className="font-semibold text-slate-800">{selectedProduct.name}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">In Stock Quantity:</span>
                  <span className="font-bold text-slate-850">{selectedProduct.quantity} units</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Reorder Level:</span>
                  <span className="font-semibold text-indigo-600">{reorderTriggerPoint} units</span>
                </div>
              </div>
            )}
          </div>

         
          <div className="bg-white rounded-2xl border border-slate-150 p-5 shadow-sm lg:col-span-2 flex flex-col min-h-[420px] justify-between">
            <div>
              
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-850">Predicted Depletion Curve</h3>
                  <p className="text-xs text-slate-400">Forecasting month-on-month stock level trends</p>
                </div>

                {selectedProduct && (
                  <div className="flex items-center gap-2">
                    {outOfStockMonth ? (
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-rose-50 text-rose-700 border border-rose-100 rounded-xl text-xs font-bold">
                        <AlertTriangle size={14} />
                        Stockout Risk: {outOfStockMonth}
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-xl text-xs font-bold">
                        <CheckCircle size={14} />
                        Stock Stable
                      </div>
                    )}
                  </div>
                )}
              </div>

              
              <div className="h-[270px] min-w-full">
                {selectedProduct ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={forecastData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="month" stroke="#64748b" fontSize={11} tickLine={false} />
                      <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                      <Tooltip 
                        contentStyle={{ background: "#0f172a", borderRadius: "12px", border: "none", color: "#fff" }}
                      />
                      <Legend verticalAlign="top" height={32} iconType="circle" />
                      
                     
                      <ReferenceLine 
                        y={reorderTriggerPoint} 
                        stroke="#f59e0b" 
                        strokeDasharray="4 4" 
                        label={{ value: "Reorder Trigger", fill: "#d97706", fontSize: 10, position: "top" }} 
                      />

                      <Line type="monotone" dataKey="remainingStock" stroke="#3b82f6" strokeWidth={3} name="Predicted Stock Level" activeDot={{ r: 8 }} />
                      <Line type="monotone" dataKey="predictedDemand" stroke="#f43f5e" strokeWidth={1.5} name="Monthly Sales Demand" strokeDasharray="3 3" />
                      <Line type="monotone" dataKey="safetyStock" stroke="#10b981" strokeWidth={1.5} name="Calculated Safety Stock" />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-slate-400 text-sm">
                    Please select a product.
                  </div>
                )}
              </div>
            </div>

            
            {selectedProduct && (
              <div className="bg-blue-50/50 rounded-xl p-3 border border-blue-500/10 text-xs text-blue-800 leading-relaxed mt-4">
                <strong>📈 Forecasting Insight:</strong> With a {growthRate}% monthly sales growth rate, 
                {" "}{selectedProduct.name} will have an estimated sales velocity of ~{forecastData[0]?.predictedDemand} units/month. 
                {outOfStockMonth ? (
                  <>
                    {" "}Based on supplier lead time of {leadTime} {leadTime === 1 ? "week" : "weeks"}, you must place a purchase order <strong>before {outOfStockMonth}</strong> when inventory dips below the reorder trigger level of <strong>{reorderTriggerPoint} units</strong> to avoid customer order disruption.
                  </>
                ) : (
                  <>
                    {" "}Your current database stock level of <strong>{selectedProduct.quantity} units</strong> is robust and is predicted to comfortably sustain operations for the next six months without stockouts.
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-10 border border-slate-150 text-center text-slate-400 max-w-md mx-auto">
          <TrendingUp size={36} className="mx-auto mb-2 text-slate-300" />
          <p className="font-semibold text-sm">No products available for simulation</p>
          <p className="text-xs text-slate-350">Add catalog products in the database first to enable dynamic forecasting models.</p>
        </div>
      )}
    </div>
  );
}