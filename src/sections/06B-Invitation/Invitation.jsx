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
import TopographyBackground from "../../components/TopographyBackground";

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
      {
        value: "starlight",
        label: "Starlight Pendant",
      },
      {
        value: "moonbeam",
        label: "Moonbeam Pendant",
      },
      {
        value: "sunrise",
        label: "Sunrise Pendant",
      },
      {
        value: "heartline",
        label: "Heartline Pendant",
      },
    ],
  },
  {
    name: "giftIntent",
    label: "Who is this for?",
    type: "select",
    required: true,
    options: [
      {
        value: "my-child",
        label: "My child",
      },
      {
        value: "grandchild",
        label: "My grandchild",
      },
      {
        value: "family-gift",
        label: "A family gift",
      },
      {
        value: "still-deciding",
        label: "Still deciding",
      },
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
      if (
        field.required &&
        !String(formData[field.name] || "").trim()
      ) {
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
    <SectionWrapper id="invitation" className="relative isolate overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <TopographyBackground />
      </div>

      <motion.div
        variants={staggerContainer}
        initial="initial"
        whileInView="whileInView"
        viewport={{ once: true, amount: 0.2 }}
        className="grid gap-20 lg:grid-cols-[1fr_520px]"
      >
        {/* LEFT COLUMN */}

        <motion.div variants={fadeUp}>
          <p className="font-mono text-sm uppercase tracking-[0.35em] text-accent">
            {copy.eyebrow}
          </p>

          <h2 className="mt-5 font-display text-5xl leading-tight text-ink md:text-6xl">
            {copy.headline}
          </h2>

          <p className="mt-6 max-w-xl text-lg leading-8 text-slate">
            {copy.subtitle}
          </p>

          <div className="mt-14 space-y-8">
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
                  className="flex items-start gap-5"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-gold/20 bg-gold/5">
                    <Icon
                      size={24}
                      strokeWidth={1.8}
                      className="text-accent"
                    />
                  </div>

                  <div>
                    <h3 className="font-display text-2xl text-ink">
                      {item.title}
                    </h3>

                    <p className="mt-2 leading-7 text-slate">
                      {item.text}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* RIGHT COLUMN */}

        <motion.div
          variants={fadeUp}
          className="rounded-[36px] border border-gold/20 bg-white/75 p-10 shadow-xl backdrop-blur-xl"
        >
          {submitted ? (
            <div className="flex min-h-[520px] flex-col items-center justify-center text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gold/10">
                <Gift
                  size={40}
                  strokeWidth={2}
                  className="text-accent"
                />
              </div>

              <h3 className="mt-8 font-display text-4xl text-ink">
                {copy.successTitle}
              </h3>

              <p className="mt-5 max-w-md leading-8 text-slate">
                {copy.successMessage}
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              {INVITATION_FORM_FIELDS.map((field) => (
                <FormField
                  key={field.name}
                  field={field}
                  value={formData[field.name]}
                  error={errors[field.name]}
                  onChange={handleChange}
                />
              ))}

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
                  rounded-full
                  bg-accent
                  px-8
                  py-4
                  font-medium
                  text-white
                  transition-all
                  duration-300
                  hover:scale-[1.02]
                  hover:shadow-xl
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
            </form>
          )}
        </motion.div>
      </motion.div>

      <Divider />
    </SectionWrapper>
  );
}
