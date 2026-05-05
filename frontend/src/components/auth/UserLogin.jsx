import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Lock,
  ArrowRight,
  Code,
  Globe,
  UserPlus,
  LogIn,
} from "lucide-react";
import API_URL from "../../config/api";

const AuthPage = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    shopName: '',
    address: '',
    pincode: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const endpoint = isLogin ? `${API_URL}/api/auth/user/login` : `${API_URL}/api/auth/user/register`;
    
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      
      if (response.ok) {
        if (data.role === 'admin') {
          navigate('/admin-home');
        } else {
          navigate('/user-home');
        }
      } else {
        setError(data.message || 'Invalid credentials. Please try again.');
      }
    } catch (err) {
      setError('Server connection error. Please try again later.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-amber-950/30 flex items-center justify-center p-4 sm:p-6 md:p-12">
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 bg-zinc-900/50 border border-zinc-800 rounded-2xl sm:rounded-3xl overflow-hidden backdrop-blur-xl">
        {/* LEFT SIDE: BRAND CONTENT */}
        <div className="relative hidden md:block overflow-hidden p-8 sm:p-12">
          <img
            src="https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=1000"
            className="absolute inset-0 w-full h-full object-cover opacity-30 grayscale"
            alt="Heritage"
          />
          <div className="relative z-10 h-full flex flex-col justify-between">
            <h2 className="text-3xl sm:text-4xl font-serif italic text-zinc-100">
              {isLogin
                ? "Welcome back to Gupta Sales."
                : "Join our legacy of purity."}
            </h2>
            <div className="space-y-4">
              <p className="text-zinc-500 text-[10px] sm:text-xs uppercase tracking-[0.3em] leading-relaxed">
                Est. 2000 • Quality that spans generations.
              </p>
              <div className="w-12 h-[1px] bg-amber-600" />
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: THE UNIFIED FORM */}
        <div className="p-6 sm:p-8 md:p-16 bg-zinc-950/50">
          {/* TOGGLE SWITCH */}
          <div className="flex bg-zinc-900 p-1 rounded-full mb-8 sm:mb-12 relative">
            <motion.div
              animate={{ x: isLogin ? "0%" : "100%" }}
              className="absolute top-1 left-1 w-[calc(50%-4px)] h-[calc(100%-8px)] bg-amber-600 rounded-full"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
            <button
              onClick={() => setIsLogin(true)}
              className={`relative z-10 w-1/2 py-2 text-[9px] sm:text-[10px] uppercase font-bold tracking-widest transition-colors ${isLogin ? "text-white" : "text-zinc-500"}`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`relative z-10 w-1/2 py-2 text-[9px] sm:text-[10px] uppercase font-bold tracking-widest transition-colors ${!isLogin ? "text-white" : "text-zinc-500"}`}
            >
              Register
            </button>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={isLogin ? "login" : "register"}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <header className="mb-6 sm:mb-8">
                <h3 className="text-xl sm:text-2xl font-serif italic mb-2 text-amber-500">
                  {isLogin ? "Sign In" : "Create Account"}
                </h3>
                <p className="text-zinc-500 text-[9px] sm:text-[10px] uppercase tracking-widest">
                  {isLogin
                    ? "Access your saved collection"
                    : "Start your journey with us"}
                </p>
              </header>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-4">
                  <p className="text-red-400 text-xs text-center">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <>
                    <div className="relative border-b border-zinc-700 focus-within:border-amber-500 transition-colors">
                      <input 
                        name="name"
                        type="text"
                        placeholder="Full Name"
                        autoComplete="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full bg-transparent py-3 text-sm text-zinc-100 outline-none placeholder:text-zinc-500"
                      />
                    </div>
                    <div className="relative border-b border-zinc-700 focus-within:border-amber-500 transition-colors">
                      <input 
                        name="phone"
                        type="tel"
                        placeholder="Phone Number (Optional)"
                        autoComplete="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full bg-transparent py-3 text-sm text-zinc-100 outline-none placeholder:text-zinc-500"
                      />
                    </div>
                    <div className="relative border-b border-zinc-700 focus-within:border-amber-500 transition-colors">
                      <input 
                        name="shopName"
                        type="text"
                        placeholder="Shop Name (Optional)"
                        value={formData.shopName}
                        onChange={handleChange}
                        className="w-full bg-transparent py-3 text-sm text-zinc-100 outline-none placeholder:text-zinc-500"
                      />
                    </div>
                    <div className="relative border-b border-zinc-700 focus-within:border-amber-500 transition-colors">
                      <input 
                        name="address"
                        type="text"
                        placeholder="Delivery Address (Optional)"
                        value={formData.address}
                        onChange={handleChange}
                        className="w-full bg-transparent py-3 text-sm text-zinc-100 outline-none placeholder:text-zinc-500"
                      />
                    </div>
                    <div className="relative border-b border-zinc-700 focus-within:border-amber-500 transition-colors">
                      <input 
                        name="pincode"
                        type="text"
                        placeholder="Pincode (Optional)"
                        value={formData.pincode}
                        onChange={handleChange}
                        className="w-full bg-transparent py-3 text-sm text-zinc-100 outline-none placeholder:text-zinc-500"
                      />
                    </div>
                  </>
                )}
                <div className="relative border-b border-zinc-700 focus-within:border-amber-500 transition-colors">
                  <input 
                    name="email"
                    type="email"
                    placeholder="Email Address"
                    autoComplete="username"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-transparent py-3 text-sm text-zinc-100 outline-none placeholder:text-zinc-500"
                  />
                </div>
                <div className="relative border-b border-zinc-700 focus-within:border-amber-500 transition-colors">
                  <input 
                    name="password"
                    type="password"
                    placeholder="Password"
                    autoComplete="current-password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full bg-transparent py-3 text-sm text-zinc-100 outline-none placeholder:text-zinc-500"
                  />
                </div>

                <button type="submit" className="w-full bg-amber-600 text-zinc-950 py-3 sm:py-4 text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-amber-500 transition-all">
                  {isLogin ? "Enter Shop" : "Register Now"}{" "}
                  <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              </form>

              <div className="flex items-center gap-4 py-3 sm:py-4">
                <div className="flex-1 h-[1px] bg-zinc-800" />
                <span className="text-[9px] sm:text-[10px] text-zinc-200 uppercase tracking-widest">
                  or continue with
                </span>
                <div className="flex-1 h-[1px] bg-zinc-800" />
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <button className="flex items-center justify-center gap-2 sm:gap-3 border border-zinc-700 py-2 sm:py-3 text-[9px] sm:text-[10px] uppercase tracking-widest text-zinc-300 hover:bg-zinc-800 hover:text-amber-500 transition-all">
                  <Globe className="w-3 h-3" /> Google
                </button>
                <button className="flex items-center justify-center gap-2 sm:gap-3 border border-zinc-700 py-2 sm:py-3 text-[9px] sm:text-[10px] uppercase tracking-widest text-zinc-300 hover:bg-zinc-800 hover:text-amber-500 transition-all">
                  <Code className="w-3 h-3" /> Phone
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
