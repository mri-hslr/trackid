import { useState } from "react";
import { motion } from "framer-motion";
import {
  Gift,
  HeartHandshake,
  Sparkles,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";

import SectionWrapper from "../../components/SectionWrapper";
import Divider from "../../components/Divider";
import FormField from "../06A-InstitutionalAsk/FormField";

import { submitLead } from "../../services/leadSubmission";
import { fadeUp, staggerContainer } from "../../motion/variants";

const INVITATION_COPY = {
  eyebrow: "Family Invitation",
  headline: "Shop the Collection",
  subtitle:
    "Join the waitlist for TrakID's family collection, designed as a keepsake children can wear with comfort, confidence, and a little everyday magic.",
  errorRequired: "This field is required.",
  submitLabel: "Join the Waitlist",
  successTitle: "You're On The List",
  successMessage:
    "Thank you for joining the family waitlist. We'll share collection updates, launch timing, and gifting details as soon as they are ready.",
};

const INVITATION_FORM_FIELDS = [
  {
    name: "parentName",
    label: "Your name",
    type: "text",
    placeholder: "Enter your name",
    required: true,
  },
  {
    name: "email",
    label: "Email address",
    type: "email",
    placeholder: "Enter your email",
    required: true,
  },
  {
    name: "selectedDesign",
    label: "Pendant design",
    type: "select",
    required: true,
    options: [
      { value: "starlight", label: "Starlight Pendant" },
      { value: "moonbeam", label: "Moonbeam Pendant" },
      { value: "sunrise", label: "Sunrise Pendant" },
      { value: "heartline", label: "Heartline Pendant" },
    ],
  },
  {
    name: "giftIntent",
    label: "Who is this for?",
    type: "select",
    required: true,
    options: [
      { value: "my-child", label: "My child" },
      { value: "grandchild", label: "My grandchild" },
      { value: "family-gift", label: "A family gift" },
      { value: "still-deciding", label: "Still deciding" },
    ],
  },
  {
    name: "message",
    label: "Anything you would like us to know?",
    type: "textarea",
    placeholder:
      "Tell us about the child, the occasion, or the kind of keepsake you are hoping for.",
    required: false,
  },
];

export default function Invitation() {
  const copy = INVITATION_COPY;

  const [formData, setFormData] = useState({
    parentName: "",
    email: "",
    selectedDesign: "",
    giftIntent: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  }

  function validate() {
    const nextErrors = {};

    INVITATION_FORM_FIELDS.forEach((field) => {
      if (field.required && !String(formData[field.name] || "").trim()) {
        nextErrors[field.name] = copy.errorRequired;
      }
    });

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!validate()) return;

    setSubmitting(true);

    const result = await submitLead({
      ...formData,
      source: "section-06b-invitation",
      track: "family",
    });

    setSubmitting(false);

    if (result.success) {
      setSubmitted(true);
    }
  }

  return (
    <SectionWrapper id="invitation">
      <motion.div
        variants={staggerContainer}
        initial="initial"
        whileInView="whileInView"
        viewport={{ once: true, amount: 0.2 }}
        className="grid gap-16 lg:grid-cols-[0.95fr_1.05fr]"
      >
        {/* LEFT COLUMN */}

        <motion.div variants={fadeUp} className="relative">
          {/* Background Glow */}

          <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-[#7B1E3A]/15 blur-3xl pointer-events-none" />

          <div className="absolute -top-10 left-24 h-64 w-64 rounded-full bg-[#5A183F]/10 blur-3xl pointer-events-none" />

          <div className="absolute top-56 right-10 h-48 w-48 rounded-full bg-[#9D3C63]/10 blur-3xl pointer-events-none" />

          {/* Eyebrow */}

          <p className="font-mono text-sm uppercase tracking-[0.4em] text-[#B65C78]">
            {copy.eyebrow}
          </p>

          {/* Heading */}

          <h2 className="mt-6 max-w-lg font-display text-5xl leading-[1.05] tracking-tight text-white md:text-7xl">
            {copy.headline}
          </h2>

          {/* Subtitle */}

          <p className="mt-8 max-w-xl text-xl leading-9 text-white/70">
            {copy.subtitle}
          </p>

          {/* Divider */}

          <div className="mt-10 mb-14 flex items-center gap-4">
            <div className="h-px w-20 bg-gradient-to-r from-transparent to-[#7B1E3A]" />

            <div className="h-3 w-3 rotate-45 border border-[#7B1E3A] bg-white" />

            <div className="h-px w-20 bg-gradient-to-l from-transparent to-[#7B1E3A]" />
          </div>

          {/* Feature Cards */}

          <div className="grid gap-5">
            {[
              {
                icon: Sparkles,
                title: "Made To Feel Special",
                text: "A safety wearable shaped like jewellery, so children feel proud to wear it every day.",
              },
              {
                icon: Gift,
                title: "A Meaningful Gift",
                text: "A thoughtful way for grandparents and family members to give something protective and personal.",
              },
              {
                icon: HeartHandshake,
                title: "For Family Peace Of Mind",
                text: "Designed to support parents and caregivers without making the child feel monitored.",
              },
              {
                icon: ShieldCheck,
                title: "Protection With Warmth",
                text: "Reliable location features wrapped in a softer, more emotionally familiar form.",
              },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="
                    group
                    relative
                    overflow-hidden
                    rounded-3xl
                    border
                    border-white/10
                    bg-white/5
                    p-8
                    backdrop-blur-xl
                    transition-all
                    duration-500
                    hover:-translate-y-1
                    hover:border-[#7B1E3A]/40
                    hover:bg-white/10
                    hover:shadow-[0_20px_40px_rgba(123,30,58,.18)]
                  "
                >
                  <div className="absolute left-8 right-8 top-0 h-px bg-gradient-to-r from-transparent via-[#7B1E3A] to-transparent opacity-70" />

                  <div className="absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-40 pointer-events-none">
                    <div className="absolute -left-16 -top-16 h-40 w-40 rounded-full bg-[#7B1E3A]/15 blur-3xl" />
                  </div>

                  <div className="relative z-10 flex gap-6">
                    <div
                      className="
                        flex
                        h-16
                        w-16
                        shrink-0
                        items-center
                        justify-center
                        rounded-2xl
                        border
                        border-[#7B1E3A]/30
                        bg-[#7B1E3A]/10
                        transition-all
                        duration-500
                        group-hover:scale-105
                      "
                    >
                      <Icon
                        size={30}
                        strokeWidth={2}
                        className="text-[#B65C78]"
                      />
                    </div>

                    <div>
                      <h3 className="font-display text-2xl text-white">
                        {item.title}
                      </h3>

                      <p className="mt-3 text-base leading-7 text-white/70">
                        {item.text}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
        {/* RIGHT COLUMN */}

        <motion.div
          variants={fadeUp}
          className="
            relative
            overflow-hidden
            rounded-lg
            border
            border-white/10
            bg-[#242424]
            p-12
            shadow-[0_35px_80px_rgba(0,0,0,0.12)]
            backdrop-blur-xl
            transition-all
            duration-500
            hover:shadow-[0_40px_90px_rgba(123,30,58,0.18)]
          "
        >
          {/* Background Glow */}

          <div className="absolute -top-16 -right-16 h-44 w-44 rounded-full bg-[#7B1E3A]/15 blur-3xl pointer-events-none" />

          <div className="absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-[#5A183F]/10 blur-3xl pointer-events-none" />

          {submitted ? (
            <div className="relative flex min-h-[560px] flex-col items-center justify-center text-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-[#5A183F] to-[#B65C78] shadow-xl">
                <Gift size={42} strokeWidth={2} className="text-white" />
              </div>

              <h3 className="mt-8 font-display text-5xl text-white">
                {copy.successTitle}
              </h3>

              <p className="mt-6 max-w-md text-lg leading-8 text-white/70">
                {copy.successMessage}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="relative space-y-7">
              {/* Heading */}

              <div>
                <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#B65C78]">
                  Family Waitlist
                </p>

                <h3 className="mt-2 font-display text-4xl text-white">
                  Reserve Your Place
                </h3>

                <p className="mt-4 text-lg leading-8 text-white/60">
                  Complete the form below and we'll notify you as soon as the
                  collection becomes available.
                </p>
              </div>

              {INVITATION_FORM_FIELDS.map((field) => (
                <FormField
                  key={field.name}
                  field={field}
                  value={formData[field.name]}
                  error={errors[field.name]}
                  onChange={handleChange}
                />
              ))}

              {/* Submit Button */}

              <button
                type="submit"
                disabled={submitting}
                className="
                  group
                  mt-4
                  flex
                  w-full
                  items-center
                  justify-center
                  gap-3
                  rounded-lg
                  bg-gradient-to-r
                  from-[#F6EEF2]
                  via-[#C97A98]
                  to-[#7B1E3A]
                  px-8
                  py-4
                  font-semibold
                  text-[#2B1B22]
                  shadow-lg
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:scale-[1.02]

                  hover:brightness-105
                  hover:shadow-[0_20px_45px_rgba(123,30,58,.30)]
                  disabled:cursor-not-allowed
                  disabled:opacity-70
                "
              >
                {submitting ? "Submitting..." : copy.submitLabel}

                {!submitting && (
                  <ChevronRight
                    size={20}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                )}
              </button>

              {/* Footer */}

              <p className="text-center text-sm text-white/40">
                No spam. We'll only contact you with launch updates and
                collection news.
              </p>
            </form>
          )}
        </motion.div>
      </motion.div>

      <Divider />
    </SectionWrapper>
  );
}
