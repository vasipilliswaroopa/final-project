import { useEffect, useState } from "react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from "recharts";
import { Box, Tag, Warehouse, AlertTriangle, RefreshCw } from "lucide-react";
import { dashboardService, productService } from "../services/api";
import type { Product, DashboardStats } from "../services/api";
import "./Dashboard.css";

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    products: 0,
    categories: 0,
    inStock: 0,
    outOfStock: 0,
  });
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const [statsData, productsData] = await Promise.all([
          dashboardService.getStats(),
          productService.getAllProducts(),
        ]);
        setStats(statsData);
        setProducts(productsData);
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [refreshKey]);

  const stockLevelData = products
    .map(p => ({
      name: p.name,
      quantity: p.quantity,
      price: p.price,
    }))
    .sort((a, b) => a.quantity - b.quantity)
    .slice(0, 6); 

  const predictionData = [
    { month: "Jan", demand: 420, forecastedSales: 400, safetyStock: 250 },
    { month: "Feb", demand: 480, forecastedSales: 450, safetyStock: 280 },
    { month: "Mar", demand: 540, forecastedSales: 510, safetyStock: 290 },
    { month: "Apr", demand: 610, forecastedSales: 590, safetyStock: 310 },
    { month: "May", demand: 700, forecastedSales: 680, safetyStock: 350 },
    { month: "Jun", demand: 820, forecastedSales: 790, safetyStock: 390 },
  ];

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const statCards = [
    { 
      title: "Total Products", 
      value: stats.products, 
      icon: Box, 
      color: "bg-blue-50/70 text-blue-600 border-blue-100" 
    },
    { 
      title: "Categories", 
      value: stats.categories, 
      icon: Tag, 
      color: "bg-indigo-50/70 text-indigo-600 border-indigo-100" 
    },
    { 
      title: "In Stock Items", 
      value: stats.inStock, 
      icon: Warehouse, 
      color: "bg-emerald-50/70 text-emerald-600 border-emerald-100" 
    },
    { 
      title: "Out of Stock", 
      value: stats.outOfStock, 
      icon: AlertTriangle, 
      color: "bg-orange-50/70 text-orange-600 border-orange-100" 
    },
  ];

  if (loading && stats.products === 0) {
    return (
      <div className="flex h-96 items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          <p className="text-sm font-bold text-slate-500">Loading Dashboard Analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans">
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Operational Summary</h1>
          <p className="text-sm text-slate-500 font-semibold">Real-time database inventory insights and predictions</p>
        </div>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-650 hover:text-slate-850 shadow-xs text-sm font-bold transition cursor-pointer"
        >
          <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
          <span>Refresh</span>
        </button>
      </div>

      
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div 
              key={card.title} 
              className="bg-white rounded-2xl shadow-xs border border-slate-200 p-5 flex items-center justify-between hover:shadow-md transition duration-300"
            >
              <div>
                <p className="text-slate-400 text-xs font-bold tracking-wider uppercase">{card.title}</p>
                <h3 className="text-3xl font-extrabold text-slate-850 mt-1.5">
                  {card.value}
                </h3>
              </div>
              <div className={`p-3 rounded-xl border ${card.color}`}>
                <Icon size={24} />
              </div>
            </div>
          );
        })}
      </div>

      
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        
        
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-5 min-h-[380px] flex flex-col">
          <div className="mb-4">
            <h3 className="font-extrabold text-lg text-slate-850">Critical Stock Warning</h3>
            <p className="text-xs text-slate-400 font-semibold">Products with the lowest stock quantities in your database</p>
          </div>
          <div className="flex-1 min-h-[280px]">
            {stockLevelData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stockLevelData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ background: "#0f172a", borderRadius: "12px", border: "none", color: "#fff", fontFamily: "sans-serif", fontWeight: "600" }}
                    itemStyle={{ color: "#f97316" }}
                  />
                  
                  <Bar dataKey="quantity" fill="#f97316" radius={[6, 6, 0, 0]} barSize={36} name="Current Stock" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 text-sm font-semibold">
                No products found in the database. Add products to populate stock levels.
              </div>
            )}
          </div>
        </div>

        
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-5 min-h-[380px] flex flex-col">
          <div className="mb-4">
            <h3 className="font-extrabold text-lg text-slate-850">Dynamic Future Forecasting</h3>
            <p className="text-xs text-slate-400 font-semibold">Simulated 6-month demand prediction and safety stock model</p>
          </div>
          <div className="flex-1 min-h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={predictionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  
                  <linearGradient id="forecastColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="safetyColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ background: "#0f172a", borderRadius: "12px", border: "none", color: "#fff", fontFamily: "sans-serif", fontWeight: "600" }}
                />
                <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: "11px", fontWeight: "bold" }} />
                
                <Area type="monotone" dataKey="forecastedSales" stroke="#2563eb" strokeWidth={2.5} fillOpacity={1} fill="url(#forecastColor)" name="Forecasted Sales" />
                <Area type="monotone" dataKey="safetyStock" stroke="#f97316" strokeWidth={2.5} fillOpacity={1} fill="url(#safetyColor)" name="Required Safety Stock" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}