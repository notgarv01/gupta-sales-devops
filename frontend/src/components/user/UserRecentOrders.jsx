import React, { useState, useEffect } from 'react';
import { Package, ChevronRight, Clock, CheckCircle2, Truck, AlertCircle, ArrowLeft, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import Toast, { useToast } from '../common/Toast';
import API_URL from '../../config/api';

const UserRecentOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState(null);
  const { toast, showToast, hideToast } = useToast();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${API_URL}/api/user/orders`, {
          credentials: 'include',
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

  const handleCancelClick = (orderId) => {
    setOrderToCancel(orderId);
    setShowConfirmModal(true);
  };

  const cancelOrder = async () => {
    if (!orderToCancel) return;

    setShowConfirmModal(false);
    setCancellingId(orderToCancel);
    try {
      const response = await fetch(`${API_URL}/api/user/orders/${orderToCancel}/cancel`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        setOrders(orders.map(order =>
          order._id === orderToCancel ? { ...order, status: 'Cancelled' } : order
        ));
        showToast('Order cancelled successfully', 'success');
      } else {
        const data = await response.json();
        showToast(data.message || 'Failed to cancel order', 'error');
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
      showToast('Failed to cancel order', 'error');
    } finally {
      setCancellingId(null);
      setOrderToCancel(null);
    }
  };

  const getStatusStyle = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
      case 'cancelled': return 'text-red-500 bg-red-500/10 border-red-500/20';
      case 'processing': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      case 'shipped': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      default: return 'text-zinc-500 bg-zinc-500/10 border-zinc-500/20';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0c0a09] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-amber-600/20 border-t-amber-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0c0a09] text-zinc-100 font-sans pb-20">
      <Toast message={toast.message} type={toast.type} onClose={hideToast} />

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowConfirmModal(false)}></div>
          <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <X className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-zinc-100 mb-2">Cancel Order?</h3>
              <p className="text-zinc-400 text-sm mb-6">Are you sure you want to cancel this order? This action cannot be undone.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1 py-3 px-6 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-xl transition-all"
                >
                  Keep Order
                </button>
                <button
                  onClick={cancelOrder}
                  className="flex-1 py-3 px-6 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl transition-all"
                >
                  Cancel Order
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="border-b border-zinc-800/50 bg-[#0c0a09]/80 backdrop-blur-md sticky top-0 z-10 px-6 py-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/user-home" className="p-2 hover:bg-zinc-900 rounded-full transition-colors">
              <ArrowLeft size={20} className="text-zinc-400" />
            </Link>
            <h1 className="text-2xl font-serif italic tracking-wide">My Orders</h1>
          </div>
          <div className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 font-bold">
            Total Orders: {orders.length}
          </div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-6 pt-10">
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mb-6 border border-zinc-800">
              <Package size={32} className="text-zinc-700" />
            </div>
            <h2 className="text-xl font-bold text-zinc-300">No orders yet</h2>
            <p className="text-zinc-500 mt-2 max-w-xs">When you place an order, it will appear here for you to track.</p>
            <Link to="/user-home" className="mt-8 bg-amber-600 text-black px-8 py-3 rounded-xl font-bold text-sm hover:bg-amber-500 transition-all">
              START SHOPPING
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="group bg-zinc-900/40 border border-zinc-800/50 rounded-2xl overflow-hidden hover:border-zinc-700 transition-all shadow-xl">
                {/* Order Top Bar */}
                <div className="px-6 py-4 border-b border-zinc-800/50 bg-zinc-900/20 flex flex-wrap justify-between items-center gap-4">
                  <div className="flex items-center gap-6">
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Order ID</p>
                      <p className="text-sm font-mono text-zinc-300 mt-1">#{order._id.slice(-8).toUpperCase()}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Placed On</p>
                      <p className="text-sm text-zinc-300 mt-1">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                    </div>
                  </div>
                  <div className={`px-4 py-1.5 rounded-full text-[10px] uppercase tracking-widest font-black border ${getStatusStyle(order.status)}`}>
                    {order.status}
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex gap-4 items-center">
                          <div className="w-16 h-16 bg-zinc-950 rounded-lg border border-zinc-800 overflow-hidden shrink-0">
                            <img src={item.product?.image} alt="" className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-bold text-zinc-200 truncate">{item.product?.name}</h4>
                            <p className="text-xs text-zinc-500 mt-0.5">Quantity: {item.quantity}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Pricing & Actions */}
                    <div className="flex flex-col justify-between items-end gap-3">
                      <div className="text-right">
                        <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Amount Paid</p>
                        <p className="text-2xl font-bold text-amber-600 font-mono mt-1 tracking-tighter">₹{order.totalAmount.toLocaleString()}</p>
                      </div>

                      {order.status === 'Processing' && (
                        <button
                          onClick={() => handleCancelClick(order._id)}
                          disabled={cancellingId === order._id}
                          className="flex items-center gap-2 px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-500 text-xs font-bold uppercase tracking-widest rounded-lg transition-all disabled:opacity-50"
                        >
                          {cancellingId === order._id ? (
                            <div className="w-4 h-4 border-2 border-red-500/20 border-t-red-500 rounded-full animate-spin"></div>
                          ) : (
                            <X size={14} />
                          )}
                          Cancel Order
                        </button>
                      )}

                      <button className="flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-zinc-100 transition-colors group/btn">
                        VIEW DETAILS <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Progress Mini-Bar (Visual Only) */}
                <div className="h-1 w-full bg-zinc-800">
                  <div
                    className={`h-full transition-all duration-1000 ${order.status === 'Delivered' ? 'bg-emerald-500' : order.status === 'Cancelled' ? 'bg-red-500' : 'bg-amber-600'}`}
                    style={{ width: order.status.toLowerCase() === 'delivered' ? '100%' : '40%' }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default UserRecentOrders;