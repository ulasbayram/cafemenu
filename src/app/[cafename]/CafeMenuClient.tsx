"use client";

import { useEffect } from "react";
import StyledMenuPage from "@/components/StyledMenuPage";
import { useLanguage } from "../AppLayoutClient";
import { normalizeTags } from "@/lib/menu-tags";

export default function CafeMenuClient({ cafe, categories }: any) {
  const lang = useLanguage();

  useEffect(() => {
    if (!cafe?.id) return;

    const key = `menu-view:${cafe.id}`;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");

    fetch("/api/menu-view", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cafeId: cafe.id }),
      keepalive: true,
    }).catch(() => {});
  }, [cafe?.id]);

  // Filter bilingual fields
  function parseLangField(field: any, lang: "en" | "tr") {
    if (!field) return "";
    if (typeof field === "string") {
      try {
        const obj = JSON.parse(field);
        if (obj && typeof obj === "object" && ("en" in obj || "tr" in obj)) {
          const text = obj[lang] ?? obj.en ?? obj.tr ?? "";
          return typeof text === "string" ? text : "";
        }
      } catch {}
      return field;
    }
    if (typeof field === "object" && ("en" in field || "tr" in field)) {
      const text = field[lang] ?? field.en ?? field.tr ?? "";
      return typeof text === "string" ? text : "";
    }
    return field;
  }

  const filteredCategories = categories.map((category: any) => ({
    ...category,
    name: parseLangField(category.name, lang),
    description: parseLangField(category.description, lang),
    menu_items: (category.menu_items || []).map((item: any) => ({
      ...item,
      name: parseLangField(item.name, lang),
      description: parseLangField(item.description, lang),
      allergens: normalizeTags(item.allergens),
      dietary_tags: normalizeTags(item.dietary_tags),
    })),
  }));

  return <StyledMenuPage cafe={cafe} categories={filteredCategories}  />;
}
