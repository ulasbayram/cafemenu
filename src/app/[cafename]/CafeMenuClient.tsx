"use client";

import StyledMenuPage from "@/components/StyledMenuPage";
import { useLanguage } from "../AppLayoutClient";

export default function CafeMenuClient({ cafe, categories }: any) {
  const lang = useLanguage();
  // Filter bilingual fields
  function parseLangField(field: any, lang: "en" | "tr") {
    if (!field) return "";
    if (typeof field === "string") {
      try {
        const obj = JSON.parse(field);
        if (obj && (typeof obj.en === "string" || typeof obj.tr === "string")) {
          return obj[lang] ?? obj.en ?? obj.tr ?? "";
        }
      } catch {}
      return field;
    }
    if (typeof field === "object" && (field.en || field.tr)) {
      return field[lang] ?? field.en ?? field.tr ?? "";
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
    })),
  }));

  return <StyledMenuPage cafe={cafe} categories={filteredCategories}  />;
}
