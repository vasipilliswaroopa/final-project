import { NavLink } from "react-router-dom";
import { Box, Tag, Warehouse, AlertCircle, TrendingUp, LayoutDashboard, Shield, LogOut, X } from "lucide-react";
import "./Sidebar.css";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  handleLogout: () => void;
}

export default function Sidebar({ isOpen, onClose, handleLogout }: SidebarProps) {
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
  
  const menuItems = [
    { to: "/", label: "Dashboard", icon: LayoutDashboard },
    { to: "/products", label: "Products", icon: Box },
    { to: "/category", label: "Category", icon: Tag },
    { to: "/in-stock", label: "In Stock", icon: Warehouse },
    { to: "/out-of-stock", label: "Out of Stock", icon: AlertCircle },
    { to: "/future-prediction", label: "Future Prediction", icon: TrendingUp },
  ];

  return (
    <>
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 ease-in-out md:sticky md:top-0 md:h-screen md:translate-x-0 ${
          isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
      >
        {/* Sidebar Header Title with close button on mobile */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-orange-500 uppercase tracking-widest">Inventory IQ</span>
            <h1 className="text-lg font-black text-slate-800 leading-tight mt-0.5">
              Forecasting App
            </h1>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-slate-50 text-slate-400 hover:text-slate-700 md:hidden transition cursor-pointer"
              aria-label="Close Sidebar"
            >
              <X size={18} />
            </button>
          )}
        </div>

      
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-3 mb-2">Main Menu</p>
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `relative flex items-center gap-3 px-4 py-3 rounded-xl transition font-semibold text-sm ${
                    isActive 
                      ? "bg-blue-50/70 text-blue-600 before:absolute before:left-0 before:top-2 before:bottom-2 before:w-1.5 before:bg-orange-500 before:rounded-r-md pl-5" 
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                  }`
                }
              >
                <Icon size={18} className="transition-colors" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}

          {currentUser?.role === "admin" && (
            <>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-3 mt-6 mb-2">Administration</p>
              <NavLink
                to="/admin"
                onClick={onClose}
                className={({ isActive }) =>
                  `relative flex items-center gap-3 px-4 py-3 rounded-xl transition font-semibold text-sm ${
                    isActive 
                      ? "bg-blue-50/70 text-blue-600 before:absolute before:left-0 before:top-2 before:bottom-2 before:w-1.5 before:bg-orange-500 before:rounded-r-md pl-5" 
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                  }`
                }
              >
                <Shield size={18} />
                <span>Admin Settings</span>
              </NavLink>
            </>
          )}
        </nav>

        {/* Footer Area with user profile details + logout button */}
        {currentUser && currentUser.name && (
          <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex flex-col gap-3">
            <div className="flex items-center gap-2.5 px-2">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-700 text-sm">
                {currentUser.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-800 truncate">{currentUser.name}</p>
                <p className="text-[10px] text-slate-400 truncate">{currentUser.email}</p>
              </div>
            </div>

            <button
              onClick={() => {
                if (onClose) onClose();
                handleLogout();
              }}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold text-orange-600 hover:text-white bg-orange-50 hover:bg-orange-600 border border-orange-100 hover:border-transparent transition cursor-pointer"
            >
              <LogOut size={14} />
              <span>Log out of System</span>
            </button>
          </div>
        )}
      </aside>
    </>
  );
}