import clsx from "clsx";
import { ChevronDown } from "lucide-react";

const CONTROL_HEIGHT = 54;

export default function FormField({
  field,
  value,
  error,
  onChange,
}) {
  const baseClasses = clsx(
    "w-full rounded-3xl border bg-white/70 backdrop-blur-sm px-5 py-4",
    "text-ink placeholder:text-slate/60",
    "transition-all duration-300 shadow-sm",
    "focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold focus:shadow-[0_0_0_4px_rgba(212,168,90,0.08)]",
    error
      ? "border-red-400"
      : "border-gold/20 hover:border-accent/40"
  );

  const controlStyle = {
    height: CONTROL_HEIGHT,
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 20,
    paddingRight: 20,
    boxSizing: "border-box",
  };

  return (
    <div className="space-y-2">
      <label
        htmlFor={field.name}
        className="block font-medium text-ink"
      >
        {field.label}

        {field.required && (
          <span className="ml-1 text-red-500">*</span>
        )}
      </label>

      {/* TEXTAREA */}

      {field.type === "textarea" ? (
        <textarea
          id={field.name}
          name={field.name}
          rows={2}
          value={value || ""}
          onChange={onChange}
          placeholder={field.placeholder}
          style={{
            height: 110,
            padding: "14px 20px",
            boxSizing: "border-box",
          }}
          className={clsx(
            baseClasses,
            "leading-normal resize-none"
          )}
        />
      ) : field.type === "select" ? (
        /* SELECT */

        <div className="relative">
          <select
            id={field.name}
            name={field.name}
            value={value || ""}
            onChange={onChange}
            style={controlStyle}
            className={clsx(
              baseClasses,
              "appearance-none pr-12"
            )}
          >
            <option value="">
              Select an option
            </option>

            {field.options.map((option) => (
              <option
                key={option.value}
                value={option.value}
              >
                {option.label}
              </option>
            ))}
          </select>

          <ChevronDown
            size={18}
            strokeWidth={2}
            className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-slate/60"
          />
        </div>
      ) : (
        /* INPUT */

        <input
          id={field.name}
          name={field.name}
          type={field.type}
          value={value || ""}
          onChange={onChange}
          placeholder={field.placeholder}
          style={controlStyle}
          className={baseClasses}
        />
      )}

      {error && (
        <p className="text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}