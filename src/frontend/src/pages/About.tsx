import { motion } from "motion/react";

const facts = [
  {
    number: "2M+",
    label: "Hectares extracted globally per year",
    desc: "Land lost to quarries and mines annually",
  },
  {
    number: "68%",
    label: "Kerala landslides linked to quarrying",
    desc: "Research links unregulated quarrying to catastrophic slope failures",
  },
  {
    number: "6",
    label: "Countries already on platform",
    desc: "India, Brazil, Australia, South Africa, Canada, Norway",
  },
  {
    number: "275",
    label: "Green Credits locked today",
    desc: "Restoration obligations already secured on-chain",
  },
];

export default function About() {
  return (
    <div style={{ backgroundColor: "#F5EFE6" }} className="min-h-screen">
      {/* Header */}
      <div className="bg-olive-dark py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-stone-dark mb-3">
            Our Story
          </p>
          <h1 className="font-display text-5xl sm:text-6xl text-cream">
            About & Mission
          </h1>
        </div>
      </div>

      {/* Two-Column Editorial */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-16">
        <div className="grid lg:grid-cols-[3fr_2fr] gap-16 items-start">
          {/* Left: Story */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="font-display text-4xl sm:text-5xl italic text-charcoal leading-tight mb-8">
              From Mukkam
              <br />
              to the World.
            </h2>

            <div className="space-y-5 font-mono text-sm text-charcoal/80 leading-relaxed">
              <p>
                In 2024, the hills above Mukkam in Wayanad, Kerala shook for the
                last time before they collapsed. The landslide that followed
                claimed over 400 lives and buried entire communities under mud
                and stone. Official investigations pointed to a pattern that
                locals had warned about for years: systematic, unregulated
                quarrying had hollowed out the geological stability of the
                Western Ghats.
              </p>

              <p>
                Quarry owners extracted granite and laterite, collected
                payments, and moved on. No restoration. No accountability. No
                record of what was taken. The hills were left as open wounds,
                and the monsoon did the rest.
              </p>

              <p>
                This is not a Kerala problem. It is a global pattern. From the
                iron ore mines of Minas Gerais to the coal fields of New South
                Wales, from the diamond pits of Kimberley to the limestone
                quarries of Kerala — extraction without restoration is a
                civilizational choice we are making, silently, one permit at a
                time.
              </p>

              <div className="border-l-4 border-terracotta pl-6 py-2 my-8">
                <p className="font-display text-2xl text-charcoal italic">
                  "We do not oppose extraction.
                  <br />
                  We demand restoration."
                </p>
              </div>

              <p>
                The Green Credit System was built to change the terms of that
                transaction. Before a single cubic metre is removed from the
                earth, credits must be purchased and locked on the blockchain.
                Those credits represent a promise: that the land will be
                returned, planted, or converted into public green space.
              </p>

              <p>
                Only after independent, government-verified restoration is
                complete are those credits released. The system is
                permissionless, borderless, and incorruptible. It doesn't matter
                whether the extraction happens in Kerala or Kazakhstan. The
                obligation is the same.
              </p>

              <p>
                Today we have six countries on the platform. Tomorrow, we intend
                to make this the global standard for any entity that takes from
                the earth.
              </p>
            </div>
          </motion.div>

          {/* Right: Fact Cards */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="space-y-4 lg:sticky lg:top-24"
          >
            {facts.map((fact, i) => (
              <motion.div
                key={fact.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-olive-dark rounded-2xl p-6"
                data-ocid={`about.item.${i + 1}`}
              >
                <p className="font-mono text-4xl font-bold text-terracotta mb-1">
                  {fact.number}
                </p>
                <p className="font-mono text-xs uppercase tracking-widest text-cream mb-2">
                  {fact.label}
                </p>
                <p className="font-mono text-[11px] text-stone-dark leading-relaxed">
                  {fact.desc}
                </p>
              </motion.div>
            ))}

            {/* Mission statement card */}
            <div className="bg-terracotta rounded-2xl p-6">
              <p className="font-mono text-[10px] uppercase tracking-widest text-cream/70 mb-3">
                Platform Mission
              </p>
              <p className="font-display text-2xl italic text-cream leading-snug">
                Every hectare taken must be a hectare given back.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
