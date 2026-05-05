import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, Plus, Upload, X, Image as ImageIcon, IndianRupee, BarChart3 } from 'lucide-react';
import CustomSelect from './CustomSelect';
import API_URL from '../../config/api';

const AddProduct = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    oldPrice: '',
    type: 'chai',
    unit: 'kg',
    minOrderQty: '1',
    piecesPerUnit: '',
    brand: '',
    stock: '',
    description: '',
    image: ''
  });
  
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const typeOptions = [
    { label: 'Chai (Tea)', value: 'chai' },
    { label: 'Mehendi', value: 'mehendi' },
    { label: 'Manjan', value: 'manjan' },
    { label: 'Matchbox', value: 'matchbox' },
  ];

  const unitOptions = [
    { label: 'Kilogram (kg)', value: 'kg' },
    { label: 'Box', value: 'box' },
    { label: 'Katta', value: 'katta' },
  ];

  const brandOptions = [
    { label: 'Shreemali', value: 'shreemali' },
    { label: 'Herbal Heena', value: 'herbal heena' },
    { label: 'Meeta Gold', value: 'meeta gold' },
    { label: 'Meeta Premium', value: 'meeta premium' },
    { label: 'Sunwheel', value: 'sunwheel' },
    { label: 'Deep', value: 'deep' },
    { label: '5RS Manjan', value: '5rs manjan' },
    { label: '10RS Manjan', value: '10rs manjan' },
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 14 * 1024 * 1024) {
        setMessage({ text: 'Image too large. Maximum size is 14MB', type: 'error' });
        return;
      }
      setPreviewUrl(URL.createObjectURL(file));
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setPreviewUrl(null);
    setFormData({ ...formData, image: '' });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    if (!formData.image) {
      setMessage({ text: 'Please upload a product image', type: 'error' });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/admin/products`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: formData.type === 'chai' ? Number(formData.price) * 5 : Number(formData.price),
          oldPrice: formData.oldPrice ? (formData.type === 'chai' ? Number(formData.oldPrice) * 5 : Number(formData.oldPrice)) : null,
          stock: Number(formData.stock) || 0,
          minOrderQty: Number(formData.minOrderQty) || 1,
          piecesPerUnit: formData.piecesPerUnit ? Number(formData.piecesPerUnit) : null
        })
      });

      if (response.ok) {
        setMessage({ text: 'Product added successfully', type: 'success' });
        setTimeout(() => navigate('/admin-home'), 1500);
      } else {
        const errorData = await response.json();
        setMessage({ text: errorData.message || 'Failed to add product', type: 'error' });
      }
    } catch {
      setMessage({ text: 'Server connection error', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0c0c0e] text-zinc-200 font-sans selection:bg-amber-500/30">
      <div className="max-w-5xl mx-auto px-6 py-12">
        
        {/* TOP NAVIGATION */}
        <div className="flex items-center justify-between mb-12">
          <button 
            onClick={() => navigate('/admin-home')}
            className="group flex items-center gap-2 text-zinc-500 hover:text-zinc-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] uppercase tracking-[0.2em] font-medium">Back to Dashboard</span>
          </button>
          
          <div className="text-right">
            <h1 className="text-3xl font-light tracking-tight text-white">Gupta <span className="text-amber-500 font-medium text-serif italic">Sales</span></h1>
            <p className="text-[10px] text-zinc-500 uppercase tracking-[0.4em] mt-1">Inventory Management</p>
          </div>
        </div>

        {/* FEEDBACK MESSAGE */}
        {message.text && (
          <div className={`mb-8 p-4 rounded-sm border-l-4 animate-in fade-in slide-in-from-top-2 ${
            message.type === 'success' 
              ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' 
              : 'bg-red-500/10 border-red-500 text-red-400'
          }`}>
            <p className="text-xs font-medium uppercase tracking-wider">{message.text}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT: MAIN DETAILS */}
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-zinc-900/20 border border-zinc-800/50 p-8 rounded-2xl space-y-6">
              <div className="flex items-center gap-3 border-b border-zinc-800 pb-4">
                <Package className="w-5 h-5 text-amber-500" />
                <h2 className="text-xs uppercase tracking-[0.2em] font-bold">Product Information</h2>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase text-zinc-500 tracking-tighter">Product Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="e.g., Meeta Gold, Regular Cone" required className="w-full bg-zinc-950 border border-zinc-800 p-3 rounded focus:border-amber-500 outline-none transition-all" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <CustomSelect
                  label="Type"
                  options={typeOptions}
                  value={formData.type}
                  onChange={(val) => setFormData({...formData, type: val})}
                />
                <CustomSelect
                  label="Brand"
                  options={brandOptions}
                  value={formData.brand}
                  onChange={(val) => setFormData({...formData, brand: val})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase text-zinc-500 tracking-tighter">Sale Price (₹)</label>
                  <input type="number" name="price" value={formData.price} onChange={handleChange} required className="w-full bg-zinc-950 border border-zinc-800 p-3 rounded focus:border-amber-500 outline-none transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase text-zinc-500 tracking-tighter">MSRP (₹)</label>
                  <input type="number" name="oldPrice" value={formData.oldPrice} onChange={handleChange} className="w-full bg-zinc-950 border border-zinc-800 p-3 rounded focus:border-amber-500 outline-none transition-all" />
                </div>
              </div>

              <div className="space-y-2">
                <CustomSelect
                  label="Unit"
                  options={unitOptions}
                  value={formData.unit}
                  onChange={(val) => setFormData({...formData, unit: val})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase text-zinc-500 tracking-tighter">Min Order Qty</label>
                  <input type="number" name="minOrderQty" value={formData.minOrderQty} onChange={handleChange} min="1" className="w-full bg-zinc-950 border border-zinc-800 p-3 rounded focus:border-amber-500 outline-none transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase text-zinc-500 tracking-tighter">Pieces Per Unit (Optional)</label>
                  <input type="number" name="piecesPerUnit" value={formData.piecesPerUnit} onChange={handleChange} placeholder="e.g., 12" className="w-full bg-zinc-950 border border-zinc-800 p-3 rounded focus:border-amber-500 outline-none transition-all" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase text-zinc-500 tracking-tighter">Stock Units</label>
                  <input type="number" name="stock" value={formData.stock} onChange={handleChange} className="w-full bg-zinc-950 border border-zinc-800 p-3 rounded focus:border-amber-500 outline-none transition-all" />
                </div>
                <div className="bg-amber-500/5 border border-amber-500/20 p-4 rounded-xl flex flex-col justify-center items-center text-center">
                   <BarChart3 className="w-6 h-6 text-amber-500/50 mb-2" />
                   <p className="text-[8px] uppercase tracking-widest text-amber-200/50">Profit Margin</p>
                   <p className="text-lg font-light text-amber-500">
                    {formData.price && formData.oldPrice ? `${Math.round(((formData.oldPrice - formData.price)/formData.oldPrice)*100)}% Off` : '--'}
                   </p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase text-zinc-500 tracking-tighter">Description</label>
                <textarea name="description" value={formData.description} onChange={handleChange} rows="4" className="w-full bg-zinc-950 border border-zinc-800 p-3 rounded focus:border-amber-500 outline-none resize-none transition-all" />
              </div>
            </section>
          </div>

          {/* RIGHT: ASSETS & ACTIONS */}
          <div className="space-y-8">
            <section className="bg-zinc-900/20 border border-zinc-800/50 p-8 rounded-2xl">
              <div className="flex items-center gap-3 border-b border-zinc-800 pb-4 mb-6">
                <ImageIcon className="w-5 h-5 text-amber-500" />
                <h2 className="text-xs uppercase tracking-[0.2em] font-bold">Product Image</h2>
              </div>

              {previewUrl ? (
                <div className="relative group rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950 aspect-square">
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                  <button 
                    type="button" 
                    onClick={removeImage}
                    className="absolute top-3 right-3 p-2 bg-red-500/20 hover:bg-red-500 text-red-500 hover:text-white rounded-full backdrop-blur-md transition-all"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div 
                  onClick={() => fileInputRef.current.click()}
                  className="border-2 border-dashed border-zinc-800 hover:border-amber-500/50 bg-zinc-950/50 rounded-xl aspect-square flex flex-col items-center justify-center cursor-pointer transition-all group"
                >
                  <div className="p-4 rounded-full bg-zinc-900 group-hover:bg-amber-500/10 transition-colors">
                    <Upload className="w-6 h-6 text-zinc-500 group-hover:text-amber-500" />
                  </div>
                  <p className="mt-4 text-[10px] uppercase tracking-widest text-zinc-500 group-hover:text-zinc-300">Upload Image</p>
                  <p className="mt-1 text-[8px] text-zinc-600 italic">JPG, PNG or WEBP (Max 14MB)</p>
                </div>
              )}
              
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept="image/*" 
              />
            </section>

            <div className="space-y-3">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-amber-600 hover:bg-amber-500 text-black text-[11px] font-black uppercase tracking-[0.3em] transition-all disabled:opacity-50"
              >
                {loading ? 'Adding to Stock...' : 'Confirm Inventory'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/admin-home')}
                className="w-full py-4 border border-zinc-800 text-zinc-500 text-[11px] uppercase tracking-[0.3em] hover:bg-zinc-900 transition-all"
              >
                Discard
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AddProduct;