import { Link } from "@tanstack/react-router";
import { Leaf } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-olive-dark text-stone pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-terracotta flex items-center justify-center">
                <Leaf className="w-4 h-4 text-cream" />
              </div>
              <span className="font-mono text-cream font-bold tracking-widest text-sm uppercase">
                GCS
              </span>
            </div>
            <p className="font-mono text-xs text-stone-dark leading-relaxed">
              A global blockchain platform for environmental accountability in
              the extraction industry.
            </p>
          </div>

          <div>
            <h4 className="font-mono text-xs uppercase tracking-widest text-terracotta mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {[
                { label: "Project Registry", to: "/projects" },
                { label: "Green Map", to: "/green-map" },
                { label: "Submit Project", to: "/submit" },
                { label: "Restore Land", to: "/restore" },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="font-mono text-xs text-stone-dark hover:text-cream transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-xs uppercase tracking-widest text-terracotta mb-4">
              Platform
            </h4>
            <ul className="space-y-2">
              {[
                { label: "How It Works", to: "/" },
                { label: "About & Mission", to: "/about" },
                { label: "Admin Panel", to: "/admin" },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="font-mono text-xs text-stone-dark hover:text-cream transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-xs uppercase tracking-widest text-terracotta mb-4">
              Mission
            </h4>
            <p className="font-mono text-xs text-stone-dark leading-relaxed">
              "We do not oppose extraction. We demand restoration."
            </p>
            <p className="font-mono text-xs text-stone-dark leading-relaxed mt-3">
              Active in 6+ countries. Growing.
            </p>
          </div>
        </div>

        <div className="border-t border-olive/50 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-mono text-xs text-stone-dark">
            © {year}{" "}
            <a
              href="https://anthropocene.in"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cream transition-colors"
            >
              Anthropocene.in
            </a>
          </p>
          <a
            href="https://anthropocene.in"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs text-stone-dark hover:text-cream transition-colors"
          >
            anthropocene.in
          </a>
        </div>
      </div>
    </footer>
  );
}
