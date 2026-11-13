export type CardType = {
  id: number;
  name: string;
  icon: string;
  wikiTitle: string;
  fetchedWikiTitle?: string;
  fetchedWikiExtract?: string;
  fetchedWikiUrl?: string;
};
export type WikiDataType = {
  id: number;
  title: string;
  extract: string;
  url: string;
};
