import { Link } from "@tanstack/react-router";
import { ArrowRight, Globe, Layers, ShieldCheck, TreePine } from "lucide-react";
import { motion } from "motion/react";
import MountainHero from "../components/MountainHero";
import ProjectCard from "../components/ProjectCard";
import { FEATURED_PROJECTS } from "../data/featuredProjects";
import { useGlobalStats, useProjects } from "../hooks/useQueries";

function StatsBar() {
  const { data: stats, isLoading } = useGlobalStats();

  const items = [
    {
      label: "Credits Issued",
      value: isLoading
        ? "—"
        : Number(stats?.totalCreditsIssued ?? 0).toLocaleString(),
    },
    {
      label: "Land Restored (ha)",
      value: isLoading ? "—" : (stats?.totalLandRestored ?? 0).toLocaleString(),
    },
    {
      label: "Countries Active",
      value: isLoading ? "—" : Number(stats?.countriesActive ?? 0).toString(),
    },
    {
      label: "Projects Verified",
      value: isLoading ? "—" : Number(stats?.projectsVerified ?? 0).toString(),
    },
  ];

  return (
    <section className="bg-olive-dark" data-ocid="stats.section">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {items.map((item) => (
            <div key={item.label} className="text-center">
              <p
                className="font-mono text-2xl sm:text-3xl font-bold text-cream"
                data-ocid={isLoading ? "stats.loading_state" : "stats.section"}
              >
                {item.value}
              </p>
              <p className="font-mono text-[10px] uppercase tracking-widest text-stone-dark mt-1">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const steps = [
  {
    number: "01",
    title: "Register Your Project",
    description:
      "Quarry and extraction owners submit project details including GPS coordinates, land area, and timeline. Credits required are auto-calculated at 100 credits per hectare.",
    icon: Layers,
    color: "bg-terracotta",
  },
  {
    number: "02",
    title: "Purchase Green Credits",
    description:
      "Credits are purchased and locked on-chain before extraction begins. No credits = no extraction. Simple, enforceable, global — backed by ICP blockchain.",
    icon: ShieldCheck,
    color: "bg-sage",
  },
  {
    number: "03",
    title: "Restore & Get Verified",
    description:
      "Upon verified land restoration — tree planting or conversion to public green spaces — credits are released by government verifiers.",
    icon: TreePine,
    color: "bg-olive",
  },
];

export default function Home() {
  const { data: projects } = useProjects();
  const featured = (projects ?? FEATURED_PROJECTS).slice(0, 4);

  return (
    <div>
      <MountainHero>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        >
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-stone-dark mb-8">
            <Globe className="inline w-3 h-3 mr-2" />
            Global Environmental Accountability Platform
          </p>

          <h1
            className="font-display text-5xl sm:text-6xl lg:text-7xl font-light text-cream leading-[1.05] mb-8"
            style={{ textShadow: "0 2px 30px rgba(0,0,0,0.5)" }}
          >
            The Earth{" "}
            <span
              className="font-script"
              style={{ fontSize: "1.15em", fontStyle: "normal" }}
            >
              Remembers
            </span>
            <br />
            Every Scar.
          </h1>

          <p className="font-mono text-sm text-stone leading-relaxed max-w-xl mx-auto mb-12">
            A blockchain-backed system that holds the extraction industry
            accountable. Buy credits before you dig. Restore before you walk
            away.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/projects"
              className="font-mono text-xs uppercase tracking-widest bg-terracotta hover:bg-terracotta-dark text-cream px-8 py-4 rounded-full transition-colors flex items-center gap-2 justify-center"
              data-ocid="hero.primary_button"
            >
              View Projects <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#how-it-works"
              className="font-mono text-xs uppercase tracking-widest border border-stone/40 text-cream hover:bg-white/10 px-8 py-4 rounded-full transition-colors"
              data-ocid="hero.secondary_button"
            >
              Learn How It Works
            </a>
          </div>
        </motion.div>
      </MountainHero>

      <StatsBar />

      <section
        id="how-it-works"
        className="py-24 px-4"
        style={{ backgroundColor: "#F5EFE6" }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-terracotta mb-4">
              The Process
            </p>
            <h2 className="font-display text-4xl sm:text-5xl text-charcoal">
              How It Works
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className="text-center"
              >
                <div
                  className={`w-16 h-16 ${step.color} rounded-full flex items-center justify-center mx-auto mb-6`}
                >
                  <step.icon className="w-7 h-7 text-white" />
                </div>
                <p className="font-mono text-xs text-stone-dark uppercase tracking-widest mb-3">
                  Step {step.number}
                </p>
                <h3 className="font-display text-2xl text-charcoal mb-4">
                  {step.title}
                </h3>
                <p className="font-mono text-xs text-charcoal/70 leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-4 bg-terracotta">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4"
          >
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-cream/60 mb-3">
                Featured Projects
              </p>
              <h2 className="font-display text-4xl sm:text-5xl text-cream">
                Active Projects Worldwide
              </h2>
            </div>
            <Link
              to="/projects"
              className="font-mono text-xs uppercase tracking-widest text-cream border border-cream/40 hover:bg-cream/10 px-6 py-3 rounded-full transition-colors whitespace-nowrap"
              data-ocid="home.secondary_button"
            >
              View All Projects
            </Link>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map((project, i) => (
              <motion.div
                key={Number(project.id)}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <ProjectCard project={project} index={i + 1} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
