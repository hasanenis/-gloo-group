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
import ClientGuideOverlay from '../components/ClientGuideOverlay';

const homeGuideSections = [
  {
    id: 'hero',
    label: 'Açılış / İlk İzlenim',
    purpose: 'Markanın ilk saniyede güçlü, profesyonel ve güven veren bir izlenim bırakmasını sağlar.',
    behavior: 'Büyük görsel, net başlık ve hareketli giriş efektleriyle ziyaretçiyi sayfaya çeker ve markanın tonunu hemen hissettirir.',
  },
  {
    id: 'about',
    label: 'Hakkımızda',
    purpose: 'Firmanın kim olduğunu, yaklaşımını ve neden farklı olduğunu kısa sürede anlatır.',
    behavior: 'Kurumsal metin ve düzenli içerik akışıyla ziyaretçiye güven verir; satış baskısı yapmadan marka karakterini açıklar.',
  },
  {
    id: 'projects',
    label: 'Our Projects',
    purpose: 'Firmanın iş kalitesini ve tasarım seviyesini gerçek proje örnekleriyle görünür hale getirir.',
    behavior: 'Yatay akan proje kartları ziyaretçiyi aktif biçimde içeriğe dahil eder ve her projeyi premium bir vitrin gibi sunar.',
  },
  {
    id: 'team',
    label: 'Ekip / Kadro',
    purpose: 'Markanın arkasında gerçek bir ekip olduğunu göstererek güveni insan yüzleri üzerinden güçlendirir.',
    behavior: 'Kaydırmalı ekip alanı sayfaya hareket katar ve markayı daha erişilebilir, daha samimi gösterir.',
  },
  {
    id: 'testimonials',
    label: 'Yorumlar / Sosyal Kanıt',
    purpose: 'Potansiyel müşterinin karar vermesini kolaylaştırmak için güven unsuru üretir.',
    behavior: 'Müşteri görüşleri veya referans anlatıları, ziyaretçinin “bu ekip daha önce de iyi iş çıkarmış” hissine girmesini sağlar.',
  },
  {
    id: 'stats',
    label: 'Rakamlarla Güç',
    purpose: 'Markanın deneyimini ve ölçeğini hızlı okunabilen verilerle destekler.',
    behavior: 'Sayısal istatistikler, uzun açıklama okumadan başarıyı birkaç saniyede anlaşılır hale getirir.',
  },
  {
    id: 'why-us',
    label: 'Infinity / Together to eternity',
    purpose: 'Markanın süreç yaklaşımını, vizyonunu ve uzun vadeli güven vaadini daha editoryal bir anlatımla sunar.',
    behavior: 'Scroll ilerledikçe değişen faz yapısı ve infinity görseli, firmanın çalışma modelini klasik metinden daha etkileyici şekilde açıklar.',
  },
  {
    id: 'video',
    label: 'Video Anlatım',
    purpose: 'Markayı daha canlı, daha çağdaş ve daha ikna edici göstermeyi amaçlar.',
    behavior: 'Video alanı hareket, atmosfer ve iş detayını bir araya getirir; ziyaretçinin sayfada daha uzun kalmasına yardımcı olur.',
  },
  {
    id: 'footer',
    label: 'Kapanış / İletişim',
    purpose: 'Sayfa sonunda ziyaretçiyi net bir sonraki adıma yönlendirir.',
    behavior: 'İletişim, bağlantılar ve son bilgi alanı sayesinde kullanıcı ister teklif ister detay bilgi için kolayca aksiyona geçer.',
  },
] as const;

export default function Home() {
  return (
    <main className="relative">
      <Header />
      <section data-guide-section="hero">
        <HeroBanner />
      </section>
      <section data-guide-section="about">
        <AboutUs />
      </section>
      <section data-guide-section="projects" className="overflow-x-hidden">
        <FeaturedProjects />
      </section>
      <section data-guide-section="team">
        <StaffSlider />
      </section>
      <section data-guide-section="testimonials">
        <Testimonials />
      </section>
      <section data-guide-section="stats">
        <StatsGrid />
      </section>
      <section data-guide-section="why-us">
        <WhyChooseUs />
      </section>
      <section data-guide-section="video">
        <VideoSection />
      </section>
      <section data-guide-section="footer">
        <Footer />
      </section>
      <ClientGuideOverlay items={homeGuideSections} />
    </main>
  );
}
