import React from 'react';

export default function VideoSection() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row gap-8 lg:gap-16 relative">
          
          {/* Optional Red Dot Decoration (visible on larger screens) */}
          <div className="hidden md:flex absolute left-1/2 top-[160px] lg:top-[180px] -translate-x-1/2 w-3 h-3 bg-[#e82a2e] rounded-full z-10" />

          {/* Left Column */}
          <div className="w-full md:w-1/2 flex flex-col">
            <div className="w-full aspect-video rounded-sm overflow-hidden mb-8 shadow-lg">
              <iframe 
                width="560" 
                height="315" 
                src="https://www.youtube.com/embed/ScMzIvxBSi4" 
                title="Infinity Constructions | A Creator of Unique Experiences" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                allowFullScreen
                className="w-full h-full object-cover"
              ></iframe>
            </div>
            
            <h2 className="text-[#e82a2e] text-2xl sm:text-3xl font-normal mb-6 tracking-tight">
              Explore Our Projects Here
            </h2>
            
            <ul className="list-disc pl-5 space-y-2 text-[#e82a2e] marker:text-[#e82a2e]">
              <li className="pl-1">
                <a href="#" className="hover:underline underline-offset-4 decoration-1">
                  Paris Commercial Center Development
                </a>
              </li>
              <li className="pl-1">
                <a href="#" className="hover:underline underline-offset-4 decoration-1">
                  Algiers Infrastructure & Transport Projects
                </a>
              </li>
              <li className="pl-1">
                <a href="#" className="hover:underline underline-offset-4 decoration-1">
                  Lyon Residential Complex
                </a>
              </li>
              <li className="pl-1">
                <a href="#" className="hover:underline underline-offset-4 decoration-1">
                  Oran Industrial Facilities Refurbishment
                </a>
              </li>
            </ul>
          </div>

          {/* Right Column */}
          <div className="w-full md:w-1/2 flex flex-col">
            <div className="w-full aspect-video rounded-sm overflow-hidden mb-8 shadow-lg">
              <iframe 
                width="560" 
                height="315" 
                src="https://www.youtube.com/embed/ScMzIvxBSi4" 
                title="Igloo Construction - Excellence in France & Algeria" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                allowFullScreen
                className="w-full h-full object-cover"
              ></iframe>
            </div>
            
            <h2 className="text-[#e82a2e] text-lg sm:text-xl font-bold mb-4 tracking-tight">
              Decades of Award-Winning Construction Excellence
            </h2>
            
            <div className="text-gray-800 space-y-6 text-sm sm:text-base leading-relaxed">
              <p>
                As a leading force in the construction sector, Igloo Construction delivers landmark projects across France and Algeria. Our cross-continental expertise bridges European engineering standards with dynamic infrastructural growth.
              </p>
              <p>
                Backed by top-tier safety and quality ratings, and fully certified under international ISO standards, we have successfully completed hundreds of transformative projects across diverse sectors in both regions.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
