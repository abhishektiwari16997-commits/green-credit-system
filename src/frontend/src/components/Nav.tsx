import { Link, useRouterState } from "@tanstack/react-router";
import { Leaf, Menu, X } from "lucide-react";
import { useState } from "react";

const navLinks = [
  { label: "Projects", to: "/projects" },
  { label: "Green Map", to: "/green-map" },
  { label: "About", to: "/about" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const { location } = useRouterState();
  const currentPath = location.pathname;

  return (
    <header className="sticky top-0 z-50 bg-olive-dark border-b border-olive/30 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between h-16">
        <Link
          to="/"
          className="flex items-center gap-3 group"
          data-ocid="nav.link"
        >
          <div className="w-9 h-9 rounded-full bg-terracotta flex items-center justify-center flex-shrink-0">
            <Leaf className="w-5 h-5 text-cream" />
          </div>
          <div>
            <span className="font-mono text-cream text-sm font-bold tracking-[0.15em] uppercase">
              GCS
            </span>
            <span className="hidden sm:block font-mono text-stone-dark text-[10px] tracking-widest uppercase -mt-1">
              Green Credit System
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`font-mono text-xs uppercase tracking-widest transition-colors ${
                currentPath === link.to
                  ? "text-cream"
                  : "text-stone hover:text-cream"
              }`}
              data-ocid="nav.link"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <Link
            to="/submit"
            className="font-mono text-xs uppercase tracking-widest bg-terracotta hover:bg-terracotta-dark text-cream px-5 py-2.5 rounded-full transition-colors"
            data-ocid="nav.primary_button"
          >
            Register a Project
          </Link>
        </div>

        <button
          type="button"
          className="md:hidden text-cream"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          data-ocid="nav.toggle"
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-olive-dark border-t border-olive/30 px-4 pb-4">
          <nav className="flex flex-col gap-4 pt-4">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`font-mono text-xs uppercase tracking-widest transition-colors ${
                  currentPath === link.to
                    ? "text-cream"
                    : "text-stone hover:text-cream"
                }`}
                onClick={() => setOpen(false)}
                data-ocid="nav.link"
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/submit"
              className="font-mono text-xs uppercase tracking-widest bg-terracotta hover:bg-terracotta-dark text-cream px-5 py-2.5 rounded-full transition-colors text-center mt-2"
              onClick={() => setOpen(false)}
              data-ocid="nav.primary_button"
            >
              Register a Project
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
