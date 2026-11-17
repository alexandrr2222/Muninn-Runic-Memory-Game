import { describe, it, expect, vi, afterEach } from "vitest";
import { fetchWiki } from "./wikiFetch";
import type { CardType } from "@/shared/types";

const cards: Array<CardType> = [
  { id: 0, name: "Fé", icon: "", wikiTitle: "Fehu" },
  { id: 1, name: "Úr", icon: "", wikiTitle: "Ur_(rune)" },
  { id: 2, name: "Þurs", icon: "", wikiTitle: "Thurisaz" },
];

// A fake Wikipedia summary response for a page title.
function summary(title: string) {
  return new Response(
    JSON.stringify({
      title,
      extract: `About ${title}`,
      content_urls: { desktop: { page: `https://wiki/${title}` } },
    }),
  );
}

// Replaces the global fetch: each wikiTitle maps to a response,
// or to an Error for a network failure.
function mockWikipedia(responses: Record<string, Response | Error>) {
  vi.stubGlobal(
    "fetch",
    vi.fn(async (url: string) => {
      const wikiTitle = url.split("/").pop()!;
      const response = responses[wikiTitle];
      if (response instanceof Error) throw response;
      return response;
    }),
  );
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("fetchWiki", () => {
  it("returns title, extract and link for each card", async () => {
    mockWikipedia({
      Fehu: summary("Fehu"),
      "Ur_(rune)": summary("Ur (rune)"),
      Thurisaz: summary("Thurisaz"),
    });

    const result = await fetchWiki(cards);

    expect(result).toHaveLength(3);
    expect(result[0]).toEqual({
      id: 0,
      cardName: "Fé",
      title: "Fehu",
      extract: "About Fehu",
      url: "https://wiki/Fehu",
    });
  });

  it('strips " (rune)" from page titles', async () => {
    mockWikipedia({
      Fehu: summary("Fehu"),
      "Ur_(rune)": summary("Ur (rune)"),
      Thurisaz: summary("Thurisaz"),
    });

    const result = await fetchWiki(cards);

    expect(result.find((w) => w.id === 1)?.title).toBe("Ur");
  });

  it("leaves out cards whose request fails", async () => {
    mockWikipedia({
      Fehu: summary("Fehu"),
      "Ur_(rune)": new Response("Not found", { status: 404 }),
      Thurisaz: new Error("network down"),
    });

    const result = await fetchWiki(cards);

    expect(result.map((w) => w.id)).toEqual([0]);
  });

  it("returns an empty list when every request fails", async () => {
    mockWikipedia({
      Fehu: new Error("offline"),
      "Ur_(rune)": new Error("offline"),
      Thurisaz: new Error("offline"),
    });

    await expect(fetchWiki(cards)).resolves.toEqual([]);
  });
});
