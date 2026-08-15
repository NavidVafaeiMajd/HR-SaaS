export const SummaryCard = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-lg border bg-white p-3">
    <p className="text-sm text-muted-foreground">{label}</p>
    <p className="mt-2 text-lg font-bold">{value}</p>
  </div>
);
