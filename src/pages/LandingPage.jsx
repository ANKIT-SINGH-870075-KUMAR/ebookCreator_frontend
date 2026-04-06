import React from 'react';
import Navbar from '../components/layout/Navbar';
import Hero from '../components/landing/Hero';
import Features from '../components/landing/Features';
import WritersSection from '../components/landing/WritersSection';
import Testimonials from '../components/landing/Testimonials';
import Footer from '../components/landing/Footer';

const LandingPage = () => {
  return (
    <div>
      <Navbar />
      <Hero />
      <Features />
      <WritersSection />
      <Testimonials/>
      <Footer />
    </div>
  )
}

export default LandingPage;