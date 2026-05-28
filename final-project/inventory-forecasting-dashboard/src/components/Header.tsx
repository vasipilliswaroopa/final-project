import React, { useState, useEffect } from "react";
import { Bell, UserCircle2, LogIn, LogOut, User, Search, Menu, PackageX } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { userService, productService } from "../services/api";
import type { Product } from "../services/api";
import "./Header.css";
import Swal from 'sweetalert2';
import Modal from "./Modal";

interface HeaderProps {
  toggleSidebar?: () => void;
}

export default function Header({ toggleSidebar }: HeaderProps) {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<any>(() => {
    const saved = localStorage.getItem("currentUser");
    return saved? JSON.parse(saved) : null;
  });

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [globalSearch, setGlobalSearch] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [modalEmail, setModalEmail] = useState("");
  const [modalPassword, setModalPassword] = useState("");
  const [modalName, setModalName] = useState("");

  const [modalError, setModalError] = useState("");
  const [modalLoading, setModalLoading] = useState(false);

  const [customModalOpen, setCustomModalOpen] = useState(false);
  const [customModalTitle, setCustomModalTitle] = useState("");
  const [customModalMessage, setCustomModalMessage] = useState("");
  const [customModalType, setCustomModalType] = useState<"success" | "error" | "info">("info");

  const [showNotifications, setShowNotifications] = useState(false);
  const [outOfStockProducts, setOutOfStockProducts] = useState<Product[]>([]);

  const triggerModal = (title: string, message: string, type: "success" | "error" | "info" = "info") => {
    setCustomModalTitle(title);
    setCustomModalMessage(message);
    setCustomModalType(type);
    setCustomModalOpen(true);
  };

  const handleGlobalSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (globalSearch.trim()) {
      navigate(`/products?search=${encodeURIComponent(globalSearch.trim())}`);
    }
  };

  useEffect(() => {
    if (showEditProfile && currentUser) {
      setName(currentUser.name || "");
      setEmail(currentUser.email || "");
      setPassword("");
    }
  }, [showEditProfile, currentUser]);

  const handleNotificationClick = async () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications) {
      try {
        const data = await productService.getAllProducts();
        const outOfStock = data.filter((p: Product) => p.quantity === 0);
        setOutOfStockProducts(outOfStock);
      } catch (err) {
        console.error("Failed to fetch products for notifications", err);
      }
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser?.id) return;

    try {
      const updated = await userService.updateProfile(currentUser.id, {
        name: name.trim(),
        email: email.trim(),
        password: password.trim() || undefined,
      });

      const updatedUser = {...currentUser,...updated };
      setCurrentUser(updatedUser);
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));
      setShowEditProfile(false);
      triggerModal("Profile Updated", "Your profile details have been successfully modified in the database.", "success");
    } catch (err: any) {
      triggerModal(
        "Update Failed",
        err.response?.data?.message || err.message || "Unable to modify profile information. Please verify parameters.",
        "error"
      );
    }
  };

  
  const closeAuthModal = () => {
    setShowLoginModal(false);
    setModalError("");
    setModalEmail("");
    setModalPassword("");
    setModalName("");
  };

  const openAuthModal = (signUp: boolean) => {
    setModalError("");
    setModalEmail("");
    setModalPassword("");
    setModalName("");
    setIsSignUpMode(signUp);
    setShowLoginModal(true);
  };

  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError("");
    setModalLoading(true);

    const emailVal = modalEmail.trim();
    const passwordVal = modalPassword.trim();
    const nameVal = modalName.trim();

    if (!emailVal ||!passwordVal || (isSignUpMode &&!nameVal)) {
      setModalError("Please fill out all required fields.");
      setModalLoading(false);
      return;
    }

    try {
      if (isSignUpMode) {
        await userService.signup({
          name: nameVal,
          email: emailVal,
          password: passwordVal,
        });

        const loggedIn = await userService.login({
          email: emailVal,
          password: passwordVal,
        });

        setCurrentUser(loggedIn);
        localStorage.setItem("currentUser", JSON.stringify(loggedIn));
        closeAuthModal();
        triggerModal("Welcome Aboard", `Account successfully provisioned for ${nameVal}. Welcome to the system!`, "success");
      } else {
        const loggedIn = await userService.login({
          email: emailVal,
          password: passwordVal,
        });

        setCurrentUser(loggedIn);
        localStorage.setItem("currentUser", JSON.stringify(loggedIn));
        closeAuthModal();
        Swal.fire({
          title: 'Success!',
          text: `Logged in as ${loggedIn.name || "User"}`,
          icon: 'success',
          confirmButtonText: 'OK',
          timer: 2000,
          timerProgressBar: true
        });
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || "Authentication credentials rejected.";
      setModalError(msg);
    } finally {
      setModalLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
    setShowProfileMenu(false);
    Swal.fire({
      title: 'Success!',
      text: 'Logged out successfully.',
      icon: 'success',
      confirmButtonText: 'OK',
      timer: 2000,
      timerProgressBar: true
    });
  };

  return (
    <>
      <header className="bg-white border-b border-slate-200 px-4 md:px-6 py-4 sticky top-0 z-30 shadow-xs">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={toggleSidebar}
              className="p-2 -ml-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-800 md:hidden transition cursor-pointer"
              aria-label="Toggle Sidebar"
            >
              <Menu size={22} />
            </button>
            <h2 className="text-xl md:text-2xl font-extrabold text-slate-850 tracking-tight flex items-center gap-1.5">
              <span>Inventory Forecasting</span>
              <span className="px-2 py-0.5 rounded-lg bg-orange-500 text-white text- md:text-xs font-bold uppercase tracking-wider hidden sm:inline">
                System
              </span>
            </h2>
          </div>

          <div className="flex items-center gap-3 text-slate-700 relative">
            <div className="relative">
              <button
                onClick={handleNotificationClick}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition cursor-pointer relative"
              >
                <Bell size={20} />
                {outOfStockProducts.length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute top-12 right-0 bg-white border-slate-200 rounded-xl shadow-xl w-72 z-50 p-3 animate-in fade-in slide-in-from-top-3 duration-200">
                  <h4 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 mb-2">Stock Alerts</h4>
                  {outOfStockProducts.length > 0? (
                    <div className="max-h-64 overflow-y-auto space-y-2">
                      {outOfStockProducts.map((product) => (
                        <div key={product.id} className="flex items-center gap-2 p-2 rounded-lg bg-orange-50 border-orange-100">
                          <PackageX size={16} className="text-orange-600 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-slate-800 truncate">{product.name}</p>
                            <p className="text- text-slate-500">Out of Stock</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 text-center py-4">All products are in stock</p>
                  )}
                </div>
              )}
            </div>

            {currentUser? (
              <>
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="p-1.5 rounded-full hover:bg-slate-50 flex items-center gap-2 cursor-pointer border-transparent hover:border-slate-200 transition"
                >
                  <UserCircle2 size={24} className="text-blue-600" />
                  <span className="hidden sm:inline text-sm font-semibold text-slate-700">
                    {currentUser.name}
                  </span>
                </button>

                {showProfileMenu && (
                  <div className="absolute top-12 right-0 bg-white border-slate-200 rounded-xl shadow-xl w-56 z-50 p-2 animate-in fade-in slide-in-from-top-3 duration-200">
                    <div className="px-4 py-2.5 border-b border-slate-100">
                      <p className="text- text-slate-400 font-bold uppercase tracking-wider">Logged in as</p>
                      <p className="text-sm font-extrabold text-slate-800 truncate mt-0.5">{currentUser.name}</p>
                      <p className="text-xs text-slate-500 truncate">{currentUser.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        setShowEditProfile(true);
                        setShowProfileMenu(false);
                      }}
                      className="w-full text-left px-4 py-2.5 hover:bg-slate-50 rounded-lg text-sm text-slate-700 flex items-center gap-2 cursor-pointer mt-1 font-semibold transition"
                    >
                      <User size={16} className="text-blue-500" />
                      Edit Profile
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2.5 hover:bg-orange-50 text-orange-600 rounded-lg text-sm flex items-center gap-2 cursor-pointer font-semibold transition"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                )}
              </>
            ) : (
              <button
                onClick={() => openAuthModal(false)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border-blue-200 bg-blue-50/50 hover:bg-blue-600 text-blue-700 hover:text-white transition cursor-pointer font-semibold text-sm shadow-xs"
              >
                <LogIn size={18} />
                <span>Sign In / Sign Up</span>
              </button>
            )}
          </div>
        </div>

        <div className="mt-4">
          <form onSubmit={handleGlobalSearch}>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                <Search size={18} />
              </span>
              <input
                type="text"
                placeholder="Search catalog products dynamically by name or category..."
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                className="w-full border-slate-200 pl-11 pr-4 py-2.5 rounded-xl outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 text-sm font-semibold bg-slate-50/40 hover:bg-slate-50/80 focus:bg-white transition duration-200"
              />
            </div>
          </form>
        </div>
      </header>

      
      {showLoginModal && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4"
          onClick={closeAuthModal}
        >
          <div
            key={isSignUpMode? "signup" : "signin"} // forces remount when toggling modes
            className="bg-white p-7 rounded-2xl w-full max-w-sm shadow-2xl relative border-slate-100 animate-in fade-in zoom-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeAuthModal}
              className="absolute top-4 right-4 text-2xl text-slate-400 hover:text-slate-600 cursor-pointer bg-slate-50 hover:bg-slate-100 rounded-full w-8 h-8 flex items-center justify-center transition"
            >
              
            </button>

            <h2 className="text-2xl font-extrabold text-slate-800 mb-1">
              {isSignUpMode? "Create Account" : "Welcome Back"}
            </h2>
            <p className="text-xs text-slate-400 mb-5 font-semibold">
              {isSignUpMode
               ? "Sign up to track and predict stock"
                : "Sign in to manage inventory forecasting"}
            </p>

            {modalError && (
              <div className="bg-orange-50 text-orange-700 border-orange-100 text-xs p-3 rounded-xl mb-4 font-semibold">
                {modalError}
              </div>
            )}

            {/* FIX 3: autoComplete=off + random name to block autofill */}
            <form onSubmit={handleModalSubmit} className="flex flex-col gap-4" autoComplete="off">
              {isSignUpMode && (
                <input
                  type="text"
                  name="new-name"
                  placeholder="Full Name"
                  value={modalName}
                  onChange={(e) => setModalName(e.target.value)}
                  className="border border-slate-200 p-3 rounded-xl outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 text-sm font-semibold transition"
                  autoComplete="off"
                  required
                />
              )}

              <input
                type="email"
                name="new-email"
                placeholder="Email Address"
                value={modalEmail}
                onChange={(e) => setModalEmail(e.target.value)}
                className="border border-slate-200 p-3 rounded-xl outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 text-sm font-semibold transition"
                autoComplete="off"
                required
              />

              <input
                type="password"
                name="new-password"
                placeholder="Password"
                value={modalPassword}
                onChange={(e) => setModalPassword(e.target.value)}
                className="border border-slate-200 p-3 rounded-xl outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 text-sm font-semibold transition"
                autoComplete="new-password"
                required
              />

              <button
                type="submit"
                disabled={modalLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl disabled:opacity-50 text-sm font-bold transition cursor-pointer mt-1 shadow-md hover:shadow-lg focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
              >
                {modalLoading
                 ? "Processing..."
                  : isSignUpMode
                 ? "Sign Up"
                  : "Sign In"}
              </button>
            </form>

            <div className="mt-5 text-center">
              <button
                onClick={() => openAuthModal(!isSignUpMode)}
                className="text-xs text-blue-600 hover:text-orange-500 hover:underline cursor-pointer bg-transparent border-none p-0 font-bold transition"
              >
                {isSignUpMode
                 ? "Already have an account? Sign In"
                  : "New here? Create an account"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditProfile && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4"
          onClick={() => setShowEditProfile(false)}
        >
          <div
            className="bg-white p-7 rounded-2xl w-full max-w-sm shadow-2xl relative border-slate-100 animate-in fade-in zoom-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowEditProfile(false)}
              className="absolute top-4 right-4 text-2xl text-slate-400 hover:text-slate-600 cursor-pointer bg-slate-50 hover:bg-slate-100 rounded-full w-8 h-8 flex items-center justify-center transition"
            >
              ×
            </button>

            <h2 className="text-2xl font-extrabold text-slate-800 mb-1">
              Edit Profile
            </h2>
            <p className="text-xs text-slate-400 mb-5 font-semibold">
              Update your account credentials
            </p>

            <form onSubmit={handleProfileSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Name</label>
                <input
                  type="text"
                  placeholder="Enter Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="border border-slate-200 p-3 rounded-xl outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 w-full text-sm font-semibold transition"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Email</label>
                <input
                  type="email"
                  placeholder="Enter Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border border-slate-200 p-3 rounded-xl outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 w-full text-sm font-semibold transition"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  New Password (leave blank to keep current)
                </label>
                <input
                  type="password"
                  placeholder="Enter New Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border border-slate-200 p-3 rounded-xl outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 w-full text-sm font-semibold transition"
                />
              </div>

              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl text-sm font-bold transition cursor-pointer mt-2 shadow-md hover:shadow-lg focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}

      <Modal
        isOpen={customModalOpen}
        onClose={() => setCustomModalOpen(false)}
        title={customModalTitle}
        message={customModalMessage}
        type={customModalType}
      />
    </>
  );
}