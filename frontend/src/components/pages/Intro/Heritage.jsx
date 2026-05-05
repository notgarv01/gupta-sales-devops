import React from 'react';

const Heritage = () => {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Hero Header */}
      <section className="h-[60vh] md:h-[70vh] flex flex-col justify-center items-center border-b border-zinc-900 px-4">
        <span className="text-amber-500 tracking-[0.5em] uppercase text-[10px] mb-4">Our Legacy</span>
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-9xl font-serif italic tracking-tighter text-center">Since 2000</h1>
      </section>

      {/* Story Sections */}
      <section className="py-16 md:py-32 px-4 md:px-8 max-w-5xl mx-auto space-y-24 md:space-y-44">
        {/* Origin */}
        <div className="flex flex-col md:flex-row gap-12 md:gap-20 items-center">
          <div className="flex-1 order-2 md:order-1">
            <h3 className="text-2xl md:text-3xl font-serif italic mb-4 md:mb-6">The First Blend</h3>
            <p className="text-zinc-500 leading-relaxed font-light italic text-base md:text-lg">
              "In the dusty streets of Rajasthan, Gupta Sales started with a single goal: to find a 
              chai patti that didn't just taste like tea, but felt like home."
            </p>
          </div>
          <div className="w-full md:w-72 aspect-[3/4] bg-zinc-900 border border-zinc-800 grayscale grayscale-hover transition-all order-1 md:order-2">
             <img src="/ProductImages/Chai-pattii.png" className="w-full h-full object-cover opacity-50" />
          </div>
        </div>

        {/* Quality Commitment */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="w-px h-24 bg-amber-600/30 mx-auto mb-12" />
          <h3 className="text-2xl md:text-3xl font-serif italic mb-8">Purity as a Standard</h3>
          <p className="text-zinc-400 text-xs md:text-sm leading-loose tracking-widest uppercase">
            NO ARTIFICIAL COLORS • DIRECT FROM SOURCE • HAND-SELECTED LEAVES • THE OG PROMISE
          </p>
        </div>
      </section>
    </div>
  );
};

export default Heritage;