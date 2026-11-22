import { memo, useCallback, useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Overview', href: '#hero' },
  { label: 'Craft', href: '#craft' },
  { label: 'Anatomy', href: '#anatomy' },
  { label: 'Specs', href: '#specs' },
] as const;

export const Navbar = memo(function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const next = window.scrollY > 24;
      setScrolled((prev) => (prev !== next ? next : prev));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const toggleMenu = useCallback(() => {
    setMenuOpen((prev) => !prev);
  }, []);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-colors duration-300 ${
        scrolled || menuOpen
          ? 'bg-black/80 backdrop-blur-xl border-b border-white/[0.08]'
          : 'bg-black/30 backdrop-blur-md border-b border-transparent'
      }`}
    >
      <nav
        aria-label="Primary Navigation"
        className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5 sm:px-8"
      >
        {/* Brand Wordmark */}
        <a
          href="#hero"
          onClick={closeMenu}
          className="flex items-center gap-2 text-[15px] font-semibold tracking-tight text-[#f5f5f7] transition-opacity hover:opacity-80"
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-full border border-white/20 text-[11px] font-bold tracking-normal">
            S
          </span>
          <span>Skye</span>
          <span className="font-normal text-[#86868b]">One</span>
        </a>

        {/* Desktop Links */}
        <div className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-xs font-normal tracking-wide text-[#a1a1a6] transition-colors hover:text-[#f5f5f7]"
            >
              {item.label}
            </a>
          ))}
        </div>

        {/* Right Action + Mobile Toggle */}
        <div className="flex items-center gap-3">
          <a
            href="#studio"
            onClick={closeMenu}
            className="rounded-full bg-[#f5f5f7] px-4 py-1.5 text-xs font-medium text-black transition hover:bg-white active:scale-[0.98]"
          >
            Customize
          </a>

          <button
            type="button"
            onClick={toggleMenu}
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={menuOpen}
            className="flex h-8 w-8 items-center justify-center rounded-full text-[#a1a1a6] transition hover:bg-white/10 hover:text-white md:hidden"
          >
            {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </nav>

      {/* Mobile Slide-Down Drawer */}
      <div
        className={`overflow-hidden transition-[max-height,opacity] duration-300 ease-out md:hidden ${
          menuOpen ? 'max-h-72 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="flex flex-col border-t border-white/[0.08] bg-black/95 px-6 py-4 backdrop-blur-2xl">
          {NAV_LINKS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={closeMenu}
              className="border-b border-white/[0.06] py-3.5 text-sm font-medium text-[#d2d2d7] transition hover:text-white last:border-b-0"
            >
              {item.label}
            </a>
          ))}
        </div>
      </div>
    </header>
  );
});