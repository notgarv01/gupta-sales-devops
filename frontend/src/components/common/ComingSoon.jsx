import React from 'react';
import { ArrowLeft, Construction, Sparkles, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ComingSoon = ({ title, description }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-zinc-100 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[400px] h-[400px] bg-amber-600/5 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-amber-600/5 blur-[120px] rounded-full"></div>

      <div className="max-w-xl w-full text-center space-y-8 relative z-10">
        
        {/* Animated Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-black uppercase tracking-[0.3em] mb-4">
          <Construction size={14} /> Under Construction
        </div>

        {/* Title */}
        <div className="space-y-2">
          <h1 className="text-5xl md:text-6xl font-serif italic tracking-tight text-white">
            {title}
          </h1>
          <p className="text-zinc-500 text-sm md:text-base max-w-md mx-auto leading-relaxed">
            {description || "We're currently refining this experience to meet our premium standards. It will be available shortly."}
          </p>
        </div>

        {/* Feature Preview Card */}
        <div className="bg-zinc-900/40 border border-zinc-800 p-8 rounded-3xl backdrop-blur-sm shadow-2xl relative group">
          <div className="flex items-center justify-center mb-6">
            <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800 group-hover:border-amber-600/30 transition-all duration-500">
              <Sparkles className="text-amber-600" size={32} />
            </div>
          </div>
          <h3 className="text-zinc-200 font-bold mb-2">Something Premium is Coming</h3>
          <p className="text-zinc-500 text-xs leading-relaxed">
            We are working with our lead developers to bring a cinematic {title.toLowerCase()} interface to your dashboard.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 pt-4">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest"
          >
            <ArrowLeft size={16} /> Go Back
          </button>
          
          <button className="bg-zinc-100 text-black px-8 py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-amber-500 transition-all flex items-center gap-2">
            <Bell size={14} /> Notify Me
          </button>
        </div>

        {/* Footer Brand */}
        <p className="text-[10px] uppercase tracking-[0.5em] text-zinc-700 font-bold pt-12">
          Gupta Sales &bull; Est. 2000
        </p>
      </div>
    </div>
  );
};

export default ComingSoon;
