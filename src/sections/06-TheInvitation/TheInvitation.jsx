// src/sections/06-TheInvitation/TheInvitation.jsx
// CHAPTER SEVEN — THE BEGINNING
// Both audiences, one invitation. A single schema-driven form with an
// audience toggle (Family / School) replaces the old two-track fork.
// Reuses FormField, formSchema, and submitLead — no duplicated form logic.

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { COPY } from '../../content/copy';
import { fadeUp, EASE } from '../../motion/variants';
import ChapterMarker from '../../components/ChapterMarker';
import FormField from '../06A-InstitutionalAsk/FormField';
import { FAMILY_FORM_FIELDS, INSTITUTIONAL_FORM_FIELDS } from '../../content/formSchema';
import { submitLead } from '../../services/leadSubmission';

const { invitation } = COPY.story;

const AUDIENCES = {
  family:      { copy: invitation.audiences.family,      fields: FAMILY_FORM_FIELDS },
  institution: { copy: invitation.audiences.institution, fields: INSTITUTIONAL_FORM_FIELDS },
};

export default function TheInvitation() {
  const [audience, setAudience] = useState('family');
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | submitting | success

  const { copy, fields } = AUDIENCES[audience];

  const handleAudienceChange = (key) => {
    if (key === audience) return;
    setAudience(key);
    setFormData({});
    setErrors({});
    setStatus('idle');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nextErrors = {};
    fields.forEach((field) => {
      if (field.required && !String(formData[field.name] ?? '').trim()) {
        nextErrors[field.name] = invitation.errorRequired;
      }
    });
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setStatus('submitting');
    await submitLead({ audience, ...formData });
    setStatus('success');
  };

  return (
    <section id="the-invitation" className="relative bg-parchment overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 65% 50% at 50% 40%, rgba(168,28,75,0.12) 0%, transparent 70%)',
        }}
      />

      <div className="relative max-w-3xl mx-auto px-6 py-32 md:py-40">
        <div className="flex flex-col items-center text-center mb-14">
          <ChapterMarker className="mb-10">{invitation.marker}</ChapterMarker>
          <motion.h2
            {...fadeUp}
            className="font-display text-4xl md:text-5xl font-bold text-ink tracking-tight leading-tight mb-5"
          >
            {invitation.headline}
          </motion.h2>
          <motion.p {...fadeUp} className="font-body text-base md:text-lg text-slate leading-relaxed">
            {invitation.subhead}
          </motion.p>
        </div>

        {/* Audience toggle — two paths, one door */}
        <motion.div {...fadeUp} className="flex justify-center mb-12">
          <div className="glass-card rounded-full p-1.5 flex gap-1">
            {Object.entries(AUDIENCES).map(([key, value]) => (
              <button
                key={key}
                type="button"
                onClick={() => handleAudienceChange(key)}
                className={`relative rounded-full px-6 md:px-8 py-2.5 font-mono text-[11px] md:text-xs uppercase tracking-premium transition-colors duration-300 ${
                  audience === key ? 'text-parchment' : 'text-slate hover:text-ink'
                }`}
              >
                {audience === key && (
                  <motion.span
                    layoutId="audience-pill"
                    className="absolute inset-0 rounded-full bg-gold"
                    transition={{ duration: 0.4, ease: EASE }}
                  />
                )}
                <span className="relative">{value.copy.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* The form — swaps schema + register with the audience */}
        <motion.div {...fadeUp} className="glass-card rounded-[28px] p-8 md:p-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={audience + status}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35, ease: EASE }}
            >
              {status === 'success' ? (
                <div className="text-center py-10">
                  <p className="font-display text-2xl text-ink mb-3">{copy.successMessage}</p>
                  <p className="font-body text-sm text-slate">
                    {copy.headline}
                  </p>
                </div>
              ) : (
                <>
                  <div className="text-center mb-10">
                    <h3 className="font-display text-2xl md:text-3xl font-semibold text-ink mb-3">
                      {copy.headline}
                    </h3>
                    <p className="font-body text-sm md:text-base text-slate leading-relaxed">
                      {copy.subtitle}
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} noValidate className="space-y-6">
                    {fields.map((field) => (
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
                      disabled={status === 'submitting'}
                      className="w-full rounded-3xl bg-gold text-parchment font-mono text-xs uppercase tracking-premium py-5 transition-all duration-300 hover:shadow-[0_8px_32px_rgba(201,166,107,0.35)] hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0"
                    >
                      {status === 'submitting' ? '…' : copy.submitLabel}
                    </button>
                  </form>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
