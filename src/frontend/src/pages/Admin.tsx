import { CheckCircle, Loader2, Lock, XCircle } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ProjectStatus } from "../backend";
import type { RestorationSubmission } from "../backend";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useAdminSubmissions,
  useApproveRestoration,
  useProjects,
  useRejectRestoration,
  useUpdateProjectStatus,
} from "../hooks/useQueries";

const statusLabels: Record<ProjectStatus, string> = {
  [ProjectStatus.verified]: "Verified",
  [ProjectStatus.pending]: "Pending",
  [ProjectStatus.inProgress]: "In Progress",
  [ProjectStatus.rejected]: "Rejected",
};

function SubmissionRow({
  sub,
  index,
}: {
  sub: RestorationSubmission;
  index: number;
}) {
  const [rejectNote, setRejectNote] = useState("");
  const [showReject, setShowReject] = useState(false);
  const approve = useApproveRestoration();
  const reject = useRejectRestoration();

  const handleApprove = async () => {
    try {
      await approve.mutateAsync(sub.id);
      toast.success(`Submission #${Number(sub.id)} approved.`);
    } catch {
      toast.error("Failed to approve submission.");
    }
  };

  const handleReject = async () => {
    if (!rejectNote) {
      toast.error("Please provide a rejection reason.");
      return;
    }
    try {
      await reject.mutateAsync({ id: sub.id, note: rejectNote });
      toast.success(`Submission #${Number(sub.id)} rejected.`);
      setShowReject(false);
    } catch {
      toast.error("Failed to reject submission.");
    }
  };

  return (
    <div
      className="bg-white rounded-2xl shadow-md p-6 space-y-4"
      data-ocid={`admin.item.${index}`}
    >
      <div className="flex flex-wrap justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-stone-dark">
            Submission #{Number(sub.id)} · Project #{Number(sub.projectId)}
          </p>
          <p className="font-mono text-xs text-charcoal mt-1">
            {sub.description.slice(0, 120)}
            {sub.description.length > 120 ? "..." : ""}
          </p>
          <p className="font-mono text-[10px] text-stone-dark mt-2">
            Completed: {sub.completionDate}
          </p>
          {sub.reviewerNote && (
            <p className="font-mono text-[10px] text-red-600 mt-1">
              Note: {sub.reviewerNote}
            </p>
          )}
        </div>
        <span
          className={`font-mono text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-full h-fit ${
            sub.status === "approved"
              ? "bg-olive text-cream"
              : sub.status === "rejected"
                ? "bg-red-100 text-red-700"
                : "bg-stone text-charcoal"
          }`}
        >
          {sub.status}
        </span>
      </div>

      {sub.status === "pending" && (
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleApprove}
            disabled={approve.isPending}
            className="flex items-center gap-2 bg-olive hover:bg-olive-dark text-cream font-mono text-xs uppercase tracking-widest px-5 py-2.5 rounded-full transition-colors disabled:opacity-60"
            data-ocid={`admin.confirm_button.${index}`}
          >
            {approve.isPending ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <CheckCircle className="w-3 h-3" />
            )}
            Approve
          </button>
          <button
            type="button"
            onClick={() => setShowReject((v) => !v)}
            className="flex items-center gap-2 bg-red-100 hover:bg-red-200 text-red-700 font-mono text-xs uppercase tracking-widest px-5 py-2.5 rounded-full transition-colors"
            data-ocid={`admin.delete_button.${index}`}
          >
            <XCircle className="w-3 h-3" /> Reject
          </button>
        </div>
      )}

      {showReject && (
        <div className="space-y-3">
          <textarea
            rows={3}
            value={rejectNote}
            onChange={(e) => setRejectNote(e.target.value)}
            placeholder="Reason for rejection..."
            className="gcs-input resize-none"
            data-ocid={`admin.textarea.${index}`}
          />
          <button
            type="button"
            onClick={handleReject}
            disabled={reject.isPending}
            className="bg-red-600 hover:bg-red-700 text-white font-mono text-xs uppercase tracking-widest px-5 py-2.5 rounded-full transition-colors disabled:opacity-60"
            data-ocid={`admin.confirm_button.${index}`}
          >
            {reject.isPending ? (
              <Loader2 className="w-3 h-3 animate-spin inline mr-1" />
            ) : null}
            Confirm Rejection
          </button>
        </div>
      )}
    </div>
  );
}

