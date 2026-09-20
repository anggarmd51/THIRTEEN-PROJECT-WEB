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

  return (
    <header
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? "bg-[#0F0F11]/95 backdrop-blur-md border-b border-[#1F1F23] py-2.5 sm:py-3 shadow-xl"
          : "bg-transparent py-4 sm:py-5 border-b border-white/5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-6 lg:gap-12">
        {/* Logo */}
        <a
          href="#"
          id="navbar-logo-link"
          className="flex items-center shrink-0 group transition-opacity hover:opacity-90 py-1"
        >
          <Logo />
        </a>

        {/* Desktop Navigation Links - balanced spacing */}
        <nav
          id="desktop-nav-menu"
          className="hidden md:flex items-center gap-6 lg:gap-9 text-xs lg:text-sm tracking-[0.15em] font-medium text-neutral-400"
        >
          <a
            href="#beranda"
            id="nav-link-beranda"
            className="hover:text-white transition-colors uppercase py-1"
          >
            Beranda
          </a>
          <a
            href="#layanan"
            id="nav-link-layanan"
            className="hover:text-white transition-colors uppercase py-1"
          >
            Layanan
          </a>
          <a
            href="#katalog-mobil"
            id="nav-link-mobil"
            className="hover:text-white transition-colors uppercase py-1"
          >
            Mobil Bekas
          </a>
          <a
            href="#portofolio"
            id="nav-link-portofolio"
            className="hover:text-white transition-colors uppercase py-1"
          >
            Portofolio
          </a>
          <a
            href="#kontak"
            id="nav-link-kontak"
            className="hover:text-white transition-colors uppercase py-1"
          >
            Kontak
          </a>
        </nav>

        {/* Header Action Button - Single clean Login Admin CTA */}
        <div className="hidden sm:flex items-center">
          <a
            href="/admin"
            id="btn-header-login-admin"
            className="inline-flex items-center gap-2 px-4 py-2 border border-neutral-700 hover:border-[#D4AF37] text-neutral-300 hover:text-[#D4AF37] transition-all duration-200 text-xs font-semibold tracking-wider uppercase rounded-none bg-black/40 backdrop-blur-sm shadow-sm"
          >
            <LogIn className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>LOGIN ADMIN</span>
          </a>
        </div>

        {/* Mobile menu toggle */}
        <button
          id="btn-mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
          className="md:hidden p-2 text-neutral-300 hover:text-white focus:outline-none"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          id="mobile-drawer-menu"
          className="md:hidden bg-[#121215] border-b border-[#1F1F23] px-6 py-6 space-y-4 text-sm"
        >
          <div className="flex flex-col space-y-3 font-medium tracking-wider text-neutral-300 uppercase text-xs">
            <a
              href="#beranda"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 hover:text-[#D4AF37] border-b border-white/5"
            >
              Beranda
            </a>
            <a
              href="#standar"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 hover:text-[#D4AF37] border-b border-white/5"
            >
              Standar Kualitas
            </a>
            <a
              href="#layanan"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 hover:text-[#D4AF37] border-b border-white/5"
            >
              Layanan Otomotif
            </a>
            <a
              href="#katalog-mobil"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 hover:text-[#D4AF37] border-b border-white/5"
            >
              Stok Mobil Bekas
            </a>
            <a
              href="#portofolio"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 hover:text-[#D4AF37] border-b border-white/5"
            >
              Portofolio Pengerjaan
            </a>
            <a
              href="#kontak"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 hover:text-[#D4AF37] border-b border-white/5"
            >
              Lokasi & Kontak
            </a>
          </div>

          <div className="pt-3 space-y-2.5">
            <a
              href="/admin"
              id="btn-mobile-login-admin"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-3 px-4 border border-[#D4AF37] bg-[#D4AF37]/10 hover:bg-[#D4AF37] text-[#D4AF37] hover:text-black font-semibold text-xs tracking-[0.2em] uppercase flex items-center justify-center gap-2 transition-all duration-200"
            >
              <LogIn className="w-4 h-4" />
              <span>LOGIN ADMIN</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
