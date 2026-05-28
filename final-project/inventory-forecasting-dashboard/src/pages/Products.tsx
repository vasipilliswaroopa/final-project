import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { productService } from "../services/api"; // <-- FIXED: Changed path
import type { Product } from "../services/api";
import { Trash2, Plus, Search, Package } from "lucide-react";
import toast from 'react-hot-toast';
import Modal from "../components/Modal";
import "./Products.css";
import Swal from 'sweetalert2';

const STANDARD_CATEGORIES = [
  "Electronics",
  "Apparel",
  "Stationery",
  "Automotive",
  "Furniture",
  "Other",
];

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [category, setCategory] = useState(STANDARD_CATEGORIES[0]);
  const [customCategory, setCustomCategory] = useState("");
  const [quantity, setQuantity] = useState<number>(0);
  const [price, setPrice] = useState<number>(0);

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [selectedFilterCategory, setSelectedFilterCategory] = useState("");

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  useEffect(() => {
    if (search) {
      setSearchParams({ search });
    } else {
      setSearchParams({});
    }
  }, [search, setSearchParams]);

  useEffect(() => {
    const urlSearch = searchParams.get("search") || "";
    if (urlSearch!== search) {
      setSearch(urlSearch);
    }
  }, [searchParams]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getAllProducts();
      setProducts(data);
    } catch (err: any) {
      console.error("Failed to fetch products", err);
      if (err.code === 'ECONNABORTED' || err.message.includes('timeout')) {
        Swal.fire({
          title: 'Waking up server...',
          text: 'Render free tier sleeps. First load takes ~50s. Please wait.',
          icon: 'info',
          timer: 3000,
          timerProgressBar: true
        });
      } else {
        Swal.fire({
          title: 'Error!',
          text: err.response?.data?.message || 'Failed to load products',
          icon: 'error',
          confirmButtonText: 'OK',
          timer: 2000,
          timerProgressBar: true
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = name.trim();
    if (!finalName) {
      Swal.fire({
        title: 'Warning!',
        text: 'Please enter a product name.',
        icon: 'warning',
        confirmButtonText: 'OK',
        timer: 2000,
        timerProgressBar: true
      });
      return;
    }

    const finalCategory = category === "Other"? customCategory.trim() : category;
    if (!finalCategory) {
      Swal.fire({
        title: 'Warning!',
        text: 'Please enter or select a category.',
        icon: 'warning',
        confirmButtonText: 'OK',
        timer: 2000,
        timerProgressBar: true
      });
      return;
    }

    if (quantity < 0 || price < 0) {
      Swal.fire({
        title: 'Warning!',
        text: 'Quantity and price must be greater than or equal to 0.',
        icon: 'warning',
        confirmButtonText: 'OK',
        timer: 2000,
        timerProgressBar: true
      });
      return;
    }

    try {
      const newProductPayload: Product = {
        name: finalName,
        category: finalCategory,
        quantity,
        price,
      };

      await productService.createProduct(newProductPayload);

      Swal.fire({
        title: 'Success!',
        text: 'Product added successfully',
        icon: 'success',
        confirmButtonText: 'OK',
        timer: 2000,
        timerProgressBar: true
      });

      setName("");
      setCustomCategory("");
      setQuantity(0);
      setPrice(0);

      await fetchProducts();
    } catch (err: any) {
      Swal.fire({
        title: 'Error!',
        text: err.response?.data?.message || err.message || "Failed to add product",
        icon: 'error',
        confirmButtonText: 'OK',
        timer: 3000,
        timerProgressBar: true
      });
    }
  };

  const handleDelete = (id?: number) => {
    if (id == null) return;
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (deleteId == null) return;
    setShowDeleteModal(false);
    try {
      await productService.deleteProduct(deleteId);
      Swal.fire({
        title: 'Success!',
        text: 'Product deleted successfully',
        icon: 'success',
        confirmButtonText: 'OK',
        timer: 2000,
        timerProgressBar: true
      });
      await fetchProducts();
    } catch (err: any) {
      Swal.fire({
        title: 'Error!',
        text: err.response?.data?.message || err.message || "Failed to delete product",
        icon: 'error',
        confirmButtonText: 'OK',
        timer: 3000,
        timerProgressBar: true
      });
    } finally {
      setDeleteId(null);
    }
  };

  const filteredProducts = products.filter((p) => {
    const nameVal = (p.name?? "").toLowerCase();
    const categoryVal = (p.category?? "").toLowerCase();
    const searchTerm = search.toLowerCase().trim();

    const matchesSearch = searchTerm === "" ||
      nameVal.includes(searchTerm) ||
      categoryVal.includes(searchTerm);

    const matchesCategory = selectedFilterCategory === "" || p.category === selectedFilterCategory;

    return matchesSearch && matchesCategory;
  });

  const uniqueCategories = Array.from(
    new Set(products.map(p => p.category).filter(Boolean))
  ).sort();

  return (
    <div className="space-y-6 font-sans">
      <div>
        <h1 className="text-2xl font-black text-slate-800">Inventory Catalog</h1>
        <p className="text-sm text-slate-500 font-semibold">Manage database products, quantities, and pricing structures</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <div className="bg-white rounded-2xl border-slate-200 p-5 shadow-sm h-fit">
          <h3 className="text-lg font-extrabold text-slate-800 mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Plus size={18} className="text-blue-600" />
            Add New Product
          </h3>

          <form onSubmit={handleAddProduct} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Product Name</label>
              <input
                type="text"
                placeholder="e.g. Wireless Mouse"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border-slate-200 p-2.5 rounded-xl outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 text-sm font-semibold transition bg-slate-50/50 hover:bg-slate-50 focus:bg-white"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full border-slate-200 p-2.5 rounded-xl outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 text-sm font-semibold transition bg-white"
                >
                  {STANDARD_CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {category === "Other" && (
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Custom Category</label>
                  <input
                    type="text"
                    placeholder="Enter category"
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    className="w-full border border-slate-200 p-2.5 rounded-xl outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 text-sm font-semibold transition bg-slate-50/50 hover:bg-slate-50 focus:bg-white"
                    required
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Stock Quantity</label>
                <input
                  type="number"
                  placeholder="e.g. 50"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full border-slate-200 p-2.5 rounded-xl outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 text-sm font-semibold transition bg-slate-50/50 hover:bg-slate-50 focus:bg-white"
                  min="0"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Unit Price ($)</label>
                <input
                  type="number"
                  placeholder="e.g. 19.99"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full border-slate-200 p-2.5 rounded-xl outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 text-sm font-semibold transition bg-slate-50/50 hover:bg-slate-50 focus:bg-white"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl text-sm font-bold transition cursor-pointer flex items-center justify-center gap-2 mt-2 shadow-md hover:shadow-lg focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
            >
              <Plus size={16} />
              Add Product to Database
            </button>
          </form>
        </div>

        <div className="bg-white rounded-2xl border-slate-200 p-5 shadow-sm lg:col-span-2 flex-col min-h-[400px]">

          <div className="flex flex-col sm:flex-row gap-3 mb-5 justify-between items-center">
            <div className="relative w-full sm:w-72">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                <Search size={16} />
              </span>
              <input
                type="text"
                placeholder="Search catalog name or category..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border-slate-200 pl-9 pr-4 py-2 rounded-xl outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 text-sm font-semibold bg-slate-50/40 hover:bg-slate-50/80 focus:bg-white transition"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs font-bold text-slate-400 whitespace-nowrap uppercase tracking-wider">Filter:</span>
              <select
                value={selectedFilterCategory}
                onChange={(e) => setSelectedFilterCategory(e.target.value)}
                className="w-full sm:w-44 border-slate-200 p-2 rounded-xl outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 text-xs font-semibold bg-white"
              >
                <option value="">All Categories</option>
                {uniqueCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex-1 overflow-x-auto">
            {loading? (
              <div className="flex h-64 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
              </div>
            ) : filteredProducts.length > 0? (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <th className="pb-3 pl-2">ID</th>
                    <th className="pb-3">Product Name</th>
                    <th className="pb-3">Category</th>
                    <th className="pb-3 text-right">Price</th>
                    <th className="pb-3 text-center">Stock</th>
                    <th className="pb-3 text-center">Status</th>
                    <th className="pb-3 text-right pr-2">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-slate-50/50 transition">
                      <td className="py-3.5 pl-2 font-bold text-slate-400">#{product.id}</td>
                      <td className="py-3.5 font-bold text-slate-800">{product.name}</td>
                      <td className="py-3.5">
                        <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-50 text-blue-700">
                          {product.category}
                        </span>
                      </td>
                      <td className="py-3.5 text-right font-bold text-slate-700">
                        ${product.price?.toFixed(2)}
                      </td>
                      <td className="py-3.5 text-center font-extrabold text-slate-850">{product.quantity}</td>
                      <td className="py-3.5 text-center">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                            product.quantity > 0
                        ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                              : "bg-orange-50 text-orange-700 border-orange-100"
                          }`}
                        >
                          {product.quantity > 0? "In Stock" : "Out of Stock"}
                        </span>
                      </td>
                      <td className="py-3.5 text-right pr-2">
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-1.5 rounded-lg border-transparent hover:border-orange-200 text-slate-400 hover:text-orange-600 hover:bg-orange-50 transition cursor-pointer"
                          title="Delete Product"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                <Package size={36} className="mb-2 text-slate-300" />
                <p className="text-sm font-semibold text-slate-500">No matching products in database</p>
                <p className="text-xs text-slate-400">Try refining search parameters or create a new product</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Delete this product?"
        message="This action will remove the item from inventory."
        type="error"
        confirmText="Delete"
      />
    </div>
  );
}