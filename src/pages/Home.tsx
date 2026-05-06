import React from 'react';
import Header from '../components/Header';
import AboutUs from '../components/AboutUs';
import HeroBanner from '../components/HeroBanner';
import StaffSlider from '../components/StaffSlider';
import FeaturedProjects from '../components/FeaturedProjects';
import Testimonials from '../components/Testimonials';
import StatsGrid from '../components/StatsGrid';
import WhyChooseUs from '../components/WhyChooseUs';
import VideoSection from '../components/VideoSection';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <main>
      <Header />
      <HeroBanner />
      <AboutUs />
      <FeaturedProjects />
      <StaffSlider />
      <Testimonials />
      <StatsGrid />
      <WhyChooseUs />
      <VideoSection />
      <Footer />
    </main>
  );
}
