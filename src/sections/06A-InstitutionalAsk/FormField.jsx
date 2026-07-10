import clsx from "clsx";
import { ChevronDown } from "lucide-react";

const CONTROL_HEIGHT = 54;

export default function FormField({ field, value, error, onChange }) {
  const baseClasses = clsx(
    "w-full rounded-lg border px-5 py-4",
    "bg-[#2b2b2b]",
    "text-white",
    "placeholder:text-white/40",
    "border-white/15",
    "focus:border-[#8B1E3F]",
    "focus:ring-2",
    "focus:ring-[#8B1E3F]/30",
    error && "border-red-500",
  );

  // Inline styles, not classes, for the height/padding: native <select>
  // elements carry browser default vertical padding that can silently
  // out-rank Tailwind utility classes (no !important), which is why the
  // select box was rendering taller than the input boxes. Setting these
  // as inline styles with explicit border-box sizing guarantees both
  // controls resolve to the exact same pixel height.
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
      <label htmlFor={field.name} className="block font-medium text-white">
        {field.label}

        {field.required && <span className="ml-1 text-red-500">*</span>}
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
          style={{ height: CONTROL_HEIGHT, padding: "14px 20px", boxSizing: "border-box" }}
          className={clsx(baseClasses, "leading-normal resize-none")}
        />
      ) : field.type === "select" ? (
        /* SELECT */

        <select
          id={field.name}
          name={field.name}
          value={value || ""}
          onChange={onChange}
          className={baseClasses}
          style={{
            backgroundColor: "#2b2b2b",
            color: "#ffffff",
          }}
        >
          <option value="" style={{ color: "#ffffff", background: "#2b2b2b" }}>
            Select an option
          </option>

          {field.options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              style={{
                color: "#ffffff",
                background: "#2b2b2b",
              }}
            >
              {option.label}
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
          style={{
            backgroundColor: "#2b2b2b",
            color: "#ffffff",
          }}
        />
      )}

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
