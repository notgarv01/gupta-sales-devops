import React, { useState, useEffect } from 'react';
import { MapPin, Plus, Edit2, ArrowLeft, CheckCircle2, ShieldCheck, Truck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import API_URL from '../../config/api';

const UserCheckout = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);
  const [addresses, setAddresses] = useState([]);
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('');
  const [phone, setPhone] = useState('');
  const [cartItems, setCartItems] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch(`${API_URL}/api/user/profile`, { credentials: 'include' });
      if (response.ok) {
        const data = await response.json();
        setUser(data);
        setPhone(data.phone || '');
        const userAddresses = data.addresses || [];
        setAddresses(userAddresses);
        if (userAddresses.length === 0) {
          setShowAddressForm(true);
          setIsAddingNewAddress(true);
        } else {
          setSelectedAddressIndex(0);
          const addr = userAddresses[0];
          setAddress(addr.address || '');
          setPincode(addr.pincode || '');
        }
      }
    } catch (error) { console.error('Error fetching user profile:', error); }
    finally { setLoading(false); }
  };

  const fetchCart = async () => {
    try {
      const response = await fetch(`${API_URL}/api/user/cart`, { credentials: 'include' });
      if (response.ok) {
        const data = await response.json();
        setCartItems(data);
      }
    } catch (error) { console.error('Error fetching cart:', error); }
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchUserProfile();
      await fetchCart();
    };
    loadData();
  }, []);

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isAddingNewAddress) {
        const response = await fetch(`${API_URL}/api/user/address`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ address, pincode, phone })
        });
        if (response.ok) {
          const data = await response.json();
          const newAddr = { address: data.address, pincode: data.pincode };
          setAddresses([...addresses, newAddr]);
          setPhone(data.phone || phone);
          setSelectedAddressIndex(addresses.length);
          setIsAddingNewAddress(false);
          setShowAddressForm(false);
        }
      } else {
        const response = await fetch(`${API_URL}/api/user/address`, {
          method: 'PUT',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ address, pincode, phone, index: selectedAddressIndex })
        });
        if (response.ok) {
          const data = await response.json();
          const updatedAddresses = [...addresses];
          updatedAddresses[selectedAddressIndex] = { address: data.address, pincode: data.pincode };
          setAddresses(updatedAddresses);
          setPhone(data.phone || phone);
          setShowAddressForm(false);
        }
      }
    } catch (error) { console.error('Error updating address:', error); }
  };

  const handleAddNewAddressClick = () => {
    setIsAddingNewAddress(true);
    setShowAddressForm(true);
    setAddress('');
    setPincode('');
    setPhone('');
  };

  const handleEditAddress = (index) => {
    setSelectedAddressIndex(index);
    setIsAddingNewAddress(false);
    setShowAddressForm(true);
    const addr = addresses[index];
    setAddress(addr.address || '');
    setPincode(addr.pincode || '');
    setPhone(addr.phone || '');
  };

  const handleSelectAddress = (index) => {
    setSelectedAddressIndex(index);
    const addr = addresses[index];
    setAddress(addr.address || '');
    setPincode(addr.pincode || '');
    setPhone(addr.phone || '');
  };

  const handleCompletePurchase = async () => {
    setIsProcessing(true);
    try {
      const response = await fetch(`${API_URL}/api/user/order`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address: addresses[selectedAddressIndex]?.address,
          pincode: addresses[selectedAddressIndex]?.pincode,
          phone: phone
        })
      });
      if (response.ok) {
        setCartItems([]);
        navigate('/order-success');
      } else {
        console.error('Order creation failed');
      }
    } catch (error) {
      console.error('Error creating order:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const subtotal = cartItems.reduce((acc, item) => acc + (item.product?.price || 0) * item.quantity, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0c0a09] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-amber-600/20 border-t-amber-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0c0a09] text-zinc-100 font-sans selection:bg-amber-500/30">
      <nav className="fixed top-0 w-full z-50 bg-[#0c0a09]/80 backdrop-blur-md border-b border-zinc-800/50 px-8 py-4 flex justify-between items-center">
        <Link to="/user-cart" className="group flex items-center gap-2 text-zinc-500 hover:text-amber-500 transition-all">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] uppercase tracking-[0.3em] font-bold">Return to Cart</span>
        </Link>
        <div className="flex flex-col items-center">
          <h2 className="text-lg font-serif italic tracking-wide">Checkout</h2>
          <div className="flex gap-1 mt-1">
            <div className="w-8 h-[2px] bg-amber-600"></div>
            <div className="w-8 h-[2px] bg-zinc-800"></div>
          </div>
        </div>
        <div className="w-24"></div>
      </nav>

      <main className="pt-28 pb-20 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          <div className="lg:col-span-8 space-y-12">
            
            <section className="relative">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm uppercase tracking-[0.2em] text-zinc-500 font-bold">01. Delivery Details</h3>
                {!showAddressForm && addresses.length > 0 && (
                  <button onClick={handleAddNewAddressClick} className="text-amber-600 text-xs font-bold hover:underline flex items-center gap-1">
                    <Plus size={14} /> ADD NEW ADDRESS
                  </button>
                )}
              </div>

              {showAddressForm ? (
                <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-8 backdrop-blur-sm shadow-2xl">
                  <form onSubmit={handleAddressSubmit} className="space-y-6">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-lg font-bold text-zinc-200">
                        {isAddingNewAddress ? 'Add New Address' : 'Edit Address'}
                      </h4>
                      {!isAddingNewAddress && (
                        <button type="button" onClick={() => setShowAddressForm(false)} className="text-zinc-500 hover:text-zinc-200 text-sm font-medium">Cancel</button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-2 block">Shipping Address</label>
                        <textarea
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-zinc-200 focus:border-amber-600/50 outline-none transition-all h-24 resize-none"
                          placeholder="Street, Apartment, Landmark..."
                          required
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-2 block">Pincode</label>
                        <input
                          type="text"
                          value={pincode}
                          onChange={(e) => setPincode(e.target.value)}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-zinc-200 focus:border-amber-600/50 outline-none transition-all"
                          placeholder="6 Digit Code"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-2 block">Contact Number</label>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-zinc-200 focus:border-amber-600/50 outline-none transition-all"
                          placeholder="Phone Number"
                          required
                        />
                      </div>
                    </div>
                    <p className="text-[10px] text-amber-600/80 uppercase tracking-wider font-semibold">
                      Please add correct info - we will contact you regarding order updates
                    </p>
                    <div className="pt-4 flex items-center gap-4">
                      <button type="submit" className="bg-amber-600 hover:bg-amber-500 text-black px-10 py-4 rounded-xl font-bold text-sm transition-all shadow-lg shadow-amber-900/20">
                        {isAddingNewAddress ? 'SAVE NEW ADDRESS' : 'UPDATE ADDRESS'}
                      </button>
                      {addresses.length > 0 && (
                        <button type="button" onClick={() => { setShowAddressForm(false); setIsAddingNewAddress(false); }} className="text-zinc-500 hover:text-zinc-200 text-sm font-medium">Discard Changes</button>
                      )}
                    </div>
                  </form>
                </div>
              ) : (
                <div className="space-y-4">
                  {addresses.map((addr, index) => (
                    <div
                      key={index}
                      onClick={() => handleSelectAddress(index)}
                      className={`group relative cursor-pointer p-6 rounded-2xl shadow-xl transition-all ${
                        selectedAddressIndex === index
                          ? 'bg-gradient-to-br from-zinc-900 to-zinc-950 border-2 border-amber-600/50'
                          : 'bg-zinc-900/40 border border-zinc-800 hover:border-zinc-700'
                      }`}
                    >
                      {selectedAddressIndex === index && (
                        <div className="absolute -top-3 -right-3 bg-amber-600 text-black p-1 rounded-full shadow-lg">
                          <CheckCircle2 size={20} />
                        </div>
                      )}
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-xl border ${selectedAddressIndex === index ? 'bg-amber-600/10 border-amber-600/20' : 'bg-zinc-800 border-zinc-700'}`}>
                          <MapPin className={selectedAddressIndex === index ? 'text-amber-600' : 'text-zinc-500'} size={20} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-bold text-zinc-100">{user?.name || 'Customer'}</h4>
                            {selectedAddressIndex === index && (
                              <span className="text-[10px] uppercase tracking-widest text-amber-600 font-bold">Selected</span>
                            )}
                          </div>
                          <p className="text-zinc-400 mt-1 leading-relaxed text-sm">{addr.address}</p>
                          <div className="flex gap-4 mt-3">
                            <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-tighter">PIN: <span className="text-zinc-300">{addr.pincode}</span></div>
                            <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-tighter">TEL: <span className="text-zinc-300">{user?.phone || 'N/A'}</span></div>
                          </div>
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleEditAddress(index); }}
                          className="p-2 text-zinc-500 hover:text-amber-600 hover:bg-amber-600/10 rounded-lg transition-all"
                        >
                          <Edit2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section>
              <h3 className="text-sm uppercase tracking-[0.2em] text-zinc-500 font-bold mb-6">02. Review Order</h3>
              <div className="grid grid-cols-1 gap-4">
                {cartItems.map((item) => (
                  <div key={item._id} className="flex items-center gap-6 p-4 bg-zinc-900/30 border border-zinc-800/50 rounded-2xl hover:bg-zinc-900/50 transition-colors group">
                    <div className="w-20 h-24 bg-zinc-950 rounded-xl overflow-hidden border border-zinc-800">
                      <img src={item.product?.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-zinc-200">{item.product?.name}</h4>
                      <p className="text-xs text-zinc-500 mt-1 uppercase tracking-widest font-semibold">Qty: {item.quantity}</p>
                      <p className="text-amber-600 font-bold mt-2 font-mono">{((item.product?.price || 0) * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="lg:col-span-4">
            <div className="sticky top-28 space-y-6">
              <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-600/5 blur-3xl -mr-16 -mt-16 rounded-full"></div>
                
                <h3 className="text-xl font-bold mb-8">Summary</h3>
                
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-zinc-500 text-sm">
                    <span>Subtotal</span>
                    <span className="text-zinc-200 font-mono">{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-zinc-500 text-sm">
                    <span>Shipping</span>
                    <span className="text-emerald-500 font-bold uppercase text-[10px] tracking-widest flex items-center gap-1">
                      <Truck size={12} /> Free
                    </span>
                  </div>
                  <div className="h-px bg-zinc-800 my-6"></div>
                  <div className="flex justify-between items-end">
                    <span className="text-zinc-400 font-bold text-xs uppercase tracking-[0.2em]">Grand Total</span>
                    <span className="text-3xl font-bold text-amber-600 font-mono tracking-tighter">{subtotal.toLocaleString()}</span>
                  </div>
                </div>

                <button
                  onClick={handleCompletePurchase}
                  disabled={addresses.length === 0 || showAddressForm || isProcessing}
                  className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] transition-all
                    ${(addresses.length === 0 || showAddressForm || isProcessing)
                      ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed border border-zinc-700'
                      : 'bg-amber-600 text-black hover:bg-amber-500 hover:shadow-[0_0_30px_rgba(217,119,6,0.3)]'}`}
                >
                  {isProcessing ? 'Processing...' : (addresses.length === 0 || showAddressForm) ? 'Review Address Above' : 'Complete Purchase'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserCheckout;
