import type { WikiDataType } from "./fetchWiki";
import { useEffect, useState } from "react";
import { fetchWiki } from "./fetchWiki";
import { baseCards } from "../deck/cards";

export function useWikiData() {
  const [wikiData, setWikiData] = useState<Array<WikiDataType>>();

  useEffect(() => {
    fetchWiki(baseCards).then(setWikiData);
  }, []);

  const getWikiFor = (id: number | undefined) =>
    wikiData?.find((wd) => wd.id === id);
  return getWikiFor;
}
