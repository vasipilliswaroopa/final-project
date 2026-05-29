import { useEffect, useState } from "react";
import { stockService, healthService } from "../services/api";
import type { Stock } from "../services/api";
import { TrendingUp, RefreshCw, Server, AlertCircle, CheckCircle, Database } from "lucide-react";

export default function Stocks() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [pinging, setPinging] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    setPinging(true);
    try {
      // 1. Check Connection Status via /health
      const connected = await healthService.checkHealth();
      setIsConnected(connected);

      if (connected) {
        // 2. Fetch Stocks
        const stockData = await stockService.getStocks();
        setStocks(stockData);
      } else {
        setError("Backend health check failed. The service might be starting up.");
      }
    } catch (err: any) {
      console.error("Error fetching data:", err);
      setIsConnected(false);
      setError(err.message || "Failed to communicate with the backend server.");
    } finally {
      setLoading(false);
      setPinging(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="space-y-6 font-sans max-w-4xl mx-auto p-4 sm:p-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 bottom-0 translate-x-10 translate-y-10 opacity-10">
          <Database size={240} />
        </div>
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <span className="text-xs font-bold bg-white/20 px-3 py-1 rounded-full text-blue-100 uppercase tracking-widest">
              Live Feed
            </span>
            <h1 className="text-3xl font-black mt-2 tracking-tight">Stock Market Ticker</h1>
            <p className="text-blue-100/90 text-sm mt-1.5 font-medium">
              Real-time stock data fetched directly from <code className="bg-black/20 px-1.5 py-0.5 rounded font-mono text-xs text-white">stock-backend-api-zwy1</code>
            </p>
          </div>
          <button
            onClick={fetchData}
            disabled={loading || pinging}
            className="self-start sm:self-center flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 shadow-lg text-sm font-bold transition duration-200 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw size={15} className={pinging ? "animate-spin" : ""} />
            <span>Refresh Data</span>
          </button>
        </div>
      </div>

      {/* Connection & API Status Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Connection Status Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${isConnected ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : isConnected === false ? "bg-rose-50 text-rose-600 border border-rose-100" : "bg-slate-50 text-slate-400 border border-slate-100"}`}>
              <Server size={20} />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Backend Server</h3>
              <p className="text-sm font-extrabold text-slate-800 mt-0.5">
                {isConnected ? "stock-backend-api-zwy1" : "Connection Check"}
              </p>
            </div>
          </div>
          <div>
            {isConnected ? (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                <CheckCircle size={12} /> Connected
              </span>
            ) : isConnected === false ? (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-650 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-100">
                <AlertCircle size={12} /> Offline
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-400 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-100">
                Checking...
              </span>
            )}
          </div>
        </div>

        {/* API Health Check Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${isConnected ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : isConnected === false ? "bg-rose-50 text-rose-600 border border-rose-100" : "bg-slate-50 text-slate-400 border border-slate-100"}`}>
              <TrendingUp size={20} />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Health Status</h3>
              <p className="text-sm font-extrabold text-slate-800 mt-0.5">
                Endpoint: <code className="text-xs bg-slate-100 px-1 py-0.5 rounded font-mono">/health</code>
              </p>
            </div>
          </div>
          <div>
            {isConnected ? (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                OK (200)
              </span>
            ) : isConnected === false ? (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-650 bg-rose-50 px-3 py-1 rounded-full border border-rose-100">
                FAILED
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-400 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                Pinging...
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Stock Data Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="font-extrabold text-lg text-slate-800">Tracked Assets</h3>
            <p className="text-xs text-slate-400 font-semibold">Live tickers showing current pricing information</p>
          </div>
          <span className="text-xs font-bold text-slate-500 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs">
            {stocks.length} Stocks Listed
          </span>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center gap-3">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
            <p className="text-sm font-bold text-slate-500">Querying stock database...</p>
          </div>
        ) : error ? (
          /* Error State */
          <div className="p-8 flex flex-col items-center justify-center text-center max-w-md mx-auto">
            <div className="p-3 bg-rose-50 text-rose-650 rounded-full border border-rose-100 mb-3">
              <AlertCircle size={28} />
            </div>
            <h4 className="text-base font-bold text-slate-800">CORS or Network Blocked</h4>
            <p className="text-sm text-slate-500 mt-1 font-semibold leading-relaxed">
              {error}
            </p>
            <button
              onClick={fetchData}
              className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
            >
              Retry Connection
            </button>
          </div>
        ) : (
          /* Table View */
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-50/20">
                  <th className="py-4 px-6">Company / Ticker</th>
                  <th className="py-4 px-6 text-right">Market Price</th>
                  <th className="py-4 px-6 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm font-semibold text-slate-700">
                {stocks.map((stock, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition">
                    <td className="py-4 px-6 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center font-bold text-indigo-700 text-xs">
                        {stock.symbol}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-extrabold text-slate-800">{stock.symbol}</span>
                        <span className="text-slate-400 text-xs font-medium">
                          {stock.symbol === "AAPL" ? "Apple Inc." : stock.symbol === "TSLA" ? "Tesla Inc." : "Global Asset"}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right font-mono font-extrabold text-slate-800 text-base">
                      ${stock.price.toFixed(2)}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                        ACTIVE
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
