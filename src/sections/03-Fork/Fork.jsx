import { useTrack } from "../../context/TrackContext";

function Fork() {
  const { activeTrack, setActiveTrack } = useTrack();

  const handleSelect = (track) => {
    setActiveTrack(track);

    const section = document.getElementById(`${track}-track`);

    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="min-h-screen bg-parchment flex items-center justify-center px-6 py-20">
      <div className="max-w-6xl w-full">
        <div className="text-center mb-14">
          <p className="text-slate uppercase tracking-[0.25em] text-sm mb-3">
            Choose Your Experience
          </p>

          <h2 className="font-display text-4xl md:text-5xl text-ink">
            Choose Your Path
          </h2>

          <p className="text-slate mt-4 max-w-2xl mx-auto">
            Whether you're protecting students at scale or keeping loved ones
            close, explore the experience designed for you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Institution Card */}
          <div
            onClick={() => handleSelect("institution")}
            className={`cursor-pointer rounded-3xl border bg-white p-10 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
              activeTrack === "institution"
                ? "border-accent shadow-xl ring-2 ring-accent/20"
                : "border-stone"
            }`}
          >
            <div className="mb-6">
              <span className="text-xs uppercase tracking-[0.2em] text-accentDeep">
                Institutions
              </span>
            </div>

            <h3 className="text-3xl font-semibold text-ink mb-4">
              For Schools & Institutions
            </h3>

            <p className="text-slate leading-relaxed">
              Safety, visibility, and peace of mind for schools, campuses,
              and organizations responsible for student wellbeing.
            </p>

            {activeTrack === "institution" && (
              <span className="inline-block mt-6 text-sm font-medium text-accentDeep">
                ✓ Selected
              </span>
            )}
          </div>

          {/* Family Card */}
          <div
            onClick={() => handleSelect("family")}
            className={`cursor-pointer rounded-3xl border bg-white p-10 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
              activeTrack === "family"
                ? "border-accent shadow-xl ring-2 ring-accent/20"
                : "border-stone"
            }`}
          >
            <div className="mb-6">
              <span className="text-xs uppercase tracking-[0.2em] text-accentDeep">
                Family
              </span>
            </div>

            <h3 className="text-3xl font-semibold text-ink mb-4">
              For Families
            </h3>

            <p className="text-slate leading-relaxed">
              A beautiful and secure way to stay connected with children,
              parents, and loved ones through everyday life.
            </p>

            {activeTrack === "family" && (
              <span className="inline-block mt-6 text-sm font-medium text-accentDeep">
                ✓ Selected
              </span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Fork;