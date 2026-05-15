import { TreePine } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { Project } from "../backend";
import { ProjectStatus } from "../backend";
import { FEATURED_PROJECTS } from "../data/featuredProjects";
import { useGreenMap } from "../hooks/useQueries";

const STATUS_COLORS: Record<string, string> = {
  inProgress: "#C8603A",
  pending: "#D4A017",
  verified: "#5C7A4E",
  rejected: "#888",
};

const STATUS_LABELS: Record<string, string> = {
  inProgress: "Extraction Active",
  pending: "Restoration Submitted",
  verified: "Verified & Restored",
};

const countryFlags: Record<string, string> = {
  India: "🇮🇳",
  Brazil: "🇧🇷",
  Australia: "🇦🇺",
  "South Africa": "🇿🇦",
  Canada: "🇨🇦",
  Norway: "🇳🇴",
  Germany: "🇩🇪",
  France: "🇫🇷",
  USA: "🇺🇸",
};

function parseCoords(gps: string): { lat: number; lng: number } | null {
  const cleaned = gps.replace(/[°]/g, "").trim();
  const parts = cleaned.split(",").map((s) => s.trim());
  if (parts.length !== 2) return null;
  const parsePart = (s: string): number => {
    const neg = s.includes("S") || s.includes("W");
    const num = Number.parseFloat(s.replace(/[NSEW]/g, "").trim());
    return neg ? -num : num;
  };
  const lat = parsePart(parts[0]);
  const lng = parsePart(parts[1]);
  if (Number.isNaN(lat) || Number.isNaN(lng)) return null;
  return { lat, lng };
}

// Convert lat/lng to percentage position on an equirectangular map
function coordsToPercent(lat: number, lng: number): { x: number; y: number } {
  const x = ((lng + 180) / 360) * 100;
  const y = ((90 - lat) / 180) * 100;
  return { x, y };
}

function MapPin({
  project,
  onHover,
  isHovered,
}: {
  project: Project;
  onHover: (id: number | null) => void;
  isHovered: boolean;
}) {
  const coords = parseCoords(project.gpsCoordinates);
  if (!coords) return null;
  const { x, y } = coordsToPercent(coords.lat, coords.lng);
  const color = STATUS_COLORS[project.status as string] ?? "#5C7A4E";

  return (
    <div
      className="absolute"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transform: "translate(-50%, -50%)",
      }}
      onMouseEnter={() => onHover(Number(project.id))}
      onMouseLeave={() => onHover(null)}
    >
      <motion.div
        animate={{ scale: isHovered ? 1.6 : 1 }}
        transition={{ duration: 0.2 }}
        className="w-3 h-3 rounded-full cursor-pointer shadow-md"
        style={{
          backgroundColor: color,
          border: "2px solid white",
          boxShadow: isHovered ? `0 0 0 3px ${color}44` : undefined,
        }}
      />
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.9 }}
            transition={{ duration: 0.15 }}
            className="absolute z-10 bottom-6 left-1/2 -translate-x-1/2 bg-white rounded-xl shadow-xl p-3 pointer-events-none"
            style={{ minWidth: 180 }}
          >
            <p className="font-mono text-[9px] uppercase tracking-widest text-stone-dark">
              {project.country}
            </p>
            <p className="font-display text-sm text-charcoal leading-tight mt-0.5">
              {project.ownerName}
            </p>
            <p className="font-mono text-[10px] text-stone-dark mt-1">
              {project.projectType}
            </p>
            <div className="flex items-center gap-1.5 mt-2">
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: color }}
              />
              <span className="font-mono text-[9px] text-charcoal">
                {STATUS_LABELS[project.status as string] ?? project.status}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function GreenCard({ project, index }: { project: Project; index: number }) {
  const flag = countryFlags[project.country] ?? "🌍";
  const statusKey = project.status as string;
  const borderColor = STATUS_COLORS[statusKey] ?? "#5C7A4E";
  const statusLabel = STATUS_LABELS[statusKey] ?? statusKey;

  const badgeBg =
    statusKey === "verified"
      ? "bg-sage/20 text-sage"
      : statusKey === "pending"
        ? "bg-amber-100 text-amber-700"
        : "bg-terracotta/20 text-terracotta";

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="bg-white rounded-2xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden"
      style={{ borderLeft: `4px solid ${borderColor}` }}
      data-ocid={`greenmap.item.${index}`}
    >
      <div className="bg-stone/5 px-6 pt-6 pb-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-3xl">{flag}</span>
          <span
            className={`font-mono text-[9px] uppercase tracking-widest px-3 py-1.5 rounded-full ${badgeBg}`}
          >
            {statusLabel}
          </span>
        </div>
        <p className="font-mono text-[10px] uppercase tracking-widest text-stone-dark">
          {project.country}
        </p>
        <h3 className="font-display text-xl text-charcoal mt-1">
          {project.ownerName}
        </h3>
      </div>
      <div className="px-6 py-4 space-y-3">
        <div className="flex justify-between">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-widest text-stone-dark">
              Project Type
            </p>
            <p className="font-mono text-xs text-charcoal">
              {project.projectType}
            </p>
          </div>
          <div className="text-right">
            <p className="font-mono text-[9px] uppercase tracking-widest text-stone-dark">
              Land Area
            </p>
            <p
              className="font-mono text-sm font-bold"
              style={{ color: borderColor }}
            >
              {project.landAreaHectares} ha
            </p>
          </div>
        </div>
        <p className="font-mono text-[10px] text-stone-dark">
          Ends: {project.endDate}
        </p>
      </div>
      <div
        className="h-1"
        style={{
          background: `linear-gradient(to right, ${borderColor}44, ${borderColor})`,
        }}
      />
    </motion.article>
  );
}

