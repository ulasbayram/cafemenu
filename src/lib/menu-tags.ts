export const ALLERGEN_OPTIONS = [
  { value: "gluten", label: "Gluten" },
  { value: "dairy", label: "Dairy" },
  { value: "nuts", label: "Nuts" },
  { value: "egg", label: "Egg" },
  { value: "soy", label: "Soy" },
  { value: "seafood", label: "Seafood" },
] as const;

export const DIETARY_OPTIONS = [
  { value: "vegetarian", label: "Vegetarian" },
  { value: "vegan", label: "Vegan" },
  { value: "spicy", label: "Spicy" },
  { value: "sugar-free", label: "Sugar-free" },
  { value: "halal", label: "Halal" },
] as const;

const TAG_LABELS = new Map<string, string>(
  [...ALLERGEN_OPTIONS, ...DIETARY_OPTIONS].map((tag) => [tag.value, tag.label])
);

export function getMenuTagLabel(value: string) {
  return TAG_LABELS.get(value) ?? value;
}

export function normalizeTags(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((tag): tag is string => typeof tag === "string" && tag.length > 0);
}
