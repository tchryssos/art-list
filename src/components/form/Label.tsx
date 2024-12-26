interface LabelProps {
  name: string;
  label: string;
}

export function Label({ name, label }: LabelProps) {
  return (
    <label className="text-xs font-semibold" htmlFor={name}>
      {label}
    </label>
  );
}