export default function GreenMap() {
  const { data: projects, isLoading, isError } = useGreenMap();
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const allProjects: Project[] =
    isError || !projects || projects.length === 0
      ? FEATURED_PROJECTS
      : projects;

  const totalHa = allProjects.reduce((sum, p) => sum + p.landAreaHectares, 0);
  const verifiedCount = allProjects.filter(
    (p) => (p.status as string) === ProjectStatus.verified,
  ).length;

  return (
    <div style={{ backgroundColor: "#F5EFE6" }} className="min-h-screen">
      <div className="bg-sage py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-cream/70 mb-3">
              Global Restoration Index
            </p>
            <h1 className="font-display text-5xl sm:text-6xl text-cream mb-6">
              Active Projects Worldwide
            </h1>
            <div className="flex flex-wrap gap-8">
              <div>
                <p className="font-mono text-3xl font-bold text-cream">
                  {allProjects.length}
                </p>
                <p className="font-mono text-[10px] uppercase tracking-widest text-cream/70">
                  Total Projects
                </p>
              </div>
              <div>
                <p className="font-mono text-3xl font-bold text-cream">
                  {verifiedCount}
                </p>
                <p className="font-mono text-[10px] uppercase tracking-widest text-cream/70">
                  Verified Sites
                </p>
              </div>
              <div>
                <p className="font-mono text-3xl font-bold text-cream">
                  {totalHa.toLocaleString()} ha
                </p>
                <p className="font-mono text-[10px] uppercase tracking-widest text-cream/70">
                  Total Area Tracked
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* World Map — equirectangular projection with plotted pins */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-10">
        <div
          className="relative w-full rounded-2xl overflow-hidden shadow-lg"
          style={{
            height: "50vh",
            background:
              "linear-gradient(160deg, #b8d4e8 0%, #c8dff0 40%, #a8c8e0 100%)",
          }}
        >
          {/* Simple landmass hint using SVG shapes */}
          <svg
            className="absolute inset-0 w-full h-full opacity-20"
            viewBox="0 0 1000 500"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            {/* Americas */}
            <ellipse cx="200" cy="200" rx="80" ry="120" fill="#4a7a3a" />
            <ellipse cx="230" cy="330" rx="60" ry="80" fill="#4a7a3a" />
            {/* Europe/Africa */}
            <ellipse cx="480" cy="180" rx="60" ry="80" fill="#4a7a3a" />
            <ellipse cx="490" cy="300" rx="55" ry="90" fill="#4a7a3a" />
            {/* Asia */}
            <ellipse cx="680" cy="160" rx="130" ry="90" fill="#4a7a3a" />
            {/* Australia */}
            <ellipse cx="760" cy="340" rx="55" ry="40" fill="#4a7a3a" />
          </svg>

          {/* Grid lines */}
          <svg
            className="absolute inset-0 w-full h-full opacity-10"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            {[10, 20, 30, 40, 50, 60, 70, 80, 90].map((v) => (
              <line
                key={`h${v}`}
                x1="0"
                y1={v}
                x2="100"
                y2={v}
                stroke="#2a4a2a"
                strokeWidth="0.3"
              />
            ))}
            {[10, 20, 30, 40, 50, 60, 70, 80, 90].map((v) => (
              <line
                key={`v${v}`}
                x1={v}
                y1="0"
                x2={v}
                y2="100"
                stroke="#2a4a2a"
                strokeWidth="0.3"
              />
            ))}
          </svg>

          {/* Project pins */}
          {!isLoading &&
            allProjects.map((project) => (
              <MapPin
                key={Number(project.id)}
                project={project}
                onHover={setHoveredId}
                isHovered={hoveredId === Number(project.id)}
              />
            ))}

          {/* Legend */}
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-xl shadow-md p-4 space-y-2">
            <p className="font-mono text-[9px] uppercase tracking-widest text-stone-dark mb-2">
              Project Status
            </p>
            {Object.entries(STATUS_LABELS).map(([key, label]) => (
              <div key={key} className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: STATUS_COLORS[key] }}
                />
                <span className="font-mono text-[9px] text-charcoal">
                  {label}
                </span>
              </div>
            ))}
          </div>

          {/* Equator label */}
          <div
            className="absolute left-2 font-mono text-[8px] text-white/60 uppercase tracking-widest"
            style={{ top: "50%", transform: "translateY(-50%)" }}
          >
            Equator
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
        {isError && (
          <div
            className="text-center py-4 mb-6"
            data-ocid="greenmap.error_state"
          >
            <p className="font-mono text-xs text-terracotta">
              Could not load live blockchain data. Showing featured projects.
            </p>
          </div>
        )}

        {!isLoading && (
          <>
            <p className="font-mono text-xs uppercase tracking-widest text-stone-dark mb-8">
              {allProjects.length} registered project
              {allProjects.length !== 1 ? "s" : ""} across all lifecycle stages
            </p>
            {allProjects.length === 0 ? (
              <div
                className="text-center py-20"
                data-ocid="greenmap.empty_state"
              >
                <TreePine className="w-16 h-16 text-stone mx-auto mb-4" />
                <p className="font-display text-2xl text-charcoal/50">
                  No projects registered yet.
                </p>
                <p className="font-mono text-xs text-stone-dark mt-2">
                  Be the first to register an extraction project.
                </p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {allProjects.map((project, i) => (
                  <GreenCard
                    key={Number(project.id)}
                    project={project}
                    index={i + 1}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
