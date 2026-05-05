import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Package, Search, Filter, Check, X, Truck, MapPin, Phone, Mail, Calendar, ShoppingBag, ChevronRight, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API_URL from '../../config/api';

const AdminOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${API_URL}/api/admin/orders`, {
          credentials: 'include'
        });
        if (response.ok) {
          const data = await response.json();
          setOrders(data);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order._id?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return 'bg-emerald-500/20 text-emerald-500 border-emerald-500/20';
      case 'Cancelled': return 'bg-red-500/20 text-red-500 border-red-500/20';
      case 'Processing': return 'bg-amber-500/20 text-amber-500 border-amber-500/20';
      case 'Shipped': return 'bg-blue-500/20 text-blue-500 border-blue-500/20';
      case 'Confirmed': return 'bg-purple-500/20 text-purple-500 border-purple-500/20';
      default: return 'bg-zinc-500/20 text-zinc-500 border-zinc-500/20';
    }
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
        // Refresh orders
        const ordersResponse = await fetch(`${API_URL}/api/admin/orders`, {
          credentials: 'include'
        });
        if (ordersResponse.ok) {
          const data = await ordersResponse.json();
          setOrders(data);
        }
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center text-zinc-100">
        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 p-6 md:p-10 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/admin-home')} className="p-2 hover:bg-zinc-900 rounded-full transition-colors">
            <ArrowLeft size={20} className="text-zinc-400" />
          </button>
          <div>
            <h1 className="text-2xl font-serif italic tracking-tight">All Orders</h1>
            <p className="text-zinc-500 text-[10px] uppercase tracking-[0.3em] mt-1">Total: {orders.length}</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 w-4 h-4" />
          <input
            type="text"
            placeholder="Search by customer name or order ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-sm focus:border-amber-600/50 outline-none transition-all"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:border-amber-600/50 outline-none transition-all"
        >
          <option value="all">All Status</option>
          <option value="Processing">Processing</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-zinc-900/30 border border-zinc-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] uppercase tracking-widest text-zinc-600 border-b border-zinc-900">
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Products</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filteredOrders.length > 0 ? filteredOrders.map((order) => (
                <tr
                  key={order._id}
                  onClick={() => setSelectedOrder(order)}
                  className="border-b border-zinc-900/50 hover:bg-zinc-800/30 transition-colors cursor-pointer"
                >
                  <td className="px-6 py-4 font-mono text-zinc-400 text-xs">
                    #{order._id?.slice(-8).toUpperCase() || 'N/A'}
                  </td>
                  <td className="px-6 py-4 font-medium">{order.user?.name || 'Unknown'}</td>
                  <td className="px-6 py-4 text-zinc-400">
                    <div className="space-y-2 max-w-[250px]">
                      {order.products?.map((p, idx) => (
                        <div key={idx} className="flex flex-col gap-0.5">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-zinc-300">{p.product?.name || 'Unknown'}</span>
                            <span className="text-[10px] text-amber-600 font-bold">x{p.quantity}</span>
                          </div>
                          <div className="flex items-center gap-2 text-[10px] text-zinc-500">
                            {p.product?.brand && <span>{p.product.brand}</span>}
                            {p.product?.type && <span className="text-zinc-600">• {p.product.type}</span>}
                            {p.unit && <span className="text-zinc-600">• {p.unit}</span>}
                          </div>
                          <div className="text-[10px] text-zinc-600">
                            ₹{(p.product?.type === 'chai patti' || p.product?.type === 'chai_patti' || p.product?.name?.toLowerCase().includes('chai') 
                              ? (p.price / 5) 
                              : p.price)?.toLocaleString()} / {p.product?.type === 'chai patti' || p.product?.type === 'chai_patti' || p.product?.name?.toLowerCase().includes('chai') ? 'kg' : 'unit'}
                          </div>
                        </div>
                      )) || '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono">₹{order.totalAmount?.toLocaleString() || 0}</td>
                  <td className="px-6 py-4 text-zinc-400 text-xs">
                    {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-bold border ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                    {order.status === 'Confirmed' && (
                      <p className="text-[10px] text-purple-500 mt-1 font-medium">Awaiting Delivery</p>
                    )}
                    {order.status === 'Delivered' && (
                      <p className="text-[10px] text-emerald-500 mt-1 font-medium">✓ Delivered</p>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {order.status === 'Processing' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => updateOrderStatus(order._id, 'Confirmed')}
                          className="p-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-500 rounded-lg transition-colors"
                          title="Confirm Order"
                        >
                          <Check size={18} />
                        </button>
                        <button
                          onClick={() => updateOrderStatus(order._id, 'Cancelled')}
                          className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-500 rounded-lg transition-colors"
                          title="Reject Order"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    )}
                    {order.status === 'Confirmed' && (
                      <button
                        onClick={() => updateOrderStatus(order._id, 'Delivered')}
                        className="flex items-center gap-2 px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-500 rounded-lg transition-colors text-xs font-bold uppercase tracking-wider"
                        title="Mark as Delivered"
                      >
                        <Truck size={16} />
                        Deliver
                      </button>
                    )}
                    {order.status === 'Delivered' && (
                      <span className="text-[10px] text-emerald-500 font-medium">Completed</span>
                    )}
                    {order.status === 'Cancelled' && (
                      <span className="text-[10px] text-red-500 font-medium">Rejected</span>
                    )}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-zinc-500">No orders found</td>
                </tr>
              )}
            </tbody>
          </table>
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
                <span className={`px-4 py-2 rounded-full text-sm uppercase tracking-widest font-bold ${getStatusColor(selectedOrder.status)}`}>
                  {selectedOrder.status}
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

export default AdminOrders;
