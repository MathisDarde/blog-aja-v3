import { ArticleSchema } from "@/app/schema";
import { db } from "@/db/db";
import { draftTable } from "@/db/schema";
import { insertPublishedArticle } from "@/lib/publish-article";
import { and, eq, lte } from "drizzle-orm";

type ScheduledPublishResult = {
  published: string[];
  failed: { id: string; slug: string | null; error: string }[];
};

// Publie les brouillons dont la date programmée est passée. Appelé par le cron
// (/api/cron/publish-scheduled), sans session : ne jamais exposer en "use server".
export async function publishDueDrafts(
  now = new Date()
): Promise<ScheduledPublishResult> {
  const due = await db
    .select()
    .from(draftTable)
    .where(
      and(eq(draftTable.state, "pending"), lte(draftTable.scheduledAt, now))
    );

  const result: ScheduledPublishResult = { published: [], failed: [] };

  for (const draft of due) {
    // Le brouillon a pu être modifié après sa programmation : on revalide tout
    const parsed = ArticleSchema.safeParse({
      title: draft.title ?? "",
      slug: draft.slug ?? "",
      teaser: draft.teaser ?? "",
      content: draft.content ?? "",
      author: draft.author ?? "",
      tags: draft.tags ?? [],
      imageUrl: draft.imageUrl ?? "",
    });

    if (!parsed.success) {
      // Incomplet : on retire la programmation plutôt que de réessayer à chaque passage
      await db
        .update(draftTable)
        .set({ scheduledAt: null })
        .where(eq(draftTable.id_draft, draft.id_draft));
      result.failed.push({
        id: draft.id_draft,
        slug: draft.slug,
        error: parsed.error.errors.map((e) => e.message).join(" "),
      });
      continue;
    }

    try {
      // Le slug est unique côté articles : deux exécutions simultanées du cron
      // ne peuvent pas publier deux fois le même brouillon (ni doubler la newsletter)
      await insertPublishedArticle(parsed.data, draft.userId);
      await db.delete(draftTable).where(eq(draftTable.id_draft, draft.id_draft));
      result.published.push(parsed.data.slug);
    } catch (err) {
      console.error(`Publication programmée de "${draft.slug}" :`, err);
      result.failed.push({
        id: draft.id_draft,
        slug: draft.slug,
        error: err instanceof Error ? err.message : "Erreur inconnue",
      });
    }
  }

  return result;
}
