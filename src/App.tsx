/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import AboutStandard from "./components/AboutStandard";
import ServicesSection from "./components/ServicesSection";
import PortfolioSlider from "./components/PortfolioSlider";
import CarCatalog from "./components/CarCatalog";
import CarDetailModal from "./components/CarDetailModal";
import CtaBanner from "./components/CtaBanner";
import Footer from "./components/Footer";
import FloatingWhatsApp from "./components/FloatingWhatsApp";
import BookingModal from "./components/BookingModal";
import AdminLogin from "./components/AdminLogin";
import { CarUnit } from "./data/carsData";

export default function App() {
  const [selectedCar, setSelectedCar] = useState<CarUnit | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingInitialService, setBookingInitialService] = useState<string | undefined>(undefined);
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const handleOpenBooking = (serviceName?: string) => {
    setBookingInitialService(serviceName);
    setIsBookingModalOpen(true);
  };

  // If path is /admin or starts with /admin, render AdminLogin view
  if (currentPath === "/admin" || currentPath.startsWith("/admin")) {
    return <AdminLogin />;
  }

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#0F0F11] text-white flex flex-col selection:bg-[#D4AF37] selection:text-black">
      {/* Fixed Luxury Header */}
      <Navbar onOpenBooking={() => handleOpenBooking()} />

      {/* Main Content Sections */}
      <main className="flex-grow w-full overflow-x-hidden">
        {/* 1. Hero Section */}
        <Hero onOpenBooking={() => handleOpenBooking()} />

        {/* 2. About & Standard Section */}
        <AboutStandard />

        {/* 3. Services Section */}
        <ServicesSection onSelectServiceForBooking={(service) => handleOpenBooking(service)} />

        {/* 4. Portfolio Section (Carousel Slider) */}
        <PortfolioSlider onOpenBookingWithService={(service) => handleOpenBooking(service)} />

        {/* 5. Car Inventory Catalog Grid */}
        <CarCatalog onSelectCar={(car) => setSelectedCar(car)} />

        {/* 6. Gold Call to Action Banner */}
        <CtaBanner />
      </main>

      {/* 7. Comprehensive Footer */}
      <Footer />

      {/* 8. Floating WhatsApp Pill Button */}
      <FloatingWhatsApp />

      {/* 9. Interactive Car Detail Modal with Photo Slider & Specs */}
      <CarDetailModal
        car={selectedCar}
        onClose={() => setSelectedCar(null)}
      />

      {/* 10. Quick Consultation & Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => {
          setIsBookingModalOpen(false);
          setBookingInitialService(undefined);
        }}
        initialService={bookingInitialService}
      />
    </div>
  );
}
