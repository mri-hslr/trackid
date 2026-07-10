import { School, Users, ArrowRight } from "lucide-react";
import { useTrack } from "../../context/TrackContext";

const cards = [
  {
    id: "institution",
    label: "INSTITUTIONS",
    title: "For Schools & Institutions",
    description:
      "Safety, visibility and peace of mind for schools, universities, and educational organizations responsible for student wellbeing.",
    icon: School,
    pattern: "/assets/images/institution-pattern.svg",
  },
  {
    id: "family",
    label: "FAMILY",
    title: "For Families",
    description:
      "A beautiful and secure way to stay connected with children, parents, grandparents, and loved ones through thoughtful technology.",
    icon: Users,
    pattern: "/assets/images/family-pattern.svg",
  },
];

function ExperienceCard({
  label,
  title,
  description,
  icon: Icon,
  pattern,
  active,
  onClick,
}) {
  return (
    <div
      onClick={onClick}
      className={`
        group
        relative
        overflow-hidden
        rounded-[34px]
        border
        cursor-pointer
        flex
        flex-col
        p-12
        bg-gradient-to-br
        from-[#faf8f5]
        via-[#f6f3ee]
        to-[#e7dac8]
        transition-all
        duration-500
        hover:-translate-y-3
        hover:shadow-[0_35px_80px_rgba(0,0,0,.18)]
        ${
          active
            ? "border-[#7B1E3A] ring-1 ring-[#7B1E3A]/30"
            : "border-[#ddd2c5]"
        }
      `}
    >
      {/* Shine */}
      <div className="absolute inset-0 overflow-hidden rounded-[34px] pointer-events-none">
        <div className="absolute -left-full top-0 h-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/40 to-transparent transition-all duration-700 group-hover:left-[150%]" />
      </div>

      {/* Glow */}
      <div className="absolute -bottom-20 -right-20 h-52 w-52 rounded-full bg-[#7B1E3A]/15 blur-3xl" />

      {/* Premium Border */}
      <div className="absolute left-0 top-0 h-1 w-0 bg-gradient-to-r from-[#5A183F] via-[#7B1E3A] to-[#A44A70] transition-all duration-500 group-hover:w-full" />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between">
        <div
          className="
          flex
          h-20
          w-20
          items-center
          justify-center
          rounded-3xl
          bg-[#3A1F2D]
border-[#7B1E3A]/35
shadow-[0_10px_30px_rgba(123,30,58,0.22)]
          
          transition-all
          duration-500
          group-hover:scale-110
          group-hover:-rotate-3
          group-hover:shadow-[0_12px_35px_rgba(123,30,58,.35)]
        "
        >
          <Icon className="h-9 w-9 text-[#A34D68]" strokeWidth={2} />
        </div>

        <div
          className="
          flex
          h-12
          w-12
          items-center
          justify-center
          rounded-full
          border
          border-[#d4c7bb]
          bg-[#faf8f5]
          transition-all
          duration-300
          group-hover:border-[#7B1E3A]
          group-hover:bg-[#7B1E3A]
        "
        >
          <ArrowRight
            className="
            h-5
            w-5
            text-[#7B1E3A]
            transition-all
            duration-300
            group-hover:text-white
            group-hover:translate-x-1
          "
          />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 mt-10">
        <p className="mb-5 text-xs uppercase tracking-[0.4em] text-[#7B1E3A]">
          {label}
        </p>

        <h3 className="font-display text-4xl leading-tight text-[#1b1b1b]">
          {title}
        </h3>

        <p className="mt-6 max-w-md text-lg leading-8 text-[#5b5b5b]">
          {description}
        </p>
      </div>

      {/* Button */}
      <div className="relative z-10 mt-auto pt-14">
        <div
          className="
          inline-flex
          items-center
          gap-3
          rounded-full
          bg-[#3A1F2D]
          px-6
          py-3
          text-white
          font-medium
          transition-all
          duration-300
          group-hover:bg-[#7B1E3A]
        "
        >
          <span>Explore Experience</span>

          <ArrowRight
            className="
            h-4
            w-4
            transition-transform
            duration-300
            group-hover:translate-x-1
          "
          />
        </div>
      </div>

      {/* Pattern */}
      <img
        src={pattern}
        alt=""
        className="
          absolute
          bottom-8
          right-8
          w-48
          pointer-events-none
          opacity-30
          hue-rotate-[300deg]
          saturate-[180%]
          brightness-[0.75]
          contrast-125
          transition-all
          duration-700
          group-hover:opacity-50
          group-hover:scale-110
        "
      />
    </div>
  );
}
export default function Fork() {
  const { activeTrack, setActiveTrack } = useTrack();

  const handleSelect = (track) => {
    setActiveTrack(track);

    const section = document.getElementById(
      track === "institution" ? "compliance-case" : "anatomy",
    );

    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-gradient-to-br from-[#090909] via-[#111111] to-[#1b1612] px-6 py-24">
      {/* Background Glow */}

      <div className="absolute -left-40 -top-40 h-[32rem] w-[32rem] rounded-full bg-[#7B1E3A]/15 blur-3xl pointer-events-none" />

      <div className="absolute -bottom-40 -right-40 h-[32rem] w-[32rem] rounded-full bg-[#5A183F]/15 blur-3xl pointer-events-none" />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,.12),transparent_45%)] pointer-events-none" />

      <div className="relative mx-auto w-full max-w-7xl">
        {/* Heading */}

        <div className="mb-24 text-center">
          <p className="mb-5 font-mono text-sm uppercase tracking-[0.45em] text-[#B76E79]">
            CHOOSE YOUR EXPERIENCE
          </p>

          <h2 className="font-display text-5xl tracking-tight text-white md:text-7xl">
            Choose Your Path
          </h2>

          {/* Divider */}

          <div className="my-8 flex items-center justify-center gap-4">
            <div className="h-px w-20 bg-gradient-to-r from-transparent to-[#7B1E3A]" />

            <div className="h-3 w-3 rotate-45 border border-[#7B1E3A] bg-white" />

            <div className="h-px w-20 bg-gradient-to-l from-transparent to-[#7B1E3A]" />
          </div>

          <p className="mx-auto max-w-2xl text-xl leading-9 text-white/70">
            Whether you're protecting students at scale or staying connected
            with loved ones, discover the experience crafted for you.
          </p>
        </div>

        {/* Cards */}

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          {cards.map((card) => (
            <ExperienceCard
              key={card.id}
              {...card}
              active={activeTrack === card.id}
              onClick={() => handleSelect(card.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
