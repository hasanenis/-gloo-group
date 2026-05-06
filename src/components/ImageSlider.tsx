import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { imageSliderImages } from '../data/projects';

const IMAGES = imageSliderImages;

export default function ImageSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % IMAGES.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + IMAGES.length) % IMAGES.length);

  return (
    <div className="relative w-full aspect-[3/2] overflow-hidden bg-gray-100 group">
      <AnimatePresence>
        <motion.img
          key={currentIndex}
          src={IMAGES[currentIndex]}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </AnimatePresence>

      {/* Navigation Arrows at Bottom Right */}
      <div className="absolute bottom-4 right-4 flex bg-white/90 backdrop-blur-sm z-10 transition-transform duration-500 ease-out shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
        <button 
          onClick={prevSlide}
          className="w-10 h-10 bg-transparent hover:bg-gray-100 flex items-center justify-center text-black transition-colors group/btn"
        >
          <ArrowLeft strokeWidth={1.5} className="w-5 h-5 transform group-hover/btn:-translate-x-1 transition-transform duration-300" />
        </button>
        <button 
          onClick={nextSlide}
          className="w-10 h-10 bg-transparent hover:bg-gray-100 border-l border-gray-200 flex items-center justify-center text-black transition-colors group/btn"
        >
          <ArrowRight strokeWidth={1.5} className="w-5 h-5 transform group-hover/btn:translate-x-1 transition-transform duration-300" />
        </button>
      </div>
    </div>
  );
}
