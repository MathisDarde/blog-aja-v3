import Link from "next/link";
import { CalendarClock, Eye } from "lucide-react";
import type { DashboardDraft } from "@/lib/dashboard-data";
import { formatScheduledAt } from "@/lib/schedule-date";

/** Articles programmés, du plus proche au plus lointain, avec un lien vers leur aperçu. */
export default function ScheduledBanner({ drafts }: { drafts: DashboardDraft[] }) {
  const scheduled = drafts
    .filter((d): d is DashboardDraft & { scheduledAt: Date } => d.scheduledAt !== null)
    .sort((a, b) => a.scheduledAt.getTime() - b.scheduledAt.getTime());

  if (scheduled.length === 0) return null;

  return (
    <div className="w-full rounded-xl border border-aja-blue/30 bg-aja-blue/5 p-4 font-Montserrat">
      <h3 className="flex items-center gap-2 font-Bai_Jamjuree font-semibold text-lg uppercase text-aja-blue mb-2">
        <CalendarClock size={20} />
        {scheduled.length} article{scheduled.length > 1 ? "s" : ""} programmé
        {scheduled.length > 1 ? "s" : ""}
      </h3>
      <ul className="flex flex-col divide-y divide-aja-blue/10">
        {scheduled.map((draft) => (
          <li key={draft.id_draft} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 py-2 text-sm">
            <span className="font-semibold text-aja-blue sm:w-[260px] shrink-0 first-letter:uppercase">
              {formatScheduledAt(draft.scheduledAt)}
            </span>
            <span className="truncate flex-1">{draft.title || "Sans titre"}</span>
            <Link
              href={`/admin/brouillons/${draft.id_draft}/apercu`}
              className="flex items-center gap-1.5 font-semibold text-aja-blue hover:text-orange-third transition-colors shrink-0"
            >
              <Eye size={16} /> Aperçu
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
