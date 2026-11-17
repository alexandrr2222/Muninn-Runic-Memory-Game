import type { CardType } from "./types";

export type WikiDataType = {
  id: number;
  cardName: string;
  title: string;
  extract: string;
  url: string;
};

export async function fetchWiki(
  cards: Array<CardType>,
): Promise<Array<WikiDataType>> {
  const promises = cards.map(async (card) => {
    const res = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${card.wikiTitle}`,
    );
    if (!res.ok) throw new Error(card.name + " fetch failed");
    const data: {
      title: string;
      extract: string;
      content_urls: { desktop: { page: string } };
    } = await res.json();

    return {
      id: card.id,
      cardName: card.name,
      title: data.title,
      extract: data.extract,
      url: data.content_urls.desktop.page,
    };
  });
  const results = await Promise.allSettled(promises);
  const wikiDataArray = results
    .filter((obj) => obj.status === "fulfilled")
    .map((obj) => {
      if (obj.value.title.includes("(rune)"))
        return { ...obj.value, title: obj.value.title.slice(0, -7) };
      else return { ...obj.value };
    });
  return wikiDataArray;
}
