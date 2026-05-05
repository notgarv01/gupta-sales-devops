import React, { useState, useEffect } from "react";
import { ShoppingBag, Trash2, Plus, Minus, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import API_URL from "../../config/api";

const UserCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    try {
      const response = await fetch(`${API_URL}/api/user/cart`, {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setCartItems(data);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadCart = async () => {
      await fetchCart();
    };
    loadCart();
  }, []);

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      const response = await fetch(`${API_URL}/api/user/cart`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity: newQuantity })
      });
      if (response.ok) {
        const data = await response.json();
        setCartItems(data);
      }
    } catch (error) {
      console.error('Error updating cart:', error);
    }
  };

  const removeItem = async (productId) => {
    try {
      const response = await fetch(`${API_URL}/api/user/cart/${productId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setCartItems(data);
      }
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const subtotal = cartItems.reduce(
    (acc, item) => acc + (item.product?.price || 0) * item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-[#1c1917] text-[#f5f5dc]">
      {/* Header */}
      <nav className="fixed top-0 w-full z-50 bg-[#1c1917]/80 backdrop-blur-xl border-b border-[#292524] px-6 py-4 flex justify-between items-center">
        <Link to="/user-home" className="flex items-center gap-2 text-zinc-400 hover:text-amber-500 transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span className="text-xs uppercase tracking-[0.2em]">Back to Shop</span>
        </Link>

        <div className="flex items-center gap-3">
          <ShoppingBag size={20} className="text-amber-600" />
          <h2 className="text-xl font-serif italic text-zinc-100">Your Cart</h2>
        </div>

        <div className="w-20"></div>
      </nav>

      {/* Main Content */}
      <div className="pt-24 px-6 pb-32 max-w-4xl mx-auto">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-zinc-500 text-sm">Loading cart...</div>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="h-[60vh] flex flex-col items-center justify-center text-zinc-500 space-y-4">
            <ShoppingBag size={48} className="text-zinc-700" />
            <p className="italic font-light text-lg">Your cart is empty.</p>
            <Link to="/user-home" className="text-xs uppercase tracking-[0.2em] text-amber-600 border-b border-amber-600 pb-1 hover:text-amber-500">
              Start Browsing
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {cartItems.map((item) => (
              <div key={item._id} className="flex gap-6 p-6 bg-[#292524]/50 border border-[#292524] rounded-xl">
                <div className="w-32 h-32 bg-zinc-900 overflow-hidden flex-shrink-0 border border-zinc-800">
                  <img src={item.product?.image} alt={item.product?.name} className="w-full h-full object-cover" />
                </div>
                
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-medium text-zinc-100 tracking-wide">{item.product?.name}</h3>
                      <button onClick={() => removeItem(item.product._id)} className="text-zinc-600 hover:text-red-400 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                    {item.product?.brand && (
                      <p className="text-xs text-amber-500 mt-1 uppercase tracking-wider font-medium">{item.product.brand}</p>
                    )}
                    {item.product?.type === "chai" && (
                      <p className="text-[10px] text-zinc-400 mt-1">5kg per packet</p>
                    )}
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center border border-zinc-800 rounded-sm bg-zinc-900">
                      <button onClick={() => updateQuantity(item.product._id, item.quantity - 1)} className="p-2 text-zinc-400 hover:text-amber-600"><Minus size={14} /></button>
                      <span className="px-4 text-sm text-zinc-200 tabular-nums">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.product._id, item.quantity + 1)} className="p-2 text-zinc-400 hover:text-amber-600"><Plus size={14} /></button>
                    </div>
                    <span className="text-lg font-light text-zinc-100">₹{((item.product?.price || 0) * item.quantity).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {cartItems.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-6 bg-[#1c1917]/95 backdrop-blur-xl border-t border-[#292524]">
          <div className="max-w-4xl mx-auto flex justify-between items-center">
            <div>
              <span className="text-zinc-400 uppercase text-[10px] font-bold tracking-widest">Subtotal</span>
              <p className="text-2xl font-serif italic text-zinc-100 mt-1">₹{subtotal.toLocaleString()}</p>
            </div>
            <Link to='/user-checkout'><button className="px-8 py-4 bg-amber-600 text-zinc-950 text-[10px] tracking-[0.3em] uppercase font-bold hover:bg-amber-500 transition-colors">
              Proceed to Checkout
            </button></Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserCart;