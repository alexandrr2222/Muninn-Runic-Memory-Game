import type { WikiDataType } from "@/shared/types";
import { useEffect, useState } from "react";
import { fetchWiki } from "./wikiFetch";
import { baseCards } from "./CardsArray";

export function useWikiData() {
  const [wikiData, setWikiData] = useState<Array<WikiDataType>>();

  useEffect(() => {
    fetchWiki(baseCards).then(setWikiData);
  }, []);

  const getWikiFor = (id: number | undefined) =>
    wikiData?.find((wd) => wd.id === id);
  return getWikiFor;
}
