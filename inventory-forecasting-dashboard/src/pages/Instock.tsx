import { useEffect, useState } from "react";
import { productService } from "../services/api";
import type { Product } from "../services/api";
import { Warehouse, CheckCircle2 } from "lucide-react";
import "./Instock.css";

export default function InStock() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInStockProducts = async () => {
      try {
        setLoading(true);
        const data = await productService.getAllProducts();
        // Filter products that are in stock (quantity > 0)
        setProducts(data.filter((p) => p.quantity > 0));
      } catch (err) {
        console.error("Failed to load in-stock products", err);
      } finally {
        setLoading(false);
      }
    };

    fetchInStockProducts();
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
        <h1 className="text-2xl font-bold text-slate-800">In Stock Inventory</h1>
        <p className="text-sm text-slate-500">Live products in stock and available for operations</p>
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
                  <th className="pb-3 text-right">Unit Price</th>
                  <th className="pb-3 text-center">Available Stock</th>
                  <th className="pb-3 text-right pr-2">Total Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50/50 transition">
                    <td className="py-3.5 pl-2 font-medium text-slate-400">#{product.id}</td>
                    <td className="py-3.5 font-bold text-slate-800 flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-emerald-500" />
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
                    <td className="py-3.5 text-center font-bold text-slate-800">{product.quantity}</td>
                    <td className="py-3.5 text-right font-bold text-emerald-600 pr-2">
                      ${(product.quantity * product.price).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 text-slate-400">
            <Warehouse size={36} className="mx-auto mb-2 text-slate-300" />
            <p className="font-semibold text-sm">No in-stock products</p>
            <p className="text-xs text-slate-350">Add products with a quantity greater than zero in the catalog.</p>
          </div>
        )}
      </div>
    </div>
  );
}