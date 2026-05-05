import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {useNavigate, Link} from 'react-router-dom';
import { Settings, Package, Heart, MapPin, LogOut, ShieldCheck, Clock, Trash2, X } from 'lucide-react';
import ThemeToggle from '../common/ThemeToggle';
import API_URL from '../../config/api';

const UserProfile = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    name: "",
    email: "",
    memberSince: "",
    orders: []
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleLogout = async () => {
    try {
      const response = await fetch(`${API_URL}/api/auth/user/logout`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (response.status === 200) {
        navigate('/');
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  }

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`${API_URL}/api/user/delete-account`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        navigate('/');
      } else {
        console.error('Failed to delete account');
      }
    } catch (error) {
      console.error('Error deleting account:', error);
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  }

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`${API_URL}/api/user/profile`, {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        if (response.status === 401) {
          navigate('/');
          return;
        }
        
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };
    fetchProfile();
  }, [navigate]);

  return (
    <div className="min-h-[120vh] bg-[#0c0a09] text-zinc-100 p-4 sm:p-6 md:p-12 lg:p-20">
      <div className="max-w-7xl mx-auto pt-12 sm:pt-16">
        
        {/* HEADER SECTION */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 sm:mb-12 gap-4 sm:gap-6">
          <div>
            <motion.span 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              className="text-amber-500 text-[9px] sm:text-[10px] uppercase tracking-[0.4em] font-bold"
            >
              Member Archive
            </motion.span>
            <motion.h1 
              initial={{ y: 20, opacity: 0 }} 
              animate={{ y: 0, opacity: 1 }}
              className="text-3xl sm:text-4xl md:text-5xl font-serif italic mt-2"
            >
              Hello, {data.name ? data.name : 'Guest'}...
            </motion.h1>
          </div>
          <div className="flex items-center gap-3 sm:gap-4">
            <button onClick={handleLogout} className="flex items-center gap-2 text-[9px] sm:text-[10px] uppercase tracking-widest text-zinc-500 hover:text-red-500 transition-colors">
              <LogOut className="w-3 h-3 sm:w-4 sm:h-4" /> Sign Out
            </button>
            <button onClick={() => setShowDeleteModal(true)} className="flex items-center gap-2 text-[9px] sm:text-[10px] uppercase tracking-widest text-zinc-500 hover:text-red-500 transition-colors">
              <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" /> Delete Account
            </button>
            <ThemeToggle />
          </div>
        </header>

        {/* MAIN BENTO GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          
          {/* PROFILE SUMMARY CARD */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="md:col-span-1 bg-zinc-900/40 border border-zinc-800 p-6 sm:p-8 rounded-2xl sm:rounded-3xl backdrop-blur-sm flex flex-col justify-between"
          >
            <div className="space-y-4 sm:space-y-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-amber-600 to-amber-900 flex items-center justify-center text-2xl sm:text-3xl font-serif italic border-4 border-zinc-900">
                {data.name ? data.name.charAt(0) : '?'}
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-medium">{data.name || 'Guest'}</h2>
                <p className="text-zinc-500 text-xs sm:text-sm">{data.email || ''}</p>
              </div>
            </div>
            <div className="mt-8 sm:mt-12 pt-4 sm:pt-6 border-t border-zinc-800 space-y-3 sm:space-y-4">
               <div className="flex justify-between text-[9px] sm:text-[10px] uppercase tracking-widest text-zinc-500">
                  <span>Heritage Member</span>
                  <span className="text-amber-500 italic">Est. {data.createdAt ? new Date(data.createdAt).getFullYear() : '2024'}</span>
               </div>
            </div>
          </motion.div>

          {/* RECENT ORDERS CARD */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="md:col-span-2 bg-zinc-900/40 border border-zinc-800 p-6 sm:p-8 rounded-2xl sm:rounded-3xl backdrop-blur-sm"
          >
            <div className="flex justify-between items-center mb-6 sm:mb-8">
              <h3 className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm uppercase tracking-widest font-bold">
                <Package className="w-3 h-3 sm:w-4 sm:h-4 text-amber-500" /> Recent Orders
              </h3>
              <Link to='/user-recentOrders'>
              <span className="text-[9px] sm:text-[10px] text-zinc-500 underline cursor-pointer">View All</span>
              </Link>
            </div>
            
            <div className="space-y-3 sm:space-y-4">
              { (data.orders || []).length === 0 ? (
                <p className="text-zinc-500 text-sm text-center py-8">No orders yet</p>
              ) : (
                data.orders.slice(0, 5).map((order) => {
                  const orderDate = new Date(order.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric'
                  });
                  const orderId = `#GS-${order._id?.toString().slice(-4).toUpperCase() || '0000'}`;
                  const amount = `₹${order.totalAmount?.toLocaleString() || 0}`;

                  return (
                    <div key={order._id} className="flex justify-between items-center p-3 sm:p-4 rounded-xl bg-zinc-950/50 border border-zinc-900 hover:border-zinc-700 transition-colors">
                      <div>
                        <p className="text-[10px] sm:text-xs font-mono text-zinc-400">{orderId}</p>
                        <p className="text-xs sm:text-sm font-medium">{orderDate}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs sm:text-sm font-serif italic text-amber-500">{amount}</p>
                        <p className={`text-[8px] sm:text-[9px] uppercase tracking-tighter ${
                          order.status === 'Delivered' ? 'text-emerald-500' :
                          order.status === 'Cancelled' ? 'text-red-500' :
                          order.status === 'Processing' ? 'text-amber-500' :
                          'text-zinc-500'
                        }`}>{order.status}</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>

          {/* QUICK LINKS BENTO */}
          <div className="md:col-span-3 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6">
            {[
              { icon: Heart, label: "Wishlist", count: "12 Items", link: "/wishlist" },
              { icon: MapPin, label: "Addresses", count: `${(data.addresses || []).length} Saved`, link: "/user-addresses" },
              { icon: ShieldCheck, label: "Security", count: "Verified", link: "/security" },
              { icon: Settings, label: "Settings", count: "Personal", link: "/settings" }
            ].map((item, idx) => (
              item.link ? (
                <Link to={item.link} key={idx}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="p-4 sm:p-6 bg-zinc-900/20 border border-zinc-800 rounded-xl sm:rounded-2xl hover:bg-zinc-900/40 hover:border-amber-600/50 transition-all cursor-pointer group"
                  >
                    <div className="flex items-start justify-between">
                      <item.icon className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 mb-3 sm:mb-4 group-hover:scale-110 transition-transform" />
                      <span className="text-[8px] uppercase tracking-widest text-zinc-500 group-hover:text-amber-500 transition-colors">View</span>
                    </div>
                    <h4 className="text-[9px] sm:text-[10px] uppercase tracking-widest font-bold mb-1">{item.label}</h4>
                    <p className="text-[10px] sm:text-xs text-zinc-500">{item.count}</p>
                  </motion.div>
                </Link>
              ) : (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.02 }}
                  className="p-4 sm:p-6 bg-zinc-900/20 border border-zinc-800 rounded-xl sm:rounded-2xl hover:bg-zinc-900/40 transition-all cursor-pointer group"
                >
                  <item.icon className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 mb-3 sm:mb-4 group-hover:scale-110 transition-transform" />
                  <h4 className="text-[9px] sm:text-[10px] uppercase tracking-widest font-bold mb-1">{item.label}</h4>
                  <p className="text-[10px] sm:text-xs text-zinc-500">{item.count}</p>
                </motion.div>
              )
            ))}
          </div>

        </div>

        {/* FOOTER ACCENT */}
        <footer className="mt-12 sm:mt-20 py-6 sm:py-8 border-t border-zinc-900 flex justify-between items-center opacity-30 text-[9px] sm:text-[10px] uppercase tracking-[0.3em]">
          <p> 2026 Gupta Sales Heritage</p>
          <p>Privacy Policy</p>
        </footer>
      </div>

      {/* Delete Account Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowDeleteModal(false)}></div>
          <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-200 transition-colors"
            >
              <X size={20} />
            </button>
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-red-500/10 rounded-xl border border-red-500/20">
                <Trash2 className="text-red-500" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-zinc-100">Delete Account</h3>
                <p className="text-zinc-500 text-sm mt-1">This action cannot be undone</p>
              </div>
            </div>
            <p className="text-zinc-400 text-sm leading-relaxed mb-6">
              Are you sure you want to permanently delete your account? All your orders, addresses, and personal data will be removed from our database.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="flex-1 py-3 px-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={isDeleting}
                className="flex-1 py-3 px-4 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;