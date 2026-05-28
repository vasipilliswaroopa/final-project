import { useEffect, useState } from "react";
import { productService } from "../services/api";
import type { Product } from "../services/api";
import { Tag, Layers, Archive, DollarSign } from "lucide-react";
import "./Category.css";

interface CategorySummary {
  name: string;
  totalProducts: number;
  totalStock: number;
  totalValue: number;
  items: Product[];
}

export default function Category() {
  const [categories, setCategories] = useState<CategorySummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAndGroupProducts = async () => {
      try {
        setLoading(true);
        const products = await productService.getAllProducts();
        
        
        const groups: { [key: string]: Product[] } = {};
        products.forEach((p) => {
          const cat = p.category || "Uncategorized";
          if (!groups[cat]) {
            groups[cat] = [];
          }
          groups[cat].push(p);
        });

        
        const summary: CategorySummary[] = Object.keys(groups).map((catName) => {
          const items = groups[catName];
          const totalStock = items.reduce((sum, item) => sum + item.quantity, 0);
          const totalValue = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
          return {
            name: catName,
            totalProducts: items.length,
            totalStock,
            totalValue,
            items,
          };
        });

        setCategories(summary);
      } catch (err) {
        console.error("Failed to load category statistics", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAndGroupProducts();
  }, []);

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
        <h1 className="text-2xl font-bold text-slate-800">Category Analytics</h1>
        <p className="text-sm text-slate-500">Inventory categorization, stock aggregation, and capital valuations</p>
      </div>

      {categories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div 
              key={cat.name} 
              className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 hover:shadow-md transition duration-300 flex flex-col justify-between"
            >
              
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-xl text-xs font-bold uppercase tracking-wider">
                    {cat.name}
                  </span>
                  <Tag size={18} className="text-slate-400" />
                </div>

                
                <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-100 mb-4">
                  <div className="text-center">
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Products</p>
                    <p className="text-lg font-extrabold text-slate-800 mt-0.5">{cat.totalProducts}</p>
                  </div>
                  <div className="text-center border-x border-slate-100">
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Total Stock</p>
                    <p className="text-lg font-extrabold text-slate-800 mt-0.5">{cat.totalStock}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Capital Value</p>
                    <p className="text-lg font-extrabold text-blue-600 mt-0.5">${cat.totalValue.toFixed(2)}</p>
                  </div>
                </div>

                
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Catalog Preview</p>
                  <ul className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                    {cat.items.map((item) => (
                      <li key={item.id} className="flex justify-between items-center text-xs py-1 border-b border-slate-50 last:border-b-0">
                        <span className="font-semibold text-slate-700 truncate max-w-40">{item.name}</span>
                        <span className="text-slate-400">
                          {item.quantity} units x ${item.price.toFixed(2)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-10 border border-slate-150 text-center text-slate-400 max-w-md mx-auto">
          <Layers size={36} className="mx-auto mb-2 text-slate-300" />
          <p className="font-semibold text-sm">No inventory categories available</p>
          <p className="text-xs text-slate-350">Add products with categories inside the catalog to compute statistics.</p>
        </div>
      )}
    </div>
  );
}