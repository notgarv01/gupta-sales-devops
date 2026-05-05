import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, Mail, Phone, MapPin, Calendar, UserCheck, ShoppingBag, ExternalLink, MoreHorizontal, X, Hash } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API_URL from '../../config/api';

const AdminCustomers = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [userOrders, setUserOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [showOrders, setShowOrders] = useState(false);

  // ... (Keep your existing useEffect and fetch logic)
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch(`${API_URL}/api/admin/customers`, { credentials: 'include' });
        if (response.ok) {
          const data = await response.json();
          setCustomers(data);
        }
      } catch (error) { console.error('Error fetching customers:', error); }
      finally { setLoading(false); }
    };
    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter(customer =>
    customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const fetchUserOrders = async (userId) => {
    setOrdersLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/admin/user-orders/${userId}`, {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setUserOrders(data);
        setShowOrders(true);
      }
    } catch (error) {
      console.error('Error fetching user orders:', error);
    } finally {
      setOrdersLoading(false);
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
    <div className="min-h-screen bg-[#09090b] text-zinc-100 font-sans">
      <div className="max-w-[1600px] mx-auto p-6 md:p-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div className="flex items-center gap-5">
            <button 
              onClick={() => navigate('/admin-home')} 
              className="p-3 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-xl transition-all"
            >
              <ArrowLeft size={20} className="text-zinc-400" />
            </button>
            <div>
              <h1 className="text-3xl font-serif italic tracking-wide">Customer Directory</h1>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-zinc-500 text-[10px] uppercase tracking-[0.3em]">Management Console</span>
                <span className="h-1 w-1 bg-zinc-700 rounded-full"></span>
                <span className="text-amber-600 text-[10px] uppercase tracking-[0.3em] font-bold">{customers.length} Accounts</span>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex gap-4 w-full md:w-auto">
            <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-2xl flex-1 md:min-w-[150px]">
              <p className="text-[10px] uppercase tracking-widest text-zinc-500 mb-1">Active Now</p>
              <p className="text-xl font-mono font-bold text-emerald-500">24</p>
            </div>
            <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-2xl flex-1 md:min-w-[150px]">
              <p className="text-[10px] uppercase tracking-widest text-zinc-500 mb-1">New this month</p>
              <p className="text-xl font-mono font-bold text-amber-500">12</p>
            </div>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-zinc-900/30 border border-zinc-800 p-4 rounded-2xl mb-8 flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 w-4 h-4" />
            <input
              type="text"
              placeholder="Filter by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-12 pr-4 py-3 text-sm focus:border-amber-600/40 outline-none transition-all placeholder:text-zinc-700"
            />
          </div>
          <button className="hidden md:flex items-center gap-2 px-5 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-all">
            Export CSV
          </button>
        </div>

        {/* Customer Table */}
        <div className="bg-zinc-900/20 border border-zinc-800 rounded-3xl overflow-hidden backdrop-blur-sm shadow-2xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-900/50 border-b border-zinc-800">
                <th className="px-6 py-5 text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-black">Customer</th>
                <th className="px-6 py-5 text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-black">Contact Info</th>
                <th className="px-6 py-5 text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-black">Location</th>
                <th className="px-6 py-5 text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-black">Orders</th>
                <th className="px-6 py-5 text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-black">Activity</th>
                <th className="px-6 py-5 text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-black text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {filteredCustomers.length > 0 ? filteredCustomers.map((customer) => (
                <tr key={customer._id} onClick={() => setSelectedCustomer(customer)} className="hover:bg-amber-600/[0.02] group transition-colors cursor-pointer">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-xl flex items-center justify-center border border-zinc-700 group-hover:border-amber-600/50 transition-all">
                        <span className="text-amber-500 font-bold font-mono">
                          {customer.name?.charAt(0).toUpperCase() || 'U'}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-zinc-100">{customer.name || 'Anonymous'}</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <UserCheck size={10} className="text-emerald-500" />
                          <span className="text-[10px] text-zinc-500 uppercase font-medium">Verified User</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-zinc-300 text-xs">
                        <Mail size={12} className="text-zinc-600" />
                        <span>{customer.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-zinc-500 text-xs">
                        <Phone size={12} className="text-zinc-600" />
                        <span>{customer.phone || 'No Phone'}</span>
                      </div>
                      {customer.addresses?.[0]?.pincode && (
                        <div className="flex items-center gap-2 text-zinc-500 text-xs">
                          <MapPin size={12} className="text-zinc-600" />
                          <span>PIN: {customer.addresses[0].pincode}</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    {customer.addresses?.[0] ? (
                      <div className="flex items-start gap-2 text-zinc-400 text-xs max-w-[200px]">
                        <MapPin size={12} className="text-amber-600/50 mt-0.5 shrink-0" />
                        <span className="leading-relaxed">{customer.addresses[0].address}</span>
                      </div>
                    ) : (
                      <span className="text-zinc-700 text-xs italic">No address set</span>
                    )}
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <div className="bg-zinc-900 px-3 py-1 rounded-lg border border-zinc-800 flex items-center gap-2">
                        <ShoppingBag size={12} className="text-amber-600" />
                        <span className="text-xs font-bold font-mono">{customer.orders?.length || 0}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-zinc-500 text-[10px] uppercase font-bold tracking-tighter">
                      <Calendar size={12} />
                      {new Date(customer.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button className="p-2 text-zinc-600 hover:text-amber-500 hover:bg-amber-600/10 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                      <ExternalLink size={16} />
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="6" className="py-20 text-center text-zinc-600 text-sm italic">
                    No customers match your current filter criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Detail Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedCustomer(null)}></div>
          <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedCustomer(null)}
              className="absolute top-4 right-4 p-2 hover:bg-zinc-800 rounded-full transition-colors text-zinc-400 hover:text-white"
            >
              <X size={20} />
            </button>

            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-2xl flex items-center justify-center border border-zinc-700">
                <span className="text-amber-500 font-bold font-mono text-2xl">
                  {selectedCustomer.name?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-zinc-100">{selectedCustomer.name || 'Anonymous'}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <UserCheck size={14} className="text-emerald-500" />
                  <span className="text-xs text-zinc-500 uppercase font-medium">Verified Customer</span>
                </div>
              </div>
            </div>

            {/* Details Grid */}
            <div className="space-y-4">
              {/* Contact Info */}
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 space-y-3">
                <h3 className="text-[10px] uppercase tracking-widest text-zinc-500 font-black mb-2">Contact Information</h3>
                <div className="flex items-center gap-3 text-sm">
                  <Mail size={16} className="text-zinc-500" />
                  <span className="text-zinc-300">{selectedCustomer.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone size={16} className="text-zinc-500" />
                  <span className="text-zinc-300">{selectedCustomer.phone || 'No phone number'}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Calendar size={16} className="text-zinc-500" />
                  <span className="text-zinc-400">
                    Joined {new Date(selectedCustomer.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Hash size={16} className="text-zinc-500" />
                  <span className="text-zinc-400 font-mono text-xs">ID: {selectedCustomer._id}</span>
                </div>
              </div>

              {/* Addresses */}
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
                <h3 className="text-[10px] uppercase tracking-widest text-zinc-500 font-black mb-3">Addresses ({selectedCustomer.addresses?.length || 0})</h3>
                {selectedCustomer.addresses && selectedCustomer.addresses.length > 0 ? (
                  <div className="space-y-3">
                    {selectedCustomer.addresses.map((addr, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3 bg-zinc-950/50 rounded-lg border border-zinc-800/50">
                        <MapPin size={16} className="text-amber-600/50 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-sm text-zinc-300 leading-relaxed">{addr.address}</p>
                          <p className="text-xs text-zinc-500 mt-1">PIN: {addr.pincode}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-zinc-600 text-sm italic">No addresses saved</p>
                )}
              </div>

              {/* Orders Summary */}
              <div 
                onClick={() => fetchUserOrders(selectedCustomer._id)}
                className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 cursor-pointer hover:border-amber-600/50 transition-all group"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-[10px] uppercase tracking-widest text-zinc-500 font-black">Order History</h3>
                  <ExternalLink size={12} className="text-zinc-600 group-hover:text-amber-500 transition-colors" />
                </div>
                <div className="flex items-center gap-3">
                  <ShoppingBag size={16} className="text-amber-600" />
                  <span className="text-zinc-300 text-sm">
                    {selectedCustomer.orders?.length || 0} orders placed
                  </span>
                </div>
                {ordersLoading && (
                  <div className="mt-3 flex items-center gap-2 text-zinc-500 text-xs">
                    <div className="w-3 h-3 border border-amber-600 border-t-transparent rounded-full animate-spin"></div>
                    Loading orders...
                  </div>
                )}
              </div>

              {/* Orders List */}
              {showOrders && userOrders.length > 0 && (
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 mt-4">
                  <h3 className="text-[10px] uppercase tracking-widest text-zinc-500 font-black mb-3">Order Details</h3>
                  <div className="space-y-3 max-h-[300px] overflow-y-auto">
                    {userOrders.map((order, idx) => (
                      <div key={idx} className="p-3 bg-zinc-950/50 rounded-lg border border-zinc-800/50">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-xs font-mono text-zinc-400">#{order._id?.slice(-8).toUpperCase() || 'N/A'}</span>
                          <span className={`text-[10px] uppercase tracking-widest font-bold px-2 py-1 rounded-full ${
                            order.status === 'Delivered' ? 'bg-emerald-500/20 text-emerald-500' :
                            order.status === 'Cancelled' ? 'bg-red-500/20 text-red-500' :
                            order.status === 'Processing' ? 'bg-amber-500/20 text-amber-500' :
                            'bg-blue-500/20 text-blue-500'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                        <div className="text-xs text-zinc-400 mb-2">
                          {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </div>
                        <div className="text-sm text-zinc-300 mb-2">
                          {order.products?.map(p => p.product?.name).join(', ') || 'N/A'}
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-zinc-500">{order.paymentMethod || 'COD'}</span>
                          <span className="text-sm font-mono font-bold text-amber-600">₹{order.totalAmount?.toLocaleString() || 0}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {showOrders && userOrders.length === 0 && !ordersLoading && (
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 mt-4 text-center">
                  <p className="text-zinc-600 text-sm italic">No orders found for this customer</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCustomers;