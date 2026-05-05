import { useEffect, useState } from 'react';
import { useNavigate ,Link} from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  TrendingUp, Users, Package, DollarSign,
  AlertTriangle, ShoppingCart, Activity, LogOut, Check, X, MapPin, Phone, Mail, Calendar, ShoppingBag, ChevronRight
} from 'lucide-react';
import ThemeToggle from '../common/ThemeToggle';
import API_URL from '../../config/api';

const AdminHome = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalProducts: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [showAllOrdersModal, setShowAllOrdersModal] = useState(false);
  const [orderFilter, setOrderFilter] = useState('all'); // all, processing, confirmed, delivered, cancelled
  const [showRejectedOrders, setShowRejectedOrders] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsResponse, ordersResponse] = await Promise.all([
          fetch(`${API_URL}/api/admin/dashboard-stats`, {
            credentials: 'include'
          }),
          fetch(`${API_URL}/api/admin/orders`, {
            credentials: 'include'
          })
        ]);
        
        if (statsResponse.status === 200) {
          const data = await statsResponse.json();
          setStats(data.stats);
        }
        
        if (ordersResponse.status === 200) {
          const ordersData = await ordersResponse.json();
          setRecentOrders(ordersData);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatCurrency = (amount) => {
    return '₹' + amount.toLocaleString('en-IN');
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      const response = await fetch(`${API_URL}/api/admin/orders/${orderId}/status`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (response.ok) {
        // Refresh orders data from full orders endpoint
        const ordersResponse = await fetch(`${API_URL}/api/admin/orders`, {
          credentials: 'include'
        });
        if (ordersResponse.status === 200) {
          const ordersData = await ordersResponse.json();
          setRecentOrders(ordersData);
        }
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const dashboardStats = [
    { label: 'Total Revenue', value: formatCurrency(stats.totalRevenue), grow: '+12%', icon: DollarSign, link: null },
    { label: 'Total Orders', value: stats.totalOrders.toString(), grow: '+8%', icon: ShoppingCart, link: '/admin/orders' },
    { label: 'Active Customers', value: stats.totalUsers.toString(), grow: '+14%', icon: Users, link: '/admin/customers' },
    { label: 'Products', value: stats.totalProducts.toString(), grow: '+5%', icon: Package, link: '/admin/products' },
  ];

  const handleLogout = async () => {
    try {
      const response = await fetch(`${API_URL}/api/auth/admin/logout`, {
        method: 'GET',
        credentials: 'include'
      });
      
      if (response.status === 200) {
        navigate('/');
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center text-zinc-100">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm text-zinc-500 uppercase tracking-widest">Loading Dashboard...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 p-6 md:p-10 lg:p-12 font-sans">
      
      {/* HEADER: COMMAND CENTER BAR */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 md:mb-12 gap-4 md:gap-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif italic tracking-tight">Admin Console.</h1>
          <p className="text-zinc-500 text-[9px] sm:text-[10px] uppercase tracking-[0.3em] mt-1">Gupta Sales Operations • 2026</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 md:gap-3">
          <button className="px-3 sm:px-4 py-2 bg-zinc-900 border border-zinc-800 text-[9px] sm:text-[10px] uppercase tracking-widest hover:bg-zinc-800 transition-all">Download Report</button>
          <button onClick={() => navigate('/admin/add-product')} className="px-3 sm:px-4 py-2 bg-amber-600 text-white text-[9px] sm:text-[10px] uppercase tracking-widest font-bold hover:bg-amber-500 transition-all">Add Product +</button>
          <button onClick={handleLogout} className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-zinc-900 border border-zinc-800 text-[9px] sm:text-[10px] uppercase tracking-widest text-zinc-500 hover:text-red-500 hover:border-red-500/50 transition-all">
            <LogOut className="w-3 h-3 sm:w-4 sm:h-4" /> Sign Out
          </button>
          <ThemeToggle />
        </div>
      </header>

      {/* STATS GRID */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-10">
        {dashboardStats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-zinc-900/50 border border-zinc-800 p-4 sm:p-6 rounded-2xl"
          >
            <div className="flex justify-between items-start mb-3 sm:mb-4">
              <div className="p-2 bg-zinc-950 rounded-lg">
                <stat.icon className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
              </div>
              <span className={`text-[9px] sm:text-[10px] font-bold ${stat.grow.startsWith('+') ? 'text-emerald-500' : 'text-red-500'}`}>
                {stat.grow}
              </span>
            </div>
            <p className="text-zinc-500 text-[9px] sm:text-[10px] uppercase tracking-widest">{stat.label}</p>
            <h3 className="text-xl sm:text-2xl font-semibold mt-1 font-mono tracking-tighter">{stat.value}</h3>
            {stat.link && (
              <Link
                to={stat.link}
                className="inline-block mt-3 text-[9px] sm:text-[10px] text-amber-500 hover:text-amber-400 font-bold uppercase tracking-widest transition-colors"
              >
                View All →
              </Link>
            )}
          </motion.div>
        ))}
      </div>

      {/* MAIN DATA SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        
        {/* RECENT SALES TABLE */}
        <div className="lg:col-span-2 bg-zinc-900/30 border border-zinc-800 rounded-2xl overflow-hidden backdrop-blur-md">
          <div className="p-4 sm:p-6 border-b border-zinc-800 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <h4 className="text-[10px] sm:text-xs uppercase tracking-[0.2em] font-bold">Live Order Stream</h4>
              <Activity className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-500 animate-pulse" />
            </div>
            <button 
              onClick={() => navigate('/admin/orders')}
              className="text-[9px] sm:text-[10px] uppercase tracking-widest text-amber-500 hover:text-amber-400 font-bold transition-colors"
            >
              View All →
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[9px] sm:text-[10px] uppercase tracking-widest text-zinc-600 border-b border-zinc-900">
                  <th className="px-4 sm:px-6 py-3 sm:py-4">Customer</th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4">Product</th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4">Amount</th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4">Status</th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="text-[10px] sm:text-xs">
                {recentOrders.filter(o => o.status === 'Processing').length > 0 ? recentOrders.filter(o => o.status === 'Processing').slice(0, 10).map((order, i) => (
                  <tr
                    key={order._id || i}
                    onClick={() => setSelectedOrder(order)}
                    className="border-b border-zinc-900/50 hover:bg-zinc-800/30 transition-colors cursor-pointer"
                  >
                    <td className="px-4 sm:px-6 py-3 sm:py-4 font-medium">{order.user?.name || order.user}</td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-zinc-400 truncate max-w-[150px]">
                      {order.products?.map(p => p.product?.name || p.product).join(', ') || '-'}
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 font-mono">₹{order.totalAmount?.toLocaleString() || order.price}</td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4">
                      <span className={`px-2 py-1 rounded-full text-[8px] sm:text-[9px] uppercase tracking-tighter ${
                        order.status === 'Confirmed' ? 'bg-emerald-500/20 text-emerald-500' :
                        order.status === 'Delivered' ? 'bg-emerald-500/20 text-emerald-500' :
                        order.status === 'Cancelled' ? 'bg-red-500/20 text-red-500' :
                        order.status === 'Processing' ? 'bg-amber-500/20 text-amber-500' :
                        'bg-zinc-800 text-zinc-400'
                      }`}>
                        {order.status || 'Processing'}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4">
                      {order.status === 'Processing' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => updateOrderStatus(order._id, 'Confirmed')}
                            className="p-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-500 rounded transition-colors"
                            title="Confirm Order"
                          >
                            <Check size={14} />
                          </button>
                          <button
                            onClick={() => updateOrderStatus(order._id, 'Cancelled')}
                            className="p-1 bg-red-500/20 hover:bg-red-500/30 text-red-500 rounded transition-colors"
                            title="Reject Order"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="5" className="px-4 sm:px-6 py-6 sm:py-8 text-center text-zinc-500">No pending orders</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ORDER STATUS & ANALYTICS */}
        <div className="space-y-6 md:space-y-8">
          {/* Toggle Button */}
          <div className="bg-zinc-900/30 border border-zinc-800 p-1 rounded-xl flex">
            <button
              onClick={() => setShowRejectedOrders(false)}
              className={`flex-1 py-2 px-4 rounded-lg text-[10px] sm:text-xs uppercase tracking-widest font-bold transition-all ${
                !showRejectedOrders
                  ? 'bg-amber-600 text-black'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Delivered
            </button>
            <button
              onClick={() => setShowRejectedOrders(true)}
              className={`flex-1 py-2 px-4 rounded-lg text-[10px] sm:text-xs uppercase tracking-widest font-bold transition-all ${
                showRejectedOrders
                  ? 'bg-red-500 text-white'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Rejected
            </button>
          </div>

          {/* Orders Display */}
          <div className="bg-zinc-900/30 border border-zinc-800 p-4 sm:p-6 rounded-2xl">
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <h4 className="text-[9px] sm:text-[10px] uppercase tracking-widest font-bold flex items-center gap-2">
                {showRejectedOrders ? (
                  <>
                    <X className="w-3 h-3 text-red-500" /> Rejected Orders
                  </>
                ) : (
                  <>
                    <Check className="w-3 h-3 text-emerald-500" /> Delivered Orders
                  </>
                )}
              </h4>
              <span className="text-xl sm:text-2xl font-mono font-bold text-zinc-100">
                {showRejectedOrders 
                  ? recentOrders.filter(o => o.status === 'Cancelled').length 
                  : recentOrders.filter(o => o.status === 'Delivered').length
                }
              </span>
            </div>
            
            <div className="space-y-3 sm:space-y-4 max-h-[200px] overflow-y-auto">
              {(showRejectedOrders
                ? recentOrders.filter(o => o.status === 'Cancelled')
                : recentOrders.filter(o => o.status === 'Delivered')
              ).slice(0, 5).map((order, i) => (
                <div
                  key={order._id || i}
                  onClick={() => setSelectedOrder(order)}
                  className={`p-3 bg-zinc-950/50 rounded-lg border border-zinc-800/50 cursor-pointer hover:bg-zinc-900/50 hover:border-amber-600/30 transition-all group`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] text-zinc-400">{order.user?.name || order.user}</span>
                    <span className="font-mono text-amber-600 text-sm font-bold flex items-center gap-1">
                      ₹{order.totalAmount?.toLocaleString() || order.price}
                      <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500 truncate">
                    {order.products?.map(p => p.product?.name || p.product).join(', ') || '-'}
                  </p>
                  <p className="text-[10px] text-zinc-600 mt-1">
                    {new Date(order.createdAt).toLocaleDateString('en-IN')}
                  </p>
                </div>
              ))}
              {(showRejectedOrders
                ? recentOrders.filter(o => o.status === 'Cancelled')
                : recentOrders.filter(o => o.status === 'Delivered')
              ).length === 0 && (
                <p className="text-zinc-500 text-[10px] sm:text-[11px] text-center py-4">
                  No {showRejectedOrders ? 'rejected' : 'delivered'} orders yet
                </p>
              )}
            </div>
          </div>

          {/* Total Revenue Preview */}
          <div className="bg-gradient-to-br from-amber-600 to-amber-900 p-4 sm:p-6 rounded-2xl text-white">
            <div className="flex justify-between items-start mb-4 sm:mb-6">
              <h4 className="text-[9px] sm:text-[10px] uppercase tracking-widest font-bold">
                {showRejectedOrders ? 'Lost Revenue' : 'Revenue'}
              </h4>
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 opacity-50" />
            </div>
            <p className="text-2xl sm:text-3xl font-serif italic mb-2">
              ₹{(showRejectedOrders 
                ? recentOrders.filter(o => o.status === 'Cancelled').reduce((sum, o) => sum + (o.totalAmount || 0), 0)
                : recentOrders.filter(o => o.status === 'Delivered').reduce((sum, o) => sum + (o.totalAmount || 0), 0)
              ).toLocaleString()}
            </p>
            <p className="text-[9px] sm:text-[10px] uppercase tracking-widest opacity-80">
              {showRejectedOrders ? 'From cancelled orders' : 'From completed orders'}
            </p>
          </div>
        </div>

      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedOrder(null)}></div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="p-6 border-b border-zinc-800 flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold text-zinc-100">Order Details</h2>
                <p className="text-zinc-500 text-sm mt-1 font-mono">#{selectedOrder._id?.slice(-8).toUpperCase()}</p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 hover:bg-zinc-800 rounded-full transition-colors text-zinc-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)] space-y-6">
              {/* Status Badge */}
              <div className="flex items-center gap-3">
                <span className={`px-4 py-2 rounded-full text-sm uppercase tracking-widest font-bold ${
                  selectedOrder.status === 'Confirmed' || selectedOrder.status === 'Delivered' ? 'bg-emerald-500/20 text-emerald-500' :
                  selectedOrder.status === 'Cancelled' ? 'bg-red-500/20 text-red-500' :
                  selectedOrder.status === 'Processing' ? 'bg-amber-500/20 text-amber-500' :
                  'bg-zinc-800 text-zinc-400'
                }`}>
                  {selectedOrder.status || 'Processing'}
                </span>
                <span className="text-zinc-500 text-sm flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(selectedOrder.createdAt).toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>

              {/* Customer Information */}
              <div className="bg-zinc-950/50 rounded-xl p-4 border border-zinc-800/50">
                <h3 className="text-xs uppercase tracking-widest text-zinc-500 mb-4 font-bold flex items-center gap-2">
                  <Users className="w-4 h-4" /> Customer Information
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-amber-600/20 rounded-full flex items-center justify-center text-amber-500 font-bold text-lg">
                      {selectedOrder.user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div>
                      <p className="text-zinc-100 font-medium text-lg">{selectedOrder.user?.name || 'Unknown'}</p>
                      {selectedOrder.user?.shopName && (
                        <p className="text-zinc-500 text-sm">{selectedOrder.user.shopName}</p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-zinc-800/50">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-zinc-900 rounded-lg">
                        <Mail className="w-4 h-4 text-zinc-400" />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-widest text-zinc-500">Email</p>
                        <p className="text-zinc-300 text-sm">{selectedOrder.user?.email || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-zinc-900 rounded-lg">
                        <Phone className="w-4 h-4 text-zinc-400" />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-widest text-zinc-500">Phone</p>
                        <p className="text-zinc-300 text-sm">{selectedOrder.user?.phone || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="bg-zinc-950/50 rounded-xl p-4 border border-zinc-800/50">
                <h3 className="text-xs uppercase tracking-widest text-zinc-500 mb-4 font-bold flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> Delivery Address
                </h3>
                {selectedOrder.user?.addresses && selectedOrder.user.addresses.length > 0 ? (
                  <div className="space-y-2">
                    {selectedOrder.user.addresses.map((addr, i) => (
                      <div key={i} className={`p-3 rounded-lg border ${addr.isDefault ? 'border-amber-600/50 bg-amber-600/10' : 'border-zinc-800/50'}`}>
                        <p className="text-zinc-300 text-sm">{addr.address}</p>
                        <p className="text-zinc-500 text-xs mt-1">Pincode: {addr.pincode}</p>
                        {addr.isDefault && (
                          <span className="text-[10px] uppercase tracking-widest text-amber-500 mt-2 inline-block">Default</span>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-zinc-500 text-sm">No address available</p>
                )}
              </div>

              {/* Products */}
              <div className="bg-zinc-950/50 rounded-xl p-4 border border-zinc-800/50">
                <h3 className="text-xs uppercase tracking-widest text-zinc-500 mb-4 font-bold flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4" /> Order Items
                </h3>
                <div className="space-y-3">
                  {selectedOrder.products?.map((item, i) => (
                    <div key={i} className="flex items-center gap-4 p-3 bg-zinc-900/50 rounded-lg border border-zinc-800/30">
                      {item.product?.image && (
                        <img
                          src={item.product.image}
                          alt={item.product?.name || 'Product'}
                          className="w-16 h-16 object-cover rounded-lg border border-zinc-700"
                        />
                      )}
                      <div className="flex-1">
                        <p className="text-zinc-100 font-medium">{item.product?.name || 'Unknown Product'}</p>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-zinc-500 text-xs">Qty: {item.quantity} {item.unit || ''}</span>
                          <span className="text-zinc-400 text-xs">@ ₹{item.price?.toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-amber-500 font-mono font-bold">₹{item.total?.toLocaleString() || (item.quantity * item.price)?.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-zinc-950/50 rounded-xl p-4 border border-zinc-800/50">
                <h3 className="text-xs uppercase tracking-widest text-zinc-500 mb-4 font-bold">Order Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-400 text-sm">Subtotal</span>
                    <span className="text-zinc-300 font-mono">₹{selectedOrder.totalAmount?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-400 text-sm">Payment Method</span>
                    <span className="text-zinc-300">{selectedOrder.paymentMethod || 'COD'}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-zinc-800">
                    <span className="text-zinc-100 font-bold">Total Amount</span>
                    <span className="text-amber-500 font-mono font-bold text-xl">₹{selectedOrder.totalAmount?.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-zinc-800">
                {selectedOrder.status === 'Processing' && (
                  <>
                    <button
                      onClick={() => {
                        updateOrderStatus(selectedOrder._id, 'Confirmed');
                        setSelectedOrder(null);
                      }}
                      className="flex-1 py-3 px-6 bg-emerald-600 hover:bg-emerald-500 text-white font-bold uppercase tracking-widest rounded-lg transition-all flex items-center justify-center gap-2"
                    >
                      <Check className="w-4 h-4" /> Confirm Order
                    </button>
                    <button
                      onClick={() => {
                        updateOrderStatus(selectedOrder._id, 'Cancelled');
                        setSelectedOrder(null);
                      }}
                      className="flex-1 py-3 px-6 bg-red-600 hover:bg-red-500 text-white font-bold uppercase tracking-widest rounded-lg transition-all flex items-center justify-center gap-2"
                    >
                      <X className="w-4 h-4" /> Reject Order
                    </button>
                  </>
                )}
                {selectedOrder.status === 'Confirmed' && (
                  <button
                    onClick={() => {
                      updateOrderStatus(selectedOrder._id, 'Delivered');
                      setSelectedOrder(null);
                    }}
                    className="flex-1 py-3 px-6 bg-blue-600 hover:bg-blue-500 text-white font-bold uppercase tracking-widest rounded-lg transition-all flex items-center justify-center gap-2"
                  >
                    <Check className="w-4 h-4" /> Mark as Delivered
                  </button>
                )}
                {(selectedOrder.status === 'Delivered' || selectedOrder.status === 'Cancelled') && (
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="flex-1 py-3 px-6 bg-zinc-800 hover:bg-zinc-700 text-white font-bold uppercase tracking-widest rounded-lg transition-all"
                  >
                    Close
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
};

export default AdminHome;