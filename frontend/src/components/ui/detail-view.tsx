interface DetailFieldProps {
  label: string;
  value?: React.ReactNode;
}

export function DetailField({ label, value }: DetailFieldProps) {
  return (
    <div className="grid grid-cols-3 gap-2 border-b border-neutral-100 py-2.5 last:border-0">
      <dt className="text-sm font-medium text-neutral-600">{label}</dt>
      <dd className="col-span-2 text-sm font-medium text-black">{value ?? '-'}</dd>
    </div>
  );
}

export function DetailView({ children }: { children: React.ReactNode }) {
  return <dl className="divide-y divide-neutral-100">{children}</dl>;
}
