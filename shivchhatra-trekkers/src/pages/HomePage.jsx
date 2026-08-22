import React, { useState } from 'react';
import HeroSection from '../components/home/HeroSection';
import UpcomingTreksSection from '../components/home/UpcomingTreksSection';
import FortHeritageShowcase from '../components/home/FortHeritageShowcase';
import WhyChooseUs from '../components/home/WhyChooseUs';
import GearChecklistSection from '../components/home/GearChecklistSection';
import TestimonialsGallery from '../components/home/TestimonialsGallery';
import FAQSection from '../components/home/FAQSection';
import TrekDetailModal from '../components/trek/TrekDetailModal';

export default function HomePage() {
  const [selectedTrekForModal, setSelectedTrekForModal] = useState(null);

  const handleScrollToTreks = () => {
    const el = document.getElementById('upcoming-treks');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <main className="min-h-screen">
      {/* 1. Hero Section */}
      <HeroSection onExploreClick={handleScrollToTreks} />

      {/* 2. Upcoming Treks & Batches */}
      <UpcomingTreksSection onSelectTrek={(trek) => setSelectedTrekForModal(trek)} />

      {/* 3. Sacred Sahyadri Forts Heritage */}
      <FortHeritageShowcase />

      {/* 4. Certified Mountaineering Safety Pillars */}
      <WhyChooseUs />

      {/* 5. Interactive Gear & Packing Checklist */}
      <GearChecklistSection />

      {/* 6. Community Stories & Testimonials */}
      <TestimonialsGallery />

      {/* 7. FAQs */}
      <FAQSection />

      {/* Trek Details Modal */}
      <TrekDetailModal
        trek={selectedTrekForModal}
        isOpen={!!selectedTrekForModal}
        onClose={() => setSelectedTrekForModal(null)}
      />
    </main>
  );
}
