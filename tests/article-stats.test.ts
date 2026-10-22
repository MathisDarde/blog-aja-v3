import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fetchArticleStats } from "@/lib/article-stats";

const results = [
  ["/articles/djibril-cisse-carriere", 120, 80],
  ["/articles/djibril-cisse-carriere/", 5, 4],
  ["/articles/djibril-cisse-carriere/update", 30, 1],
  ["/articles/guy-roux", 12, 10],
];

describe("vues des articles (PostHog)", () => {
  beforeEach(() => {
    vi.stubEnv("POSTHOG_PERSONAL_API_KEY", "phx_test");
    vi.stubEnv("POSTHOG_PROJECT_ID", "42");
    vi.stubEnv("NEXT_PUBLIC_POSTHOG_HOST", "https://eu.i.posthog.com");
    vi.spyOn(console, "error").mockImplementation(() => {});
  });
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("regroupe les vues par slug, sans les pages de modification", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ results })));
    vi.stubGlobal("fetch", fetchMock);

    expect(await fetchArticleStats()).toEqual({
      "djibril-cisse-carriere": { views: 125, visitors: 84 },
      "guy-roux": { views: 12, visitors: 10 },
    });
    // API de l'hôte sans « .i »
    expect(fetchMock.mock.calls[0][0]).toBe("https://eu.posthog.com/api/projects/42/query/");
  });

  it("renvoie null sans clé ou si PostHog répond en erreur", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("non", { status: 403 })));
    expect(await fetchArticleStats()).toBeNull();

    vi.stubEnv("POSTHOG_PERSONAL_API_KEY", "");
    expect(await fetchArticleStats()).toBeNull();
  });
});
