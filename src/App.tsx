/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from "react";
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
import { CarUnit, CARS_DATA } from "./data/carsData";
import { useSupabaseCars } from "./lib/useSupabaseData";

export default function App() {
  const [selectedCar, setSelectedCar] = useState<CarUnit | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingInitialService, setBookingInitialService] = useState<string | undefined>(undefined);
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const { cars } = useSupabaseCars();

  // Helper to locate car from either Supabase cars or static CARS_DATA fallback
  const findCarById = useCallback(
    (carId: string): CarUnit | null => {
      const fromLive = cars.find((c) => c.id === carId);
      if (fromLive) return fromLive;
      const fromStatic = CARS_DATA.find((c) => c.id === carId);
      return fromStatic || null;
    },
    [cars]
  );

  // 1. Initial mount and data load: check if window.location.search contains ?carId=...
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const carId = params.get("carId");
    if (carId) {
      const foundCar = findCarById(carId);
      if (foundCar) {
        setSelectedCar(foundCar);
      }
    }
  }, [findCarById]);

  // 2. Popstate event listener for browser navigation & mobile hardware back button
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
      const params = new URLSearchParams(window.location.search);
      const carId = params.get("carId");
      if (carId) {
        const foundCar = findCarById(carId);
        if (foundCar) {
          setSelectedCar(foundCar);
        } else {
          setSelectedCar(null);
        }
      } else {
        // ?carId= is missing, effectively closing modal when user presses mobile back button
        setSelectedCar(null);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [findCarById]);

  // When user clicks to view a car (opening the modal): pushState with ?carId=...
  const handleSelectCar = useCallback((car: CarUnit) => {
    window.history.pushState({ modalId: car.id }, '', '?carId=' + encodeURIComponent(car.id));
    setSelectedCar(car);
  }, []);

  // When user clicks Close (X) button on modal: reset URL to pathname and clear selectedCar
  const handleCloseCarModal = useCallback(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has("carId")) {
      window.history.pushState({}, '', window.location.pathname);
    }
    setSelectedCar(null);
  }, []);

  const handleOpenBooking = useCallback((serviceName?: string) => {
    setBookingInitialService(serviceName);
    setIsBookingModalOpen(true);
  }, []);

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
        <CarCatalog onSelectCar={handleSelectCar} />

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
        onClose={handleCloseCarModal}
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