function ProjectStatusRow({ project, index }: { project: any; index: number }) {
  const [selected, setSelected] = useState<ProjectStatus>(project.status);
  const update = useUpdateProjectStatus();

  const handleUpdate = async () => {
    try {
      await update.mutateAsync({ id: project.id, status: selected });
      toast.success(`Project #${Number(project.id)} status updated.`);
    } catch {
      toast.error("Failed to update status.");
    }
  };

  return (
    <div
      className="bg-white rounded-xl p-4 flex flex-wrap items-center justify-between gap-3"
      data-ocid={`admin.row.${index}`}
    >
      <div>
        <p className="font-mono text-xs text-charcoal font-bold">
          {project.ownerName}
        </p>
        <p className="font-mono text-[10px] text-stone-dark">
          {project.country} · {project.projectType}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value as ProjectStatus)}
          className="border border-stone/40 rounded-full font-mono text-xs text-charcoal bg-cream px-3 py-1.5 focus:outline-none"
          data-ocid={`admin.select.${index}`}
        >
          {Object.values(ProjectStatus).map((s) => (
            <option key={s} value={s}>
              {statusLabels[s]}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={handleUpdate}
          disabled={update.isPending}
          className="bg-terracotta hover:bg-terracotta-dark text-cream font-mono text-[10px] uppercase tracking-widest px-4 py-1.5 rounded-full transition-colors disabled:opacity-60"
          data-ocid={`admin.save_button.${index}`}
        >
          {update.isPending ? (
            <Loader2 className="w-3 h-3 animate-spin inline" />
          ) : (
            "Update"
          )}
        </button>
      </div>
    </div>
  );
}

export default function Admin() {
  const { identity, login, loginStatus } = useInternetIdentity();
  const { actor } = useActor();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(false);

  const { data: submissions, isLoading: loadingSubs } = useAdminSubmissions();
  const { data: projects, isLoading: loadingProjects } = useProjects();

  useEffect(() => {
    if (!actor || !identity) {
      setIsAdmin(null);
      return;
    }
    setChecking(true);
    actor
      .isCallerAdmin()
      .then((result) => {
        setIsAdmin(result);
      })
      .catch(() => setIsAdmin(false))
      .finally(() => setChecking(false));
  }, [actor, identity]);

  if (!identity) {
    return (
      <div
        style={{ backgroundColor: "#F5EFE6" }}
        className="min-h-screen flex items-center justify-center px-4"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-olive-dark rounded-2xl p-10 text-center max-w-sm w-full"
          data-ocid="admin.panel"
        >
          <Lock className="w-12 h-12 text-stone mx-auto mb-6" />
          <h2 className="font-display text-3xl text-cream mb-2">
            Admin Access
          </h2>
          <p className="font-mono text-xs text-stone-dark mb-8">
            Sign in to access the administration panel.
          </p>
          <button
            type="button"
            onClick={login}
            disabled={loginStatus === "logging-in"}
            className="w-full bg-terracotta hover:bg-terracotta-dark text-cream font-mono text-sm uppercase tracking-widest py-3 rounded-full transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
            data-ocid="admin.primary_button"
          >
            {loginStatus === "logging-in" ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Signing In...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </motion.div>
      </div>
    );
  }

  if (checking) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "#F5EFE6" }}
      >
        <Loader2
          className="w-8 h-8 text-terracotta animate-spin"
          data-ocid="admin.loading_state"
        />
      </div>
    );
  }

  if (isAdmin === false) {
    return (
      <div
        style={{ backgroundColor: "#F5EFE6" }}
        className="min-h-screen flex items-center justify-center px-4"
      >
        <div className="text-center" data-ocid="admin.error_state">
          <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="font-display text-3xl text-charcoal mb-2">
            Access Denied
          </h2>
          <p className="font-mono text-sm text-charcoal/60">
            Your account does not have administrator privileges.
          </p>
        </div>
      </div>
    );
  }

  const pendingSubs = (submissions ?? []).filter((s) => s.status === "pending");

  return (
    <div style={{ backgroundColor: "#F5EFE6" }} className="min-h-screen">
      {/* Header */}
      <div className="bg-olive-dark py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-stone-dark mb-3">
            Verifier Panel
          </p>
          <h1 className="font-display text-5xl sm:text-6xl text-cream">
            Admin Dashboard
          </h1>
          <p className="font-mono text-sm text-stone mt-3">
            Logged in as {identity.getPrincipal().toString().slice(0, 12)}...
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-8 py-12 space-y-16">
        {/* Pending Submissions */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-3xl text-charcoal">
              Restoration Submissions
            </h2>
            <span className="font-mono text-xs bg-terracotta text-cream px-3 py-1.5 rounded-full">
              {pendingSubs.length} pending
            </span>
          </div>

          {loadingSubs ? (
            <div
              className="flex justify-center py-12"
              data-ocid="admin.loading_state"
            >
              <Loader2 className="w-8 h-8 text-terracotta animate-spin" />
            </div>
          ) : (submissions ?? []).length === 0 ? (
            <div
              className="text-center py-12 bg-white rounded-2xl"
              data-ocid="admin.empty_state"
            >
              <p className="font-display text-xl text-charcoal/50">
                No submissions yet.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {(submissions ?? []).map((sub, i) => (
                <SubmissionRow key={Number(sub.id)} sub={sub} index={i + 1} />
              ))}
            </div>
          )}
        </section>

        {/* Project Status Management */}
        <section>
          <h2 className="font-display text-3xl text-charcoal mb-6">
            Project Status Management
          </h2>

          {loadingProjects ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 text-terracotta animate-spin" />
            </div>
          ) : (projects ?? []).length === 0 ? (
            <div
              className="text-center py-12 bg-white rounded-2xl"
              data-ocid="admin.empty_state"
            >
              <p className="font-display text-xl text-charcoal/50">
                No projects registered yet.
              </p>
            </div>
          ) : (
            <div className="space-y-3 bg-white rounded-2xl p-6 shadow-md">
              {(projects ?? []).map((project, i) => (
                <ProjectStatusRow
                  key={Number(project.id)}
                  project={project}
                  index={i + 1}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
