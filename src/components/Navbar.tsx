import { useState, useEffect } from "react";
import { Menu, X, LogIn } from "lucide-react";
import Logo from "./Logo";

interface NavbarProps {
  onOpenBooking?: () => void;
}

export default function Navbar({ onOpenBooking }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock background body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  // Automatically close mobile menu if screen resizes to desktop breakpoint
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <header
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 pt-[env(safe-area-inset-top,0px)] ${
        isScrolled || mobileMenuOpen
          ? "bg-[#0F0F11]/95 backdrop-blur-md border-b border-[#1F1F23] py-2 sm:py-2.5 md:py-3 shadow-xl"
          : "bg-transparent py-3 sm:py-3.5 md:py-5 border-b border-white/5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-6 lg:gap-12">
        {/* Logo */}
        <a
          href="#"
          id="navbar-logo-link"
          className="flex items-center shrink-0 group transition-opacity hover:opacity-90 py-1"
        >
          <Logo className="h-14 sm:h-16 md:h-11 lg:h-12 w-auto" />
        </a>

        {/* Desktop Navigation Links - balanced spacing & single-line horizontal alignment */}
        <nav
          id="desktop-nav-menu"
          className="hidden md:flex items-center gap-5 lg:gap-7 xl:gap-9 text-xs lg:text-[13px] tracking-[0.14em] font-medium text-neutral-300"
        >
          <a
            href="#beranda"
            id="nav-link-beranda"
            className="whitespace-nowrap hover:text-[#D4AF37] transition-colors uppercase py-1"
          >
            Beranda
          </a>
          <a
            href="#layanan"
            id="nav-link-layanan"
            className="whitespace-nowrap hover:text-[#D4AF37] transition-colors uppercase py-1"
          >
            Layanan
          </a>
          <a
            href="#katalog-mobil"
            id="nav-link-mobil"
            className="whitespace-nowrap hover:text-[#D4AF37] transition-colors uppercase py-1 inline-block"
          >
            Mobil Bekas
          </a>
          <a
            href="#portofolio"
            id="nav-link-portofolio"
            className="whitespace-nowrap hover:text-[#D4AF37] transition-colors uppercase py-1"
          >
            Portofolio
          </a>
          <a
            href="#kontak"
            id="nav-link-kontak"
            className="whitespace-nowrap hover:text-[#D4AF37] transition-colors uppercase py-1"
          >
            Kontak
          </a>
        </nav>

        {/* Header Action Button - Reservasi & Login Admin CTA */}
        <div className="hidden sm:flex items-center gap-3">
          {onOpenBooking && (
            <button
              type="button"
              onClick={onOpenBooking}
              id="btn-header-booking"
              className="px-3.5 py-2 border border-[#D4AF37]/50 hover:border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37]/10 transition-all duration-200 text-xs font-semibold tracking-wider uppercase bg-black/40 backdrop-blur-sm cursor-pointer"
            >
              Reservasi
            </button>
          )}
          <a
            href="/admin"
            id="btn-header-login-admin"
            className="inline-flex items-center gap-2 px-4 py-2 border border-neutral-700 hover:border-[#D4AF37] text-neutral-300 hover:text-[#D4AF37] transition-all duration-200 text-xs font-semibold tracking-wider uppercase bg-black/40 backdrop-blur-sm shadow-sm"
          >
            <LogIn className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>LOGIN ADMIN</span>
          </a>
        </div>

        {/* Mobile menu toggle (>= 44x44px touch target) */}
        <button
          id="btn-mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
          className="md:hidden min-w-[44px] min-h-[44px] flex items-center justify-center text-neutral-300 hover:text-white focus:outline-none transition-colors"
        >
          {mobileMenuOpen ? <X className="w-6 h-6 text-[#D4AF37]" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer Menu & Backdrop */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop Click to Close */}
          <div
            className="fixed inset-0 top-[64px] sm:top-[74px] bg-black/75 backdrop-blur-sm z-30 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Content */}
          <div
            id="mobile-drawer-menu"
            className="fixed inset-x-0 top-full z-40 md:hidden bg-[#101115]/98 backdrop-blur-xl border-b border-[#23262D] px-5 py-5 space-y-4 text-sm max-h-[calc(100dvh-5rem)] overflow-y-auto shadow-2xl animate-in slide-in-from-top-3 duration-200"
          >
            <div className="flex flex-col space-y-1 font-medium tracking-wider text-neutral-300 uppercase text-xs">
              <a
                href="#beranda"
                onClick={() => setMobileMenuOpen(false)}
                className="min-h-[44px] flex items-center px-2 hover:text-[#D4AF37] hover:bg-white/[0.02] border-b border-white/5 transition-colors"
              >
                Beranda
              </a>
              <a
                href="#standar"
                onClick={() => setMobileMenuOpen(false)}
                className="min-h-[44px] flex items-center px-2 hover:text-[#D4AF37] hover:bg-white/[0.02] border-b border-white/5 transition-colors"
              >
                Standar Kualitas
              </a>
              <a
                href="#layanan"
                onClick={() => setMobileMenuOpen(false)}
                className="min-h-[44px] flex items-center px-2 hover:text-[#D4AF37] hover:bg-white/[0.02] border-b border-white/5 transition-colors"
              >
                Layanan Otomotif
              </a>
              <a
                href="#katalog-mobil"
                onClick={() => setMobileMenuOpen(false)}
                className="min-h-[44px] flex items-center px-2 hover:text-[#D4AF37] hover:bg-white/[0.02] border-b border-white/5 whitespace-nowrap transition-colors"
              >
                Mobil Bekas
              </a>
              <a
                href="#portofolio"
                onClick={() => setMobileMenuOpen(false)}
                className="min-h-[44px] flex items-center px-2 hover:text-[#D4AF37] hover:bg-white/[0.02] border-b border-white/5 transition-colors"
              >
                Portofolio Pengerjaan
              </a>
              <a
                href="#kontak"
                onClick={() => setMobileMenuOpen(false)}
                className="min-h-[44px] flex items-center px-2 hover:text-[#D4AF37] hover:bg-white/[0.02] border-b border-white/5 transition-colors"
              >
                Lokasi &amp; Kontak
              </a>
            </div>

            <div className="pt-2 space-y-3 pb-[calc(1rem+env(safe-area-inset-bottom,0px))]">
              {onOpenBooking && (
                <button
                  type="button"
                  id="btn-mobile-booking"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenBooking();
                  }}
                  className="w-full min-h-[46px] py-3 px-4 border border-[#D4AF37] bg-[#D4AF37] hover:bg-[#E5C05B] text-black font-semibold text-xs tracking-[0.2em] uppercase flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer shadow-lg shadow-[#D4AF37]/15"
                >
                  <span>RESERVASI &amp; KONSULTASI</span>
                </button>
              )}
              <a
                href="/admin"
                id="btn-mobile-login-admin"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full min-h-[46px] py-3 px-4 border border-white/20 bg-white/5 hover:bg-white/10 text-white font-semibold text-xs tracking-[0.2em] uppercase flex items-center justify-center gap-2 transition-all duration-200"
              >
                <LogIn className="w-4 h-4 text-[#D4AF37]" />
                <span>LOGIN ADMIN</span>
              </a>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
