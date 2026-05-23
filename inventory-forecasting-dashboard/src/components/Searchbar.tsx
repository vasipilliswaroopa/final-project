import { Search } from "lucide-react";
import "./Searchbar.css";

export default function Searchbar() {
  return (
    
    <div className="relative w-full">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
      <input
        type="text"
        placeholder="Search products, categories, stock..."
        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-blue-500 bg-white"
      />
    </div>
  );
}