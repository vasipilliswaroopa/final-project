import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { Outlet, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import "./Layout.css";

export default function Layout() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    Swal.fire({
      title: 'Success!',
      text: 'Logged out successfully',
      icon: 'success',
      confirmButtonText: 'OK',
      timer: 2000,
      timerProgressBar: true
    }).then(() => {
      navigate("/login");
    });
  };

  return ( 
    <div className="flex min-h-screen bg-slate-50 text-slate-800 antialiased font-sans"> 
      
      {/* Mobile Sidebar backdrop screen interaction blocker */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 md:hidden transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Responsive Sidebar component */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        handleLogout={handleLogout} 
      />

      {/* Main viewport */}
      <div className="flex-1 flex-col min-w-0"> 
        <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-in fade-in duration-300"> 
          <Outlet />
        </main> 
      </div>
    </div> 
  ); 
}