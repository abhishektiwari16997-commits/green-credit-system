import { Search } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { ProjectStatus } from "../backend";
import ProjectCard from "../components/ProjectCard";
import { FEATURED_PROJECTS } from "../data/featuredProjects";
import { useProjects } from "../hooks/useQueries";

const ALL = "All";

const statusOptions = [
  { label: "All Statuses", value: ALL },
  { label: "Pending", value: ProjectStatus.pending },
  { label: "In Progress", value: ProjectStatus.inProgress },
  { label: "Verified", value: ProjectStatus.verified },
  { label: "Rejected", value: ProjectStatus.rejected },
];

const countryOptions = [
  ALL,
  "India",
  "Brazil",
  "Australia",
  "South Africa",
  "Canada",
  "Norway",
  "Germany",
  "France",
  "USA",
  "Indonesia",
  "Mexico",
];

export default function Projects() {
  const { data: projects, isLoading, isError } = useProjects();
  const [country, setCountry] = useState(ALL);
  const [status, setStatus] = useState(ALL);
  const [search, setSearch] = useState("");

  const displayProjects =
    projects && projects.length > 0 ? projects : FEATURED_PROJECTS;

  const filtered = displayProjects.filter((p) => {
    const matchCountry = country === ALL || p.country === country;
    const matchStatus = status === ALL || p.status === status;
    const matchSearch =
      search === "" ||
      p.ownerName.toLowerCase().includes(search.toLowerCase()) ||
      p.projectType.toLowerCase().includes(search.toLowerCase());
    return matchCountry && matchStatus && matchSearch;
  });

  return (
    <div style={{ backgroundColor: "#F5EFE6" }} className="min-h-screen">
      <div className="bg-olive-dark py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-stone-dark mb-3">
              Global Registry
            </p>
            <h1 className="font-display text-5xl sm:text-6xl text-cream">
              Project Registry
            </h1>
            <p className="font-mono text-sm text-stone mt-4 max-w-xl">
              All active extraction projects registered on the Green Credit
              System blockchain.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="sticky top-16 z-40 bg-white border-b border-stone/40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-dark" />
            <input
              type="text"
              placeholder="Search by owner or project type..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-stone/40 rounded-full font-mono text-xs text-charcoal bg-cream focus:outline-none focus:border-terracotta"
              data-ocid="projects.search_input"
            />
          </div>
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="border border-stone/40 rounded-full font-mono text-xs text-charcoal bg-cream px-4 py-2 focus:outline-none focus:border-terracotta"
            data-ocid="projects.select"
          >
            {countryOptions.map((c) => (
              <option key={c} value={c}>
                {c === ALL ? "All Countries" : c}
              </option>
            ))}
          </select>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border border-stone/40 rounded-full font-mono text-xs text-charcoal bg-cream px-4 py-2 focus:outline-none focus:border-terracotta"
            data-ocid="projects.select"
          >
            {statusOptions.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10">
        {isLoading && (
          <div
            className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            data-ocid="projects.loading_state"
          >
            {["s0", "s1", "s2", "s3", "s4", "s5", "s6", "s7"].map((k) => (
              <div
                key={k}
                className="bg-white rounded-2xl animate-pulse h-56"
              />
            ))}
          </div>
        )}

        {isError && (
          <div className="text-center py-20" data-ocid="projects.error_state">
            <p className="font-mono text-sm text-red-600">
              Failed to load projects. Please try again.
            </p>
          </div>
        )}

        {!isLoading && !isError && (
          <>
            <p className="font-mono text-xs uppercase tracking-widest text-stone-dark mb-6">
              {filtered.length} project{filtered.length !== 1 ? "s" : ""} found
            </p>
            {filtered.length === 0 ? (
              <div
                className="text-center py-20"
                data-ocid="projects.empty_state"
              >
                <p className="font-display text-2xl text-charcoal/50">
                  No projects match your filters.
                </p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filtered.map((project, i) => (
                  <motion.div
                    key={Number(project.id)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                  >
                    <ProjectCard project={project} index={i + 1} />
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
