import { useEffect, useState } from "react";
import { productService } from "../services/api";
import type { Product } from "../services/api";
import { AlertCircle, AlertTriangle } from "lucide-react";

export default function OutOfStock() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOutOfStockProducts = async () => {
      try {
        setLoading(true);
        const data = await productService.getAllProducts();
        
        setProducts(data.filter((p) => p.quantity === 0));
      } catch (err) {
        console.error("Failed to load out-of-stock products", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOutOfStockProducts();
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
        <h1 className="text-2xl font-bold text-slate-800">Out of Stock Alerts</h1>
        <p className="text-sm text-slate-500">Critical products with zero current stock requiring immediate reordering</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-150 p-5 shadow-sm">
        {products.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <th className="pb-3 pl-2">ID</th>
                  <th className="pb-3">Product Name</th>
                  <th className="pb-3">Category</th>
                  <th className="pb-3 text-right">Standard Cost</th>
                  <th className="pb-3 text-center">Status</th>
                  <th className="pb-3 text-center">Action Required</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50/50 transition">
                    <td className="py-3.5 pl-2 font-medium text-slate-400">#{product.id}</td>
                    <td className="py-3.5 font-bold text-slate-800 flex items-center gap-2">
                      <AlertCircle size={16} className="text-rose-500" />
                      {product.name}
                    </td>
                    <td className="py-3.5">
                      <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-600">
                        {product.category}
                      </span>
                    </td>
                    <td className="py-3.5 text-right font-semibold text-slate-700">
                      ${product.price.toFixed(2)}
                    </td>
                    <td className="py-3.5 text-center">
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800">
                        Zero Stock
                      </span>
                    </td>
                    <td className="py-3.5 text-center">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/10 text-amber-700 uppercase border border-amber-500/20">
                        Reorder Now
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 text-slate-400">
            <AlertTriangle size={36} className="mx-auto mb-2 text-slate-300" />
            <p className="font-semibold text-sm">No critical stock warnings</p>
            <p className="text-xs text-slate-350">All catalog products are currently well-stocked and active.</p>
          </div>
        )}
      </div>
    </div>
  );
}