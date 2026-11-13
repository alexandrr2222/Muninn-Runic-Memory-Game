import type { CardType } from "@/shared/types";

export async function fetchWiki(
  cards: Array<CardType>,
  setCards: React.Dispatch<React.SetStateAction<CardType[]>>,
) {
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
      title: data.title,
      extract: data.extract,
      url: data.content_urls.desktop.page,
    };
  });
  const results = await Promise.allSettled(promises);
  const wikiDataArray = results.map((obj) => {
    if (obj.status === "fulfilled" && obj.value.title.includes("(rune)"))
      return { ...obj.value, title: obj.value.title.slice(0, -7) };
    else if (obj.status === "fulfilled") return { ...obj.value };
    else return { id: null, title: "", extract: "", url: "" };
  });
  const enrichedCards = cards.map((card) => {
    const desiredInfo = wikiDataArray.filter((inf) => inf.id === card.id);
    if (!desiredInfo[0]) return { ...card };
    return {
      ...card,
      fetchedWikiTitle: desiredInfo[0].title,
      fetchedWikiExtract: desiredInfo[0].extract,
      fetchedWikiUrl: desiredInfo[0].url,
    };
  });
  setCards(enrichedCards);
}
