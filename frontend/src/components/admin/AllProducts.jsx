import React, { useState, useEffect } from 'react';
import { Edit3, Trash2, Plus, Search, Filter, MoreVertical, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import API_URL from '../../config/api';

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_URL}/api/admin/products`, {
          credentials: 'include'
        });
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-amber-600/20 border-t-amber-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-serif italic text-white tracking-wide">Inventory Management</h1>
            <p className="text-zinc-500 text-sm mt-1">Manage and edit your premium product catalog</p>
          </div>
          <Link 
            to="/admin/add-product" 
            className="flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-500 text-black px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-lg shadow-amber-900/20"
          >
            <Plus size={18} /> ADD NEW PRODUCT
          </Link>
        </div>

        {/* Toolbar */}
        <div className="bg-zinc-900/40 border border-zinc-800 p-4 rounded-2xl mb-6 flex flex-wrap gap-4 items-center justify-between">
          <div className="relative flex-1 min-w-[300px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
            <input 
              type="text" 
              placeholder="Search by product name..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 pl-12 pr-4 text-sm focus:border-amber-600/50 outline-none transition-all"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-400 hover:text-white transition-colors">
            <Filter size={18} />
            <span className="text-sm font-medium">Filters</span>
          </button>
        </div>

        {/* Table Section */}
        <div className="bg-zinc-900/30 border border-zinc-800 rounded-3xl overflow-hidden backdrop-blur-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900/50">
                <th className="px-6 py-5 text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold">Product Details</th>
                <th className="px-6 py-5 text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold">Category</th>
                <th className="px-6 py-5 text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold">Price</th>
                <th className="px-6 py-5 text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold">Stock Status</th>
                <th className="px-6 py-5 text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {filteredProducts.map((product) => (
                <tr key={product._id} className="hover:bg-zinc-800/20 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-14 bg-zinc-950 border border-zinc-800 rounded-lg overflow-hidden shrink-0">
                        <img src={product.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-zinc-200">{product.name}</p>
                        <p className="text-[10px] text-zinc-500 font-mono mt-0.5 uppercase">ID: {product._id.slice(-6)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs text-zinc-400 bg-zinc-900 px-3 py-1 rounded-full border border-zinc-800">
                      {product.category || 'General'}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono text-sm text-amber-600 font-bold">
                    ₹{(product.type === 'chai patti' || product.type === 'chai_patti' || product.name?.toLowerCase().includes('chai') 
                      ? (product.price / 5) 
                      : product.price)?.toLocaleString()} / {product.type === 'chai patti' || product.type === 'chai_patti' || product.name?.toLowerCase().includes('chai') ? 'kg' : 'unit'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${product.stock > 0 ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                      <span className={`text-xs font-bold uppercase tracking-tighter ${product.stock > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                        {product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link 
                        to={`/admin/edit-product/${product._id}`} 
                        className="p-2 hover:bg-amber-600/10 text-zinc-400 hover:text-amber-500 rounded-lg transition-all"
                        title="Edit Product"
                      >
                        <Edit3 size={18} />
                      </Link>
                      <button 
                        className="p-2 hover:bg-red-500/10 text-zinc-400 hover:text-red-500 rounded-lg transition-all"
                        title="Delete Product"
                        onClick={() => {/* Add delete logic */}}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredProducts.length === 0 && (
            <div className="py-20 text-center">
              <p className="text-zinc-500 italic">No products found matching your search.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllProducts;