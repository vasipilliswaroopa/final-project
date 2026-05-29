import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { userService } from "../services/api";
import { Box, Lock, Mail } from "lucide-react";

const LogIn: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogIn = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail ||!trimmedPassword) {
      setError("Please enter email and password");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const user = await userService.login({ email: trimmedEmail, password: trimmedPassword });
      localStorage.setItem("currentUser", JSON.stringify(user));
      setIsLoading(false);
      navigate("/");
    } catch (err: any) {
      setIsLoading(false);
      const errMsg = err.response?.data?.message || err.message || "Invalid email or password";
      setError(errMsg);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="absolute top-[-10%] right-[-10%] w-[350px] h-[350px] rounded-full bg-blue-400/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] rounded-full bg-orange-400/10 blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-orange-500 p-3 shadow-md flex items-center justify-center text-white">
            <Box size={28} className="animate-pulse" />
          </div>
        </div>

        <h2 className="text-center text-3xl font-extrabold text-slate-800 tracking-tight">
          Inventory Forecasting <span className="text-orange-500">System</span>
        </h2>
        <p className="mt-2 text-center text-sm font-semibold text-slate-400">
          Access your real-time analytics panel
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white py-10 px-6 sm:px-10 shadow-xl rounded-3xl border-slate-100 transition-all hover:shadow-2xl duration-300">
          <form className="space-y-6" onSubmit={handleLogIn} autoComplete="off">
            {error && (
              <div className="bg-orange-50 border-orange-100 text-orange-700 text-xs p-3.5 rounded-xl font-semibold animate-in fade-in slide-in-from-top-2 duration-200">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 pl-1">
                Email address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Mail size={16} />
                </span>
                <input
                  id="email"
                  name="new-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border-slate-200 bg-slate-50 text-slate-700 rounded-xl placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm font-semibold transition"
                  placeholder="name@company.com"
                  autoComplete="off"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 pl-1">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Lock size={16} />
                </span>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border-slate-200 bg-slate-50 text-slate-700 rounded-xl placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm font-semibold transition"
                  placeholder="••••"
                  autoComplete="current-password"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition cursor-pointer hover:shadow-lg"
              >
                {isLoading? "Signing in..." : "Sign In"}
              </button>
            </div>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col gap-2.5">
            <p className="text-center text-xs font-semibold text-slate-400">
              Want to view the public stock data feed directly?
            </p>
            <button
              type="button"
              onClick={() => navigate("/stocks")}
              className="w-full flex justify-center py-2.5 px-4 border border-blue-200 hover:border-blue-300 rounded-xl text-xs font-bold text-blue-600 hover:bg-slate-50/50 transition cursor-pointer"
            >
              View Public Stock Market Ticker
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogIn;