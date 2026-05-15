import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import type { Project } from "../backend";

const STATUS_CONFIG: Record<
  string,
  { label: string; bgColor: string; textColor: string; dotColor: string }
> = {
  pending: {
    label: "Restoration Submitted",
    bgColor: "#FEF3C7",
    textColor: "#92400E",
    dotColor: "#D4A017",
  },
  inProgress: {
    label: "Extraction Active",
    bgColor: "#FEE9E1",
    textColor: "#9B3A1E",
    dotColor: "#C8603A",
  },
  verified: {
    label: "Verified & Restored",
    bgColor: "#E9F0E5",
    textColor: "#2F4A24",
    dotColor: "#5C7A4E",
  },
  rejected: {
    label: "Rejected",
    bgColor: "#FEE2E2",
    textColor: "#991B1B",
    dotColor: "#EF4444",
  },
};

function LifecycleIndicator({ status }: { status: string }) {
  const stages = [
    {
      key: "credits",
      label: "Credits",
      active: ["inProgress", "pending", "verified"].includes(status),
      complete: ["pending", "verified"].includes(status),
    },
    {
      key: "restoration",
      label: "Restoration",
      active: ["pending", "verified"].includes(status),
      complete: ["verified"].includes(status),
    },
    {
      key: "verified",
      label: "Verified",
      active: ["verified"].includes(status),
      complete: ["verified"].includes(status),
    },
  ];

  return (
    <div className="flex items-center gap-0 mt-4 mb-1">
      {stages.map((stage, i) => (
        <div key={stage.key} className="flex items-center flex-1">
          <div className="flex flex-col items-center">
            <div
              className="w-2 h-2 rounded-full"
              style={{
                backgroundColor: stage.active
                  ? stage.complete
                    ? "#5C7A4E"
                    : "#C8603A"
                  : "#C8B89A",
              }}
            />
            <p className="font-mono text-[8px] uppercase tracking-wide text-stone-dark mt-1 text-center leading-none">
              {stage.label}
            </p>
          </div>
          {i < stages.length - 1 && (
            <div
              className="flex-1 h-px mb-3"
              style={{
                backgroundColor: stages[i + 1].active ? "#5C7A4E" : "#C8B89A",
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default function ProjectCard({
  project,
  index,
}: { project: Project; index: number }) {
  const statusKey = project.status as string;
  const status = STATUS_CONFIG[statusKey] ?? STATUS_CONFIG.pending;
  const creditsPercent =
    project.creditsRequired > 0
      ? Math.min(
          100,
          Math.round(
            (Number(project.creditsPurchased) /
              Number(project.creditsRequired)) *
              100,
          ),
        )
      : 0;

  return (
    <Link to="/projects/$id" params={{ id: String(Number(project.id)) }}>
      <motion.article
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden cursor-pointer h-full"
        data-ocid={`project.card.${index}`}
      >
        <div className="p-6">
          {/* Status badge — top right, prominent */}
          <div className="flex items-start justify-between mb-4 gap-2">
            <div className="flex-1 min-w-0">
              <p className="font-mono text-[10px] uppercase tracking-widest text-stone-dark mb-1">
                {project.country}
              </p>
              <h3 className="font-display text-xl text-charcoal leading-tight">
                {project.ownerName}
              </h3>
            </div>
            <span
              className="font-mono text-[9px] uppercase tracking-widest px-2.5 py-1.5 rounded-full whitespace-nowrap flex-shrink-0 font-semibold"
              style={{
                backgroundColor: status.bgColor,
                color: status.textColor,
              }}
            >
              {status.label}
            </span>
          </div>

          <p className="font-mono text-xs text-stone-dark">
            {project.projectType}
          </p>

          {/* Lifecycle progress dots */}
          <LifecycleIndicator status={statusKey} />

          <div className="space-y-3 mt-3">
            <div>
              <div className="flex justify-between font-mono text-[10px] text-stone-dark mb-1">
                <span>Credits Locked</span>
                <span>{creditsPercent}%</span>
              </div>
              <div className="w-full bg-stone/30 rounded-full h-1.5">
                <div
                  className="h-1.5 rounded-full"
                  style={{
                    width: `${creditsPercent}%`,
                    backgroundColor: status.dotColor,
                  }}
                />
              </div>
            </div>

            <div className="flex justify-between">
              <div>
                <p className="font-mono text-[9px] uppercase tracking-widest text-stone-dark">
                  Area
                </p>
                <p className="font-mono text-sm font-bold text-charcoal">
                  {project.landAreaHectares} ha
                </p>
              </div>
              <div className="text-right">
                <p className="font-mono text-[9px] uppercase tracking-widest text-stone-dark">
                  End Date
                </p>
                <p className="font-mono text-xs text-charcoal">
                  {project.endDate || "—"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div
          className="h-1"
          style={{
            background: `linear-gradient(to right, ${status.dotColor}66, ${status.dotColor})`,
          }}
        />
      </motion.article>
    </Link>
  );
}
