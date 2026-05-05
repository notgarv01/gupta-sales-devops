import { motion } from 'framer-motion';

const products = [
  { id: 1, name: 'Assam Gold Tea', image: '/ProductImages/Chai-pattii.png', cat: 'Chai Patti', color: 'from-amber-500/20' },
  { id: 2, name: 'Mehendi', image: '/ProductImages/Herbal-heena-mehendi.webp', cat: 'Mehendi', color: 'from-green-500/20' },
  { id: 3, name: 'Manjan', image: '/ProductImages/Manjan.webp', cat: 'Wellness', color: 'from-blue-500/20' },
  { id: 4, name: 'Vintage Matchbox', image: '/ProductImages/Matchbox.webp', cat: 'Essentials', color: 'from-red-500/20' },
];

const Collection = () => {
  return (
    <div className="min-h-screen bg-[#050505] py-20 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
          <div>
            <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter">
              THE <span className="text-zinc-700">ARCHIVE</span>
            </h2>
            <div className="flex items-center gap-2 mt-2">
              <span className="h-[1px] w-8 bg-amber-500"></span>
              <p className="text-amber-500 font-mono text-xs uppercase tracking-widest">Selected Works 2026</p>
            </div>
          </div>
          <p className="text-zinc-500 max-w-xs text-sm leading-relaxed">
            A curated collection of heritage essentials, redesigned for the modern era.
          </p>
        </div>

        {/* Dynamic Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="group relative h-[500px] overflow-hidden rounded-3xl bg-zinc-900 border border-zinc-800"
            >
              {/* Background Glow on Hover */}
              <div className={`absolute inset-0 bg-gradient-to-t ${product.color} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

              {/* Image */}
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover scale-[1.02] group-hover:scale-110 transition-transform duration-700 ease-out grayscale-[0.5] group-hover:grayscale-0"
              />

              {/* Top Tag */}
              <div className="absolute top-5 left-5">
                <span className="backdrop-blur-md bg-black/40 border border-white/10 text-white text-[10px] px-3 py-1 rounded-full uppercase tracking-widest">
                  {product.cat}
                </span>
              </div>

              {/* Bottom Info Panel - Slides up on hover */}
              <div className="absolute inset-x-0 bottom-0 p-6 translate-y-[30%] group-hover:translate-y-0 transition-transform duration-500 ease-out bg-gradient-to-t from-black via-black/80 to-transparent">
                <div className="flex justify-between items-end">
                  <div>
                    <h3 className="text-2xl font-bold text-white leading-none mb-2">
                      {product.name}
                    </h3>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity delay-100">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="h-1 w-4 bg-amber-500 rounded-full" />
                      ))}
                    </div>
                  </div>
                  
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    className="bg-white text-black p-3 rounded-full hover:bg-amber-500 transition-colors"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Background Decorative Text */}
        <div className="mt-20 overflow-hidden whitespace-nowrap opacity-[0.02] pointer-events-none select-none">
          <h2 className="text-[15vw] font-black leading-none">
            HERITAGE QUALITY ESSENTIALS
          </h2>
        </div>
      </div>
    </div>
  );
};

export default Collection;