type FieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
};

export function AdminTextField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: FieldProps) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-ink">{label}</span>
      <input
        className="mt-2 w-full rounded-2xl border border-trust-100 bg-white px-4 py-3 text-sm outline-none transition focus:border-trust-300"
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

export function AdminTextareaField({
  label,
  value,
  onChange,
  placeholder,
}: FieldProps) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-ink">{label}</span>
      <textarea
        className="mt-2 min-h-32 w-full rounded-2xl border border-trust-100 bg-white px-4 py-3 text-sm outline-none transition focus:border-trust-300"
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

type SelectProps = {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
};

export function AdminSelectField({ label, value, options, onChange }: SelectProps) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-ink">{label}</span>
      <select
        className="mt-2 w-full rounded-2xl border border-trust-100 bg-white px-4 py-3 text-sm outline-none transition focus:border-trust-300"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

type ToggleProps = {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
};

export function AdminToggleField({ label, checked, onChange }: ToggleProps) {
  return (
    <label className="flex items-center gap-3 rounded-2xl border border-trust-100 px-4 py-3 text-sm text-ink">
      <input checked={checked} type="checkbox" onChange={(event) => onChange(event.target.checked)} />
      {label}
    </label>
  );
}
