import type { Status } from "@/lib/store";
import type { Dict } from "@/lib/i18n";

const tone: Record<Status, string> = {
  received: "bg-ivory-2 text-ink",
  contacted: "bg-blush text-bordeaux",
  quoted: "bg-gold/25 text-gold-deep",
  accepted: "bg-emerald-100 text-emerald-800",
  in_progress: "bg-bordeaux/10 text-bordeaux",
  ready: "bg-noir text-gold",
  delivered: "bg-emerald-600 text-white",
};

export function StatusBadge({ status, t }: { status: Status; t: Dict }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${tone[status]}`}>
      <span className="size-1.5 rounded-full bg-current opacity-70" />
      {t.status[status]}
    </span>
  );
}
