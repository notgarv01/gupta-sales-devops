import React, { useState, useEffect } from 'react';
import { MapPin, ArrowLeft, Plus, Edit2, Trash2, Home } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import API_URL from '../../config/api';

const UserAddresses = () => {
  const [addresses, setAddresses] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAddress, setNewAddress] = useState({ address: '', pincode: '' });
  const [editingIndex, setEditingIndex] = useState(null);
  const [editAddress, setEditAddress] = useState({ address: '', pincode: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`${API_URL}/api/user/profile`, {
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          setUser(data);
          setAddresses(data.addresses || []);
        } else if (response.status === 401) {
          navigate('/');
        }
      } catch (error) {
        console.error('Error fetching addresses:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [navigate]);

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/api/user/address`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAddress)
      });
      if (response.ok) {
        const data = await response.json();
        setAddresses([...addresses, { address: data.address, pincode: data.pincode }]);
        setNewAddress({ address: '', pincode: '' });
        setShowAddForm(false);
      }
    } catch (error) {
      console.error('Error adding address:', error);
    }
  };

  const handleEditClick = (index) => {
    setEditingIndex(index);
    setEditAddress({ address: addresses[index].address, pincode: addresses[index].pincode });
  };

  const handleUpdateAddress = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/api/user/address`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...editAddress, index: editingIndex })
      });
      if (response.ok) {
        const data = await response.json();
        const updatedAddresses = [...addresses];
        updatedAddresses[editingIndex] = { address: data.address, pincode: data.pincode };
        setAddresses(updatedAddresses);
        setEditingIndex(null);
        setEditAddress({ address: '', pincode: '' });
      }
    } catch (error) {
      console.error('Error updating address:', error);
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
      {/* Header */}
      <div className="border-b border-zinc-800/50 bg-[#0c0a09]/80 backdrop-blur-md sticky top-0 z-10 px-6 py-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/user-home" className="p-2 hover:bg-zinc-900 rounded-full transition-colors">
              <ArrowLeft size={20} className="text-zinc-400" />
            </Link>
            <h1 className="text-2xl font-serif italic tracking-wide">My Addresses</h1>
          </div>
          <div className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 font-bold">
            Total: {addresses.length}
          </div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-6 pt-10">
        {/* Add Address Form */}
        {showAddForm && (
          <div className="mb-8 bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 backdrop-blur-sm shadow-2xl">
            <h3 className="text-lg font-bold text-zinc-200 mb-6">Add New Address</h3>
            <form onSubmit={handleAddAddress} className="space-y-4">
              <div>
                <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-2 block">Address</label>
                <textarea
                  value={newAddress.address}
                  onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-zinc-200 focus:border-amber-600/50 outline-none transition-all h-24 resize-none"
                  placeholder="Street, Apartment, Landmark..."
                  required
                />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-2 block">Pincode</label>
                <input
                  type="text"
                  value={newAddress.pincode}
                  onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-zinc-200 focus:border-amber-600/50 outline-none transition-all"
                  placeholder="6 Digit Code"
                  required
                />
              </div>
              <div className="pt-4 flex items-center gap-4">
                <button type="submit" className="bg-amber-600 hover:bg-amber-500 text-black px-8 py-3 rounded-xl font-bold text-sm transition-all shadow-lg shadow-amber-900/20">
                  SAVE ADDRESS
                </button>
                <button 
                  type="button" 
                  onClick={() => setShowAddForm(false)}
                  className="text-zinc-500 hover:text-zinc-200 text-sm font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {addresses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mb-6 border border-zinc-800">
              <MapPin size={32} className="text-zinc-700" />
            </div>
            <h2 className="text-xl font-bold text-zinc-300">No addresses saved</h2>
            <p className="text-zinc-500 mt-2 max-w-xs">Add an address to get started with your deliveries.</p>
            <button 
              onClick={() => setShowAddForm(true)}
              className="mt-8 bg-amber-600 text-black px-8 py-3 rounded-xl font-bold text-sm hover:bg-amber-500 transition-all"
            >
              ADD ADDRESS
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {addresses.map((addr, index) => (
              editingIndex === index ? (
                // Edit Form
                <div key={index} className="bg-zinc-900/40 border border-amber-600/50 rounded-2xl p-6 shadow-xl">
                  <h3 className="text-lg font-bold text-zinc-200 mb-4">Edit Address</h3>
                  <form onSubmit={handleUpdateAddress} className="space-y-4">
                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-2 block">Address</label>
                      <textarea
                        value={editAddress.address}
                        onChange={(e) => setEditAddress({ ...editAddress, address: e.target.value })}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-zinc-200 focus:border-amber-600/50 outline-none transition-all h-20 resize-none text-sm"
                        placeholder="Street, Apartment, Landmark..."
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-2 block">Pincode</label>
                        <input
                          type="text"
                          value={editAddress.pincode}
                          onChange={(e) => setEditAddress({ ...editAddress, pincode: e.target.value })}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-zinc-200 focus:border-amber-600/50 outline-none transition-all text-sm"
                          placeholder="6 Digit Code"
                          required
                        />
                      </div>
                    </div>
                    <div className="pt-2 flex items-center gap-3">
                      <button type="submit" className="bg-amber-600 hover:bg-amber-500 text-black px-6 py-2 rounded-xl font-bold text-xs transition-all">
                        UPDATE
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setEditingIndex(null)}
                        className="text-zinc-500 hover:text-zinc-200 text-xs font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                // Display Card
                <div
                  key={index}
                  className="group bg-zinc-900/40 border border-zinc-800/50 rounded-2xl p-6 hover:border-amber-600/50 transition-all shadow-xl"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-amber-600/10 rounded-xl border border-amber-600/20 shrink-0">
                      <Home className="text-amber-600" size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-zinc-100">{user?.name || 'Customer'}</h4>
                      <p className="text-zinc-400 mt-2 leading-relaxed text-sm">{addr.address}</p>
                      <div className="flex gap-4 mt-4">
                        <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-tighter">
                          PIN: <span className="text-zinc-300">{addr.pincode}</span>
                        </div>
                        <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-tighter">
                          TEL: <span className="text-zinc-300">{user?.phone || 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 mt-6 pt-4 border-t border-zinc-800/50">
                    <button 
                      onClick={() => handleEditClick(index)}
                      className="flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold text-zinc-400 hover:text-amber-500 hover:bg-amber-600/10 rounded-lg transition-all"
                    >
                      <Edit2 size={14} /> EDIT
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold text-zinc-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all">
                      <Trash2 size={14} /> DELETE
                    </button>
                  </div>
                </div>
              )
            ))}
            
            {/* Add New Address Card */}
            <button
              onClick={() => setShowAddForm(true)}
              className="group bg-zinc-900/20 border border-zinc-800/50 border-dashed rounded-2xl p-6 hover:border-amber-600/50 hover:bg-zinc-900/40 transition-all flex flex-col items-center justify-center min-h-[200px] w-full"
            >
              <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center mb-4 group-hover:bg-amber-600/20 transition-all">
                <Plus size={24} className="text-zinc-500 group-hover:text-amber-600 transition-all" />
              </div>
              <p className="text-sm font-bold text-zinc-400 group-hover:text-zinc-200">Add New Address</p>
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default UserAddresses;
