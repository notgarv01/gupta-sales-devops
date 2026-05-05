import React from 'react';
import { CheckCircle, Home, Package, PhoneCall, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const OrderSuccess = () => {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-zinc-100 flex items-center justify-center px-6">
      {/* Background Ambient Glow */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-600/10 blur-[120px] rounded-full -z-10"></div>

      <div className="max-w-md w-full text-center space-y-8">
        
        {/* Animated Icon Section */}
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-amber-500/20 blur-2xl rounded-full scale-150 animate-pulse"></div>
          <div className="relative bg-zinc-900 border border-zinc-800 p-6 rounded-full inline-flex items-center justify-center">
            <CheckCircle className="text-amber-500 w-16 h-16" strokeWidth={1.5} />
          </div>
        </div>

        {/* Text Content */}
        <div className="space-y-4">
          <h1 className="text-4xl font-serif italic tracking-tight text-white">
            Order Placed!
          </h1>
          <p className="text-zinc-400 leading-relaxed">
            Thank you for shopping with us. Your order has been successfully recorded and is being processed.
          </p>
        </div>

        {/* Contact Notice Card */}
        <div className="bg-zinc-900/50 border border-zinc-800/50 p-5 rounded-2xl flex items-start gap-4 text-left">
          <div className="p-2 bg-amber-500/10 rounded-lg shrink-0">
            <PhoneCall size={18} className="text-amber-500" />
          </div>
          <div>
            <p className="text-sm font-semibold text-zinc-200">What happens next?</p>
            <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
              Our team will review your order details. <span className="text-amber-500/80 font-medium">We will contact you shortly</span> if any additional details or verification are needed.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 pt-4">
          <Link 
            to="/user-home" 
            className="group flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-500 text-black py-4 rounded-xl font-bold transition-all shadow-lg shadow-amber-900/20"
          >
            <Home size={18} />
            BACK TO HOME
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <Link 
            to="/user-recentOrders" 
            className="flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 py-4 rounded-xl font-bold border border-zinc-800 transition-all"
          >
            <Package size={18} />
            VIEW MY ORDERS
          </Link>
        </div>

        {/* Footer info */}
        <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-600 font-bold">
          Gupta Sales &bull; Premium Quality
        </p>
      </div>
    </div>
  );
};

export default OrderSuccess;