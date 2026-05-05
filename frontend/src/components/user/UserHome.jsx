import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Search, User, Star, Plus, Minus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import ThemeToggle from "../common/ThemeToggle";
import Toast, { useToast } from "../common/Toast";
import API_URL from "../../config/api";

const UserHome = () => {
  const naviagte = useNavigate()
  const { toast, showToast, hideToast } = useToast()

  const [activeTab, setActiveTab] = useState("All");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState([]);

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
    }
  };

  const addToCart = async (product) => {
    try {
      const response = await fetch(`${API_URL}/api/user/cart`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product._id,
          quantity: 1
        })
      });

      if (response.ok) {
        await fetchCart();
        showToast('Added to cart', 'success');
      } else {
        const errorData = await response.json();
        showToast(errorData.message || 'Failed to add to cart', 'error');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      showToast('Server connection error', 'error');
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const response = await fetch(`${API_URL}/api/user/cart/${productId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (response.ok) {
        await fetchCart();
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) {
      await removeFromCart(productId);
      return;
    }
    try {
      const response = await fetch(`${API_URL}/api/user/cart`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity: newQuantity })
      });
      if (response.ok) {
        await fetchCart();
      }
    } catch (error) {
      console.error('Error updating cart:', error);
    }
  };

  const getCartItem = (productId) => {
    return cartItems.find(item => item.product?._id === productId);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsResponse, cartResponse] = await Promise.all([
          fetch(`${API_URL}/api/user/products`),
          fetch(`${API_URL}/api/user/cart`, { credentials: 'include' })
        ]);

        if (productsResponse.ok) {
          const productsData = await productsResponse.json();
          setProducts(productsData);
        }

        if (cartResponse.ok) {
          const cartData = await cartResponse.json();
          setCartItems(cartData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const typeOrder = { 'chai': 1, 'manjan': 2, 'mehendi': 3, 'matchbox': 4 };
  
  const sortedProducts = [...products].sort((a, b) => {
    const orderA = typeOrder[a.type] || 5;
    const orderB = typeOrder[b.type] || 5;
    return orderA - orderB;
  });

  const filteredProducts =
    activeTab === "All"
      ? sortedProducts
      : sortedProducts.filter((p) => {
          if (activeTab === "Chai Patti") return p.type === "chai";
          return p.type === activeTab.toLowerCase();
        });

  return (
    <div className="min-h-screen bg-[#1c1917] text-[#f5f5dc]">
      <Toast message={toast.message} type={toast.type} onClose={hideToast} />

      {/* NAVBAR */}
      <nav className="fixed top-0 w-full z-50 bg-[#1c1917]/80 backdrop-blur-xl border-b border-[#292524] px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
        <Search className="w-5 h-5 text-zinc-400 hover:text-amber-500 cursor-pointer" />

        <h1 className="text-lg sm:text-2xl font-serif italic tracking-tight">
          Gupta Sales{" "}
          <span className="text-[8px] sm:text-[10px] text-amber-600 hidden sm:inline">
            Since 2000
          </span>
        </h1>

        <div className="flex items-center gap-3 sm:gap-6">
          <div className="relative cursor-pointer">
            <Link to="/user-cart" className="relative">
              <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 hover:text-amber-500" />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-amber-600 text-black text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {cartItems.length}
                </span>
              )}
            </Link>
          </div>
          <Link to="/user-profile">
            <User className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-400" />
          </Link>
          <ThemeToggle />
        </div>
      </nav>

      {/* HERO */}
      <section className="pt-24 sm:pt-32 px-4 sm:px-6 pb-12 sm:pb-16">
        <div className="relative h-[50vh] sm:h-[60vh] rounded-2xl sm:rounded-3xl overflow-hidden border border-[#292524] bg-[#292524]">
          <img
            src="https://images.unsplash.com/photo-1515696955266-4f67e13219e8?q=80&w=1200"
            className="absolute inset-0 w-full h-full object-cover opacity-30"
            alt=""
          />

          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent" />

          <div className="relative z-10 p-6 sm:p-8 md:p-12 max-w-xl">
            <span className="text-amber-600 text-[10px] sm:text-xs uppercase tracking-[0.3em]">
              Since 2000
            </span>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif italic mt-4 leading-tight">
              Pure Tradition. <br /> Timeless Quality.
            </h2>

            <button className="mt-6 sm:mt-8 px-6 sm:px-8 py-3 sm:py-4 bg-amber-600 text-black text-[10px] sm:text-xs font-bold uppercase tracking-widest hover:bg-amber-500 transition">
              Explore Collection
            </button>
          </div>
        </div>
      </section>

      {/* FILTER TABS */}
      <section className="px-4 sm:px-6 mb-8 sm:mb-10">
        <div className="flex justify-center gap-6 sm:gap-10 border-b border-[#292524] pb-4 overflow-x-auto">
          {["All", "Chai Patti", "Manjan", "Mehendi", "Matchbox"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-[10px] sm:text-xs tracking-[0.3em] uppercase transition whitespace-nowrap ${
                activeTab === tab
                  ? "text-amber-500 border-b border-amber-500 pb-2"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </section>

      {/* PRODUCT GRID */}
      <section className="px-4 sm:px-6 pb-24 sm:pb-32">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-zinc-500 text-sm">Loading products...</div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            <AnimatePresence>
              {filteredProducts.map((product) => (
                <motion.div
                  layout
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="group"
                >
                  <div className="relative rounded-xl sm:rounded-2xl overflow-hidden border border-[#292524] bg-[#292524]/50">
                    <img
                      src={product.image}
                      className="w-full h-[200px] sm:h-[240px] md:h-[280px] object-cover group-hover:scale-105 transition duration-700"
                      alt=""
                    />

                    {/* Overlay */}
                    <div className={(() => {
                      const cartItem = getCartItem(product._id);
                      return cartItem
                        ? "absolute inset-0 bg-black/30 opacity-100 transition flex items-end p-3 sm:p-4"
                        : "absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition flex items-end p-3 sm:p-4";
                    })()}>
                      {(() => {
                        const cartItem = getCartItem(product._id);
                        if (cartItem) {
                          return (
                            <div className="w-full flex items-center gap-2">
                              <button
                                onClick={() => removeFromCart(product._id)}
                                className="flex-1 py-2 sm:py-3 bg-amber-600 text-black text-[10px] sm:text-xs font-bold uppercase rounded-lg"
                              >
                                Added
                              </button>
                              <div className="flex items-center bg-amber-600 text-black rounded-lg px-1 py-2 sm:py-3">
                                <button
                                  onClick={() => updateQuantity(product._id, cartItem.quantity - 1)}
                                  className="p-1 hover:bg-amber-500 rounded"
                                >
                                  <Minus size={12} />
                                </button>
                                <span className="text-[10px] sm:text-xs font-bold px-2 w-6 text-center">{cartItem.quantity}</span>
                                <button
                                  onClick={() => updateQuantity(product._id, cartItem.quantity + 1)}
                                  className="p-1 hover:bg-amber-500 rounded"
                                >
                                  <Plus size={12} />
                                </button>
                              </div>
                            </div>
                          );
                        }
                        return (
                          <button
                            onClick={() => addToCart(product)}
                            className="w-full py-2 sm:py-3 bg-amber-600 text-black text-[10px] sm:text-xs font-bold uppercase rounded-lg"
                          >
                            Add to Cart
                          </button>
                        );
                      })()}
                    </div>
                  </div>

                  {/* INFO */}
                  <div className="mt-3 sm:mt-4 space-y-1">
                    <h3 className="text-xs sm:text-sm tracking-wide">
                      {product.name}
                    </h3>

                    {product.brand && (
                      <p className="text-[9px] sm:text-[10px] text-amber-500 uppercase tracking-wider font-medium">
                        {product.brand}
                      </p>
                    )}

                    {product.variant && (
                      <p className="text-[9px] sm:text-[10px] text-zinc-400 uppercase tracking-wider">
                        {product.variant}
                      </p>
                    )}

                    {product.type === "chai" ? (
                      <>
                        <div className="flex items-center gap-2 sm:gap-3">
                          <span className="text-amber-500 font-serif text-sm sm:text-lg italic">
                            ₹{Math.round(product.price / 5)}/kg
                          </span>
                          <span className="text-zinc-400 text-[10px] sm:text-xs">
                            (Total: ₹{product.price})
                          </span>
                        </div>
                        <p className="text-[9px] sm:text-[10px] text-amber-600/70 uppercase tracking-wider">
                          1 packet = 5kg
                        </p>
                      </>
                    ) : (
                      <div className="flex items-center gap-2 sm:gap-3">
                        <span className="text-amber-500 font-serif text-sm sm:text-lg italic">
                          ₹{product.price}/{product.unit}
                        </span>
                        {product.oldPrice && (
                          <span className="text-zinc-500 line-through text-[10px] sm:text-xs">
                            ₹{product.oldPrice}/{product.unit}
                          </span>
                        )}
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-[9px] sm:text-[10px] text-zinc-500">
                      <span>
                        {product.type === "chai" ? "Min: 5kg" : `Min: ${product.minOrderQty} ${product.unit}`}
                      </span>
                      {product.name?.toLowerCase().includes('fast mehendi') && (
                        <span>• 5 min</span>
                      )}
                      {product.piecesPerUnit && (
                        <span>• {product.brand === '5rs manjan' 
                          ? `${product.piecesPerUnit}×10 pcs (30g each)` 
                          : product.brand === '10rs manjan' 
                            ? `${product.piecesPerUnit}×5 pcs (70g each)` 
                            : product.brand === 'meeta gold'
                              ? `20 pcs (250g each)`
                              : product.type === 'chai' || product.name?.toLowerCase().includes('chai')
                                ? `${product.piecesPerUnit} pcs (250g each)`
                                : `${product.piecesPerUnit} pcs`}</span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </section>
    </div>
  );
};

export default UserHome;
