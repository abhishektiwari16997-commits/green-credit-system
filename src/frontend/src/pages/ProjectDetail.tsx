import { Link, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  Calendar,
  Globe,
  Layers,
  MapPin,
  ShieldCheck,
  TreePine,
} from "lucide-react";
import { motion } from "motion/react";
import { FEATURED_PROJECTS } from "../data/featuredProjects";
import { useProject } from "../hooks/useQueries";

const statusConfig = {
  pending: {
    label: "Restoration Submitted",
    bgColor: "#FEF3C7",
    textColor: "#92400E",
    step: 2,
  },
  inProgress: {
    label: "Extraction Active",
    bgColor: "#FEE9E1",
    textColor: "#9B3A1E",
    step: 1,
  },
  verified: {
    label: "Verified & Restored",
    bgColor: "#E9F0E5",
    textColor: "#2F4A24",
    step: 3,
  },
  rejected: {
    label: "Rejected",
    bgColor: "#FEE2E2",
    textColor: "#991B1B",
    step: -1,
  },
};

export default function ProjectDetail() {
  const { id } = useParams({ strict: false }) as { id: string };
  const projectId = BigInt(Number(id));
  const { data: project, isLoading, isError } = useProject(projectId);

  // Check if this is a featured project
  const featuredProject = FEATURED_PROJECTS.find(
    (fp) => fp.id === projectId || Number(fp.id) === Number(id),
  );

  // Use backend data if available, otherwise fall back to featured project
  const displayProject = project ?? featuredProject;

  // Only show skeleton if we have no featured fallback AND still loading
  if (isLoading && !featuredProject) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "#F5EFE6" }}
      >
        <div className="space-y-4 w-full max-w-3xl mx-auto px-8">
          <div className="h-12 bg-stone/20 rounded-xl animate-pulse" />
          <div className="h-6 bg-stone/20 rounded-xl w-2/3 animate-pulse" />
          <div className="grid grid-cols-2 gap-4 mt-8">
            {["p0", "p1", "p2", "p3", "p4", "p5"].map((k) => (
              <div
                key={k}
                className="h-24 bg-stone/20 rounded-xl animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if ((isError || !displayProject) && !featuredProject) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center gap-4"
        style={{ backgroundColor: "#F5EFE6" }}
      >
        <p className="font-display text-3xl text-charcoal/50">
          Project not found.
        </p>
        <Link
          to="/projects"
          className="font-mono text-xs uppercase tracking-widest text-terracotta hover:underline"
        >
          ← Back to Registry
        </Link>
      </div>
    );
  }

  if (!displayProject) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center gap-4"
        style={{ backgroundColor: "#F5EFE6" }}
      >
        <p className="font-display text-3xl text-charcoal/50">
          Project not found.
        </p>
        <Link
          to="/projects"
          className="font-mono text-xs uppercase tracking-widest text-terracotta hover:underline"
        >
          ← Back to Registry
        </Link>
      </div>
    );
  }

  const status =
    statusConfig[displayProject.status as keyof typeof statusConfig] ??
    statusConfig.pending;
  const creditsPercent =
    displayProject.creditsRequired > 0
      ? Math.min(
          100,
          Math.round(
            (Number(displayProject.creditsPurchased) /
              Number(displayProject.creditsRequired)) *
              100,
          ),
        )
      : 0;
  const googleMapsUrl = `https://maps.google.com/?q=${encodeURIComponent(displayProject.gpsCoordinates)}`;

  const steps = [
    { label: "Registered", icon: Layers, done: true },
    { label: "In Progress", icon: Globe, done: status.step >= 1 },
    { label: "Restored", icon: TreePine, done: status.step >= 2 },
    { label: "Verified", icon: ShieldCheck, done: status.step >= 3 },
  ];

  return (
    <div style={{ backgroundColor: "#F5EFE6" }} className="min-h-screen">
      <div className="bg-olive-dark py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-stone-dark hover:text-cream transition-colors mb-8"
          >
            <ArrowLeft className="w-3 h-3" /> Back to Registry
          </Link>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-stone-dark mb-2">
                  {displayProject.country} · Project #
                  {Number(displayProject.id)}
                </p>
                <h1 className="font-display text-4xl sm:text-5xl text-cream">
                  {displayProject.ownerName}
                </h1>
                <p className="font-mono text-sm text-stone mt-2">
                  {displayProject.projectType}
                </p>
              </div>
              <span
                className="font-mono text-xs uppercase tracking-widest px-4 py-2 rounded-full font-semibold"
                style={{
                  backgroundColor: status.bgColor,
                  color: status.textColor,
                }}
              >
                {status.label}
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-8 py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-sm"
            data-ocid="project_detail.land_area"
          >
            <p className="font-mono text-[10px] uppercase tracking-widest text-stone-dark mb-1">
              Land Area
            </p>
            <p className="font-display text-4xl text-charcoal">
              {displayProject.landAreaHectares}
            </p>
            <p className="font-mono text-xs text-stone-dark">hectares</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-white rounded-2xl p-6 shadow-sm"
            data-ocid="project_detail.credits"
          >
            <p className="font-mono text-[10px] uppercase tracking-widest text-stone-dark mb-3">
              Green Credits
            </p>
            <div className="flex justify-between font-mono text-xs mb-2">
              <span>
                {Number(displayProject.creditsPurchased).toLocaleString()}{" "}
                purchased
              </span>
              <span className="text-stone-dark">
                {Number(displayProject.creditsRequired).toLocaleString()}{" "}
                required
              </span>
            </div>
            <div className="w-full bg-stone/30 rounded-full h-2">
              <div
                className="bg-terracotta h-2 rounded-full transition-all"
                style={{ width: `${creditsPercent}%` }}
              />
            </div>
            <p className="font-mono text-[10px] text-stone-dark mt-1">
              {creditsPercent}% locked on-chain
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-6 shadow-sm"
            data-ocid="project_detail.location"
          >
            <p className="font-mono text-[10px] uppercase tracking-widest text-stone-dark mb-1">
              Location
            </p>
            <p className="font-mono text-xs text-charcoal mb-2">
              {displayProject.gpsCoordinates}
            </p>
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest text-terracotta hover:underline"
            >
              <MapPin className="w-3 h-3" /> View on Map
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-white rounded-2xl p-6 shadow-sm"
            data-ocid="project_detail.dates"
          >
            <p className="font-mono text-[10px] uppercase tracking-widest text-stone-dark mb-3">
              Timeline
            </p>
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-3 h-3 text-stone-dark" />
              <span className="font-mono text-xs text-charcoal">
                Start: {displayProject.startDate || "—"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-3 h-3 text-stone-dark" />
              <span className="font-mono text-xs text-charcoal">
                End: {displayProject.endDate || "—"}
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-6 shadow-sm sm:col-span-2"
            data-ocid="project_detail.timeline"
          >
            <p className="font-mono text-[10px] uppercase tracking-widest text-stone-dark mb-4">
              Lifecycle Status
            </p>
            <div className="flex items-center gap-0">
              {steps.map((step, i) => (
                <div key={step.label} className="flex items-center flex-1">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        step.done
                          ? "bg-olive text-cream"
                          : "bg-stone/30 text-stone-dark"
                      }`}
                    >
                      <step.icon className="w-4 h-4" />
                    </div>
                    <p className="font-mono text-[9px] uppercase tracking-widest text-stone-dark mt-1 text-center">
                      {step.label}
                    </p>
                  </div>
                  {i < steps.length - 1 && (
                    <div
                      className={`flex-1 h-0.5 mb-4 ${
                        steps[i + 1].done ? "bg-olive" : "bg-stone/30"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* About This Project — shown for featured projects */}
        {featuredProject && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="bg-white rounded-2xl p-8 shadow-sm mb-6"
            data-ocid="project_detail.panel"
          >
            <p className="font-mono text-[10px] uppercase tracking-widest text-stone-dark mb-3">
              About This Project
            </p>
            <p className="font-display text-lg text-charcoal leading-relaxed">
              {featuredProject.description}
            </p>
          </motion.div>
        )}

        <div className="bg-olive-dark rounded-2xl p-8">
          <p className="font-mono text-[10px] uppercase tracking-widest text-stone-dark mb-2">
            On-Chain Record
          </p>
          <p className="font-script text-3xl text-terracotta mb-1">
            Immutable.
          </p>
          <p className="font-mono text-xs text-stone leading-relaxed">
            This project record is stored on the Internet Computer blockchain.
            Credits locked represent a binding restoration obligation
            enforceable by verified government reviewers worldwide.
          </p>
        </div>
      </div>
    </div>
  );
}
