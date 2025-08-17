import { createClient } from "@/integrations/supabase/server";
import { notFound } from "next/navigation";
import StyledMenuPage from "@/components/StyledMenuPage";

interface Cafe {
  id: string;
  name: string;
  description: string | null;
  location: string | null;
  website: string | null;
}

interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number | null;
  image_url: string | null;
  is_available: boolean | null;
  sort_order: number | null;
}

interface CategoryWithItems {
  id: string;
  name: string;
  description: string | null;
  sort_order: number | null;
  menu_items: MenuItem[];
}

export default async function CafeMenuPage({
  params,
}: {
  params: { cafename: string };
}) {
  const cafename = decodeURIComponent(params.cafename);
  const supabase = await createClient();

  const { data: cafe, error: cafeError } = await supabase
    .from("cafes")
    .select("id, name, description, location, website, menu_design")
    .eq("name", cafename)
    .single<Cafe & { menu_design?: any }>();

  if (cafeError || !cafe) {
    return notFound();
  }

  const { data: categoriesData, error: categoriesError } = await supabase
    .from("menu_categories")
    .select(
      "id, name, description, sort_order, menu_items(id, name, description, price, image_url, is_available, sort_order)"
    )
    .eq("cafe_id", cafe.id)
    .order("sort_order", { ascending: true });

  if (categoriesError) {
    // If categories cannot be fetched, treat as not found
    return notFound();
  }

  const categories: CategoryWithItems[] = (categoriesData as any as CategoryWithItems[] | null) ?? [];

  // Sort items within each category by sort_order then name; filter unavailable to the end
  const preparedCategories = categories
    .map((category) => ({
      ...category,
      menu_items: [...(category.menu_items || [])]
        .sort((a, b) => {
          const ao = a.sort_order ?? Number.MAX_SAFE_INTEGER;
          const bo = b.sort_order ?? Number.MAX_SAFE_INTEGER;
          if (ao !== bo) return ao - bo;
          return a.name.localeCompare(b.name);
        }),
    }))
    .sort((a, b) => {
      const ao = a.sort_order ?? Number.MAX_SAFE_INTEGER;
      const bo = b.sort_order ?? Number.MAX_SAFE_INTEGER;
      if (ao !== bo) return ao - bo;
      return a.name.localeCompare(b.name);
    });

  return <StyledMenuPage cafe={cafe} categories={preparedCategories} />;
}