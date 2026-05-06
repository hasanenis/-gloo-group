import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin,  PinIcon as Pinterest, Youtube } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-black text-gray-300 font-sans pt-16 pb-8 border-t border-red-800/30">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Top Section - Logo */}
        <div className="mb-12">
          {/* Logo container */}
          <div className="flex items-center">
             <img 
              src="https://i.ibb.co/fY50LKcW/Chat-GPT-mage-5-May-2026-21-15-03-removebg-preview.png" 
              alt="Igloo Construction" 
              className="h-16 object-contain"
            />
          </div>
        </div>

        {/* Middle Section - Links & Locations */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16 border-b border-gray-800 pb-16">
          
          {/* Quick Links */}
          <div>
            <h3 className="text-white text-lg font-medium mb-6">Quick Links</h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
              <a href="#" className="hover:text-white transition-colors">Resources</a>
              <a href="#" className="hover:text-white transition-colors">News & Media</a>
              <a href="#" className="hover:text-white transition-colors">Commercial</a>
              <a href="#" className="hover:text-white transition-colors">Residential</a>
              <a href="#" className="hover:text-white transition-colors">Construction</a>
              <a href="#" className="hover:text-white transition-colors">Infrastructure</a>
              <a href="#" className="hover:text-white transition-colors">People</a>
              <a href="#" className="hover:text-white transition-colors">Brochures</a>
              <a href="#" className="hover:text-white transition-colors">Heritage</a>
            </div>
          </div>

          {/* Conditions */}
          <div>
            <h3 className="text-white text-lg font-medium mb-6">Conditions</h3>
            <div className="flex flex-col gap-y-3 text-sm">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Legal</a>
            </div>
          </div>

          {/* Algiers (Replaces Sydney) */}
          <div>
            <h3 className="text-white text-lg font-medium mb-6">Algiers</h3>
            <address className="not-italic text-sm space-y-2 text-gray-400">
              <p>Level 4,</p>
              <p>Boulevard Colonel Bougara,</p>
              <p>El Biar, Algiers 16000</p>
              <p className="pt-2 text-gray-300">T: +213 21 90 22 45</p>
            </address>
          </div>

          {/* Paris (Replaces Melbourne) */}
          <div className="relative">
            {/* Optional red dot to match original image for Melbourne/Paris */}
            <div className="absolute -top-6 left-0 hidden lg:block">
              <div className="w-2 h-2 bg-[#e82a2e] rounded-full"></div>
            </div>
            
            <h3 className="text-white text-lg font-medium mb-6">Paris</h3>
            <address className="not-italic text-sm space-y-2 text-gray-400">
              <p>Suite G.04</p>
              <p>Avenue des Champs-Élysées</p>
              <p>75008 Paris</p>
              <p className="pt-2 text-gray-300">T: +33 1 42 68 53 00</p>
            </address>
          </div>

        </div>

        {/* Bottom Section - Certifications & Social */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-12">
          
          {/* Certifications (Visual Placeholders matching design) */}
          <div className="flex flex-wrap gap-6 items-center">
             {/* Using placeholder divs to mimic badges if images are unavailable, but ideally they'd be actual badge images. 
                 For now, we'll build simple CSS badges to match the aesthetic. */}
             
             <div className="flex flex-col items-center gap-2">
                <div className="w-20 h-20 rounded-full border-2 border-blue-500 flex items-center justify-center text-xs text-center font-bold text-blue-500 p-2 relative">
                  <div className="absolute inset-2 border border-blue-500/50 rounded-full border-dashed"></div>
                  ISO 9001<br/>QUALITY<br/><span className="text-[8px] font-normal">SYSTEM</span>
                </div>
                <span className="text-xs text-gray-400">Policy<br/>Certificate</span>
             </div>

             <div className="flex flex-col items-center gap-2">
                <div className="w-20 h-20 rounded-full border-2 border-green-500 flex items-center justify-center text-xs text-center font-bold text-green-500 p-2 relative">
                  <div className="absolute inset-2 border border-green-500/50 rounded-full border-dashed"></div>
                  ISO 14001<br/>ENVIRON<br/><span className="text-[8px] font-normal">SYSTEM</span>
                </div>
                <span className="text-xs text-gray-400">Policy<br/>Certificate</span>
             </div>

             <div className="flex flex-col items-center gap-2">
                <div className="w-20 h-20 rounded-full border-2 border-red-500 flex items-center justify-center text-xs text-center font-bold text-red-500 p-2 relative">
                  <div className="absolute inset-2 border border-red-500/50 rounded-full border-dashed"></div>
                  ISO 45001<br/>OHS<br/><span className="text-[8px] font-normal">SYSTEM</span>
                </div>
                <span className="text-xs text-gray-400">Policy<br/>Certificate</span>
             </div>

             <div className="flex flex-col items-center gap-2">
                <div className="w-20 h-20 rounded-full border-2 border-red-600 bg-black flex items-center justify-center text-xs text-center font-bold text-red-600 p-2 relative overflow-hidden">
                  <span className="text-4xl leading-none">A</span>
                  <div className="absolute inset-0 rounded-full border-2 border-red-600 border-dashed transform scale-90"></div>
                </div>
                <span className="text-xs text-gray-400 mt-2">Certificate</span>
             </div>
             
             {/* Text-based iCIRT alternative */}
             <div className="bg-white text-black p-2 rounded w-32 h-20 flex flex-col items-center justify-center -mt-8">
               <div className="text-blue-500 font-bold text-2xl tracking-tighter">iCIRT</div>
               <div className="flex text-yellow-400 gap-0.5 mt-1">
                 {'★★★★★'}
               </div>
               <div className="text-[8px] text-gray-500 mt-1 uppercase">LAST RATED SEP 2025</div>
             </div>

             {/* NSCA Foundation alternative */}
             <div className="bg-[#002f6c] text-white p-2 rounded w-32 h-20 flex flex-col items-center justify-between border-b-4 border-[#cda270] -mt-8">
               <div className="text-[#00a3e0] font-black text-xl italic tracking-tighter">NSCA</div>
               <div className="text-xs font-bold leading-none">Foundation</div>
               <div className="text-[8px] w-full bg-[#cda270] text-black text-center font-bold py-0.5 mt-1">BRONZE MEMBER 2024</div>
             </div>
          </div>

          {/* Stay Connected */}
          <div className="flex flex-col items-start lg:items-end">
            <h3 className="text-white text-lg font-medium mb-4">Stay Connected</h3>
            <div className="flex items-center gap-3">
              <a href="#" className="w-8 h-8 rounded-full bg-gray-300 text-black flex items-center justify-center hover:bg-white transition-colors">
                <Facebook className="w-4 h-4 fill-current" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-gray-300 text-black flex items-center justify-center hover:bg-white transition-colors">
                {/* Mimicking X/Twitter logo */}
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" /></svg>
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-gray-300 text-black flex items-center justify-center hover:bg-white transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-gray-300 text-black flex items-center justify-center hover:bg-white transition-colors">
                <Linkedin className="w-4 h-4 fill-current" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-gray-300 text-black flex items-center justify-center hover:bg-white transition-colors">
                <Pinterest className="w-4 h-4 fill-current" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-gray-300 text-black flex items-center justify-center hover:bg-white transition-colors">
                <Youtube className="w-4 h-4 fill-current" />
              </a>
            </div>
          </div>

        </div>

        {/* Copyright */}
        <div className="text-xs text-gray-500 pt-4 border-t border-gray-800">
          <p>© 2026 Igloo Construction. All rights reserved. RC 16B1098634</p>
        </div>

      </div>
    </footer>
  );
}
