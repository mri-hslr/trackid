import clsx from "clsx";

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
          rows={5}
          value={value || ""}
          onChange={onChange}
          placeholder={field.placeholder}
          className={baseClasses}
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
          ))}
        </select>
      ) : (
        /* INPUT */

        <input
          id={field.name}
          name={field.name}
          type={field.type}
          value={value || ""}
          onChange={onChange}
          placeholder={field.placeholder}
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
