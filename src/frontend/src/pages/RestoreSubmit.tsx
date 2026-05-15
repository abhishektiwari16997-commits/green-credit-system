import { CheckCircle, Loader2, Upload } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { ExternalBlob } from "../backend";
import { useSubmitRestoration } from "../hooks/useQueries";

export default function RestoreSubmit() {
  const [form, setForm] = useState({
    projectId: "",
    description: "",
    completionDate: "",
  });
  const [files, setFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const submitRestoration = useSubmitRestoration();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.projectId || !form.description || !form.completionDate) {
      toast.error("Please fill in all required fields.");
      return;
    }
    try {
      const total = files.length || 1;
      const blobFiles = await Promise.all(
        files.map(async (file, idx) => {
          const bytes = new Uint8Array(await file.arrayBuffer());
          const blob = ExternalBlob.fromBytes(bytes);
          setUploadProgress(Math.round(((idx + 1) / total) * 100));
          return blob;
        }),
      );
      await submitRestoration.mutateAsync({
        projectId: BigInt(Number.parseInt(form.projectId)),
        description: form.description,
        completionDate: form.completionDate,
        files: blobFiles,
      });
      toast.success("Restoration submission sent for review.");
    } catch {
      toast.error("Submission failed. Please try again.");
    }
  };

  return (
    <div style={{ backgroundColor: "#F5EFE6" }} className="min-h-screen">
      {/* Header */}
      <div className="bg-sage py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-cream/70 mb-3">
            Restoration Portal
          </p>
          <h1 className="font-display text-5xl sm:text-6xl text-cream">
            Submit Restoration Proof
          </h1>
          <p className="font-mono text-sm text-cream/80 mt-4">
            Upload verification evidence for your completed land restoration
            project.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-8 py-12">
        {submitRestoration.isSuccess ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-md p-10 text-center"
            data-ocid="restore.success_state"
          >
            <CheckCircle className="w-16 h-16 text-sage mx-auto mb-6" />
            <h2 className="font-display text-3xl text-charcoal mb-3">
              Submission Received
            </h2>
            <p className="font-mono text-sm text-charcoal/70">
              Your restoration evidence has been submitted and is pending review
              by a certified verifier. You will be notified once reviewed.
            </p>
          </motion.div>
        ) : (
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl shadow-md p-8 space-y-6"
            data-ocid="restore.panel"
          >
            {/* Project ID */}
            <div>
              <label className="gcs-label" htmlFor="projectId">
                Project ID *
              </label>
              <input
                id="projectId"
                name="projectId"
                type="number"
                min="1"
                required
                value={form.projectId}
                onChange={handleChange}
                className="gcs-input"
                placeholder="Enter your project ID number"
                data-ocid="restore.input"
              />
            </div>

            {/* Description */}
            <div>
              <label className="gcs-label" htmlFor="description">
                Restoration Description *
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={5}
                value={form.description}
                onChange={handleChange}
                className="gcs-input resize-none"
                placeholder="Describe the restoration activities completed: tree species planted, area covered, conversion to public green space, etc."
                data-ocid="restore.textarea"
              />
            </div>

            {/* Completion Date */}
            <div>
              <label className="gcs-label" htmlFor="completionDate">
                Completion Date *
              </label>
              <input
                id="completionDate"
                name="completionDate"
                type="date"
                required
                value={form.completionDate}
                onChange={handleChange}
                className="gcs-input"
                data-ocid="restore.input"
              />
            </div>

            {/* Photo Upload */}
            <div>
              <p className="gcs-label">Restoration Photos</p>
              <label
                className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-stone rounded-xl bg-cream cursor-pointer hover:border-terracotta transition-colors"
                data-ocid="restore.dropzone"
              >
                <Upload className="w-8 h-8 text-stone-dark mb-2" />
                <p className="font-mono text-xs text-stone-dark uppercase tracking-wider">
                  {files.length > 0
                    ? `${files.length} file(s) selected`
                    : "Click to upload photos"}
                </p>
                <p className="font-mono text-[10px] text-stone-dark/60 mt-1">
                  PNG, JPG, WEBP accepted
                </p>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFiles}
                  className="sr-only"
                  data-ocid="restore.upload_button"
                />
              </label>
              {files.length > 0 && (
                <ul className="mt-3 space-y-1">
                  {files.map((f) => (
                    <li
                      key={f.name}
                      className="font-mono text-[10px] text-charcoal/60"
                    >
                      • {f.name} ({(f.size / 1024).toFixed(1)} KB)
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Progress */}
            {submitRestoration.isPending && uploadProgress > 0 && (
              <div className="space-y-1">
                <div className="w-full bg-stone rounded-full h-1.5">
                  <div
                    className="bg-terracotta h-1.5 rounded-full transition-all"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="font-mono text-[10px] text-stone-dark text-center">
                  {uploadProgress}% uploaded
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={submitRestoration.isPending}
              className="w-full bg-sage hover:bg-olive text-cream font-mono text-sm uppercase tracking-widest py-4 rounded-full transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
              data-ocid="restore.submit_button"
            >
              {submitRestoration.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Submitting...
                </>
              ) : (
                "Submit Restoration Evidence"
              )}
            </button>
          </motion.form>
        )}
      </div>
    </div>
  );
}
