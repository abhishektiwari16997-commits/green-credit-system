import { CheckCircle, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { usePurchaseCredits, useSubmitProject } from "../hooks/useQueries";

const COUNTRIES = [
  "Australia",
  "Brazil",
  "Canada",
  "China",
  "Colombia",
  "Democratic Republic of Congo",
  "France",
  "Germany",
  "Ghana",
  "India",
  "Indonesia",
  "Iran",
  "Kenya",
  "Malaysia",
  "Mexico",
  "Morocco",
  "Mozambique",
  "Nigeria",
  "Norway",
  "Peru",
  "Philippines",
  "Russia",
  "Saudi Arabia",
  "South Africa",
  "Spain",
  "Tanzania",
  "Turkey",
  "USA",
  "Vietnam",
  "Zimbabwe",
];

const PROJECT_TYPES = [
  "Granite Extraction",
  "Limestone Quarrying",
  "Iron Ore Mining",
  "Coal Mining",
  "Gold Mining",
  "Diamond Mining",
  "Copper Mining",
  "Sand & Gravel Extraction",
  "Marble Quarrying",
  "Phosphate Mining",
  "Bauxite Mining",
  "Other Extraction",
];

export default function SubmitProject() {
  const [form, setForm] = useState({
    ownerName: "",
    country: "",
    projectType: "",
    landAreaHectares: "",
    gpsCoordinates: "",
    startDate: "",
    endDate: "",
  });
  const [submittedId, setSubmittedId] = useState<bigint | null>(null);
  const [creditAmount, setCreditAmount] = useState("");

  const submitProject = useSubmitProject();
  const purchaseCredits = usePurchaseCredits();

  const creditsRequired = Math.ceil(
    (Number.parseFloat(form.landAreaHectares) || 0) * 100,
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !form.ownerName ||
      !form.country ||
      !form.projectType ||
      !form.landAreaHectares
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }
    try {
      const id = await submitProject.mutateAsync({
        ownerName: form.ownerName,
        country: form.country,
        projectType: form.projectType,
        landAreaHectares: Number.parseFloat(form.landAreaHectares),
        gpsCoordinates: form.gpsCoordinates,
        startDate: form.startDate,
        endDate: form.endDate,
      });
      setSubmittedId(id);
      setCreditAmount(creditsRequired.toString());
      toast.success("Project registered successfully!");
    } catch {
      toast.error("Failed to register project. Please try again.");
    }
  };

  const handlePurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!submittedId || !creditAmount) return;
    try {
      await purchaseCredits.mutateAsync({
        projectId: submittedId,
        amount: BigInt(Number.parseInt(creditAmount)),
      });
      toast.success(
        `${creditAmount} Green Credits purchased and locked on-chain.`,
      );
    } catch {
      toast.error("Credit purchase failed. Please try again.");
    }
  };

  return (
    <div style={{ backgroundColor: "#F5EFE6" }} className="min-h-screen">
      <div className="bg-olive-dark py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-stone-dark mb-3">
            For Extraction Owners
          </p>
          <h1 className="font-display text-5xl sm:text-6xl text-cream">
            Register a Project
          </h1>
          <p className="font-mono text-sm text-stone mt-4">
            Submit your extraction project to receive your Green Credit
            obligation.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-8 py-12">
        {submittedId === null ? (
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl shadow-md p-8 space-y-6"
            data-ocid="submit.panel"
          >
            <div>
              <label className="gcs-label" htmlFor="ownerName">
                Owner / Company Name *
              </label>
              <input
                id="ownerName"
                name="ownerName"
                type="text"
                required
                value={form.ownerName}
                onChange={handleChange}
                className="gcs-input"
                placeholder="e.g. Rajesh Granite Quarries Ltd."
                data-ocid="submit.input"
              />
            </div>

            <div>
              <label className="gcs-label" htmlFor="country">
                Country *
              </label>
              <select
                id="country"
                name="country"
                required
                value={form.country}
                onChange={handleChange}
                className="gcs-input"
                data-ocid="submit.select"
              >
                <option value="">Select a country...</option>
                {COUNTRIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="gcs-label" htmlFor="projectType">
                Project Type *
              </label>
              <select
                id="projectType"
                name="projectType"
                required
                value={form.projectType}
                onChange={handleChange}
                className="gcs-input"
                data-ocid="submit.select"
              >
                <option value="">Select project type...</option>
                {PROJECT_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="gcs-label" htmlFor="landAreaHectares">
                Land Area (Hectares) *
              </label>
              <input
                id="landAreaHectares"
                name="landAreaHectares"
                type="number"
                min="0.1"
                step="0.1"
                required
                value={form.landAreaHectares}
                onChange={handleChange}
                className="gcs-input"
                placeholder="e.g. 42.5"
                data-ocid="submit.input"
              />
            </div>

            {creditsRequired > 0 && (
              <div className="bg-olive/10 border border-olive/20 rounded-xl p-4">
                <p className="font-mono text-xs uppercase tracking-widest text-olive mb-1">
                  Credits Required
                </p>
                <p className="font-mono text-3xl font-bold text-olive">
                  {creditsRequired.toLocaleString()}
                </p>
                <p className="font-mono text-[10px] text-olive/70 mt-1">
                  Based on {form.landAreaHectares} ha × 100 credits/ha
                </p>
              </div>
            )}

            <div>
              <label className="gcs-label" htmlFor="gpsCoordinates">
                GPS Coordinates
              </label>
              <input
                id="gpsCoordinates"
                name="gpsCoordinates"
                type="text"
                value={form.gpsCoordinates}
                onChange={handleChange}
                className="gcs-input"
                placeholder="e.g. 11.2588° N, 75.7804° E"
                data-ocid="submit.input"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="gcs-label" htmlFor="startDate">
                  Start Date
                </label>
                <input
                  id="startDate"
                  name="startDate"
                  type="date"
                  value={form.startDate}
                  onChange={handleChange}
                  className="gcs-input"
                  data-ocid="submit.input"
                />
              </div>
              <div>
                <label className="gcs-label" htmlFor="endDate">
                  Estimated End Date
                </label>
                <input
                  id="endDate"
                  name="endDate"
                  type="date"
                  value={form.endDate}
                  onChange={handleChange}
                  className="gcs-input"
                  data-ocid="submit.input"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitProject.isPending}
              className="w-full bg-terracotta hover:bg-terracotta-dark text-cream font-mono text-sm uppercase tracking-widest py-4 rounded-full transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
              data-ocid="submit.submit_button"
            >
              {submitProject.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Registering...
                </>
              ) : (
                "Register Project"
              )}
            </button>
          </motion.form>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
            data-ocid="submit.success_state"
          >
            <div className="bg-white rounded-2xl shadow-md p-8">
              <div className="flex items-center gap-3 mb-6">
                <CheckCircle className="w-8 h-8 text-sage" />
                <div>
                  <h2 className="font-display text-3xl text-charcoal">
                    Project Registered
                  </h2>
                  <p className="font-mono text-xs text-stone-dark uppercase tracking-widest">
                    Project ID: #{Number(submittedId)}
                  </p>
                </div>
              </div>
              <p className="font-mono text-sm text-charcoal/80 leading-relaxed">
                Your project has been registered on-chain. Now purchase your
                Green Credits to lock them before extraction begins.
              </p>
            </div>

            <form
              onSubmit={handlePurchase}
              className="bg-olive-dark rounded-2xl p-8"
              data-ocid="credits.panel"
            >
              <h3 className="font-display text-2xl text-cream mb-2">
                Purchase Green Credits
              </h3>
              <p className="font-mono text-xs text-stone-dark mb-6">
                Credits will be locked on-chain until restoration is verified.
              </p>

              <div className="mb-6">
                <label
                  htmlFor="creditAmount"
                  className="block font-mono text-xs uppercase tracking-widest text-stone-dark mb-2"
                >
                  Credit Amount
                </label>
                <input
                  id="creditAmount"
                  type="number"
                  min="1"
                  value={creditAmount}
                  readOnly
                  className="w-full rounded-xl border-2 border-olive/40 bg-olive text-cream px-4 py-3 font-mono text-sm focus:outline-none cursor-not-allowed opacity-80"
                  data-ocid="credits.input"
                />
                <p className="font-mono text-[10px] text-stone-dark mt-1">
                  Amount is fixed at 100 credits per hectare and cannot be
                  changed.
                </p>
              </div>

              <button
                type="submit"
                disabled={purchaseCredits.isPending || !creditAmount}
                className="w-full bg-terracotta hover:bg-terracotta-dark text-cream font-mono text-sm uppercase tracking-widest py-4 rounded-full transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
                data-ocid="credits.submit_button"
              >
                {purchaseCredits.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Purchasing...
                  </>
                ) : (
                  "Purchase & Lock Credits"
                )}
              </button>

              {purchaseCredits.isSuccess && (
                <p
                  className="font-mono text-xs text-sage mt-4 text-center"
                  data-ocid="credits.success_state"
                >
                  ✓ Credits locked successfully.
                </p>
              )}
            </form>
          </motion.div>
        )}
      </div>
    </div>
  );
}
