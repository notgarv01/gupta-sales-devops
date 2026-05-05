import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import GuptaSalesLogo from '../../../assets/GuptaSalesLogo.png';
import IntroImage from '../../../assets/IntroImage.png';
import Footer from '../../common/Footer';
import ThemeToggle from '../../common/ThemeToggle';

const IntroGuptaSales = () => {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      
      setScrolled(currentScrollY > 50);
      setLastScrollY(currentScrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-amber-500/30">
      {/* Navigation - Ultra Minimal */}
      <nav className={`fixed top-0 w-full z-50 flex justify-between items-center px-4 md:px-8 py-3 md:py-4 mix-blend-difference transition-all duration-300 ${scrolled ? 'bg-zinc-950/90 backdrop-blur-md' : 'bg-transparent'} ${hidden ? '-translate-y-full' : 'translate-y-0'} transition-transform duration-300`}>
        <img src={GuptaSalesLogo} alt="Gupta Sales Logo" className="h-12 md:h-20 w-auto" />
        <div className="flex items-center gap-4 md:gap-8">
          <div className="flex gap-4 md:gap-8 text-[10px] md:text-xs tracking-widest uppercase opacity-70">
            <Link to="/collection" className="hover:opacity-100 transition-opacity hidden sm:block">Collection</Link>
            <Link to="/heritage" className="hover:opacity-100 transition-opacity hidden sm:block">Heritage</Link>
            <Link to="/user-login" className="hover:opacity-100 transition-opacity">Shop Now</Link>
          </div>
          <ThemeToggle />
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex flex-col justify-center items-center overflow-hidden">
        {/* Background Accent - Soft Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-600/10 blur-[120px] rounded-full" />

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="text-center z-10 px-4"
        >
          <span className="text-amber-500 text-[10px] md:text-xs tracking-[0.3em] uppercase mb-4 block font-medium">
            Est. 2000 — The Original Quality
          </span>
          <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-9xl font-serif italic tracking-tight mb-6">
            Gupta <span className="text-zinc-500">Sales.</span>
          </h2>
          <p className="max-w-md mx-auto text-xs sm:text-sm text-zinc-400 leading-relaxed tracking-wide font-light px-4">
            Crafting the essence of tradition. From the finest Chai Patti to the 
            purity of Mehendi and Manjan. Experience the OG lifestyle.
          </p>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30"
        >
          <span className="text-[10px] uppercase tracking-widest">Scroll</span>
          <div className="w-[1px] h-12 bg-zinc-100" />
        </motion.div>
      </section>

      {/* Product Highlight Grid */}
      <section id="collection" className="py-16 md:py-32 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-16 items-center">
          <motion.div 
            whileInView={{ opacity: 1, x: 0 }}
            initial={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-8 aspect-[16/10] bg-zinc-900 border border-zinc-800 rounded-sm overflow-hidden relative group"
          >
            {/* Placeholder for high-res Chai image */}
            <img src={IntroImage} alt="" className="w-full h-full object-cover object-center" />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 to-transparent" />
            <div className="absolute bottom-4 md:bottom-8 left-4 md:left-8">
              <h3 className="text-xl md:text-2xl font-serif italic">Premium Chai Patti</h3>
              <p className="text-[10px] md:text-xs text-amber-500 mt-2 uppercase tracking-widest">Strong • Authentic • Pure</p>
            </div>
          </motion.div>

          <div className="lg:col-span-4 space-y-8 md:space-y-12">
            <motion.div 
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 30 }}
              className="border-l border-zinc-800 pl-4 md:pl-8"
            >
              <h4 className="text-lg md:text-xl mb-4 font-medium italic">Our Essence</h4>
              <p className="text-zinc-500 text-xs md:text-sm leading-loose italic">
                "We don't just sell products; we sell memories of home. Every pinch of our Mehendi 
                and every leaf of our Chai is tested for purity that spans generations."
              </p>
            </motion.div>
            
            <button className="px-8 py-3 md:px-10 md:py-4 border border-zinc-800 text-[10px] md:text-xs uppercase tracking-[0.2em] hover:bg-zinc-100 hover:text-zinc-950 transition-all duration-500">
              Explore the Archive
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default IntroGuptaSales;