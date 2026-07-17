import { createClient } from "@/integrations/supabase/server";
import { notFound } from "next/navigation";
import CafeMenuClient from "./CafeMenuClient";

interface Cafe {
  id: string;
  name: string;
  slug: string;
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
  allergens: string[] | null;
  dietary_tags: string[] | null;
}

interface CategoryWithItems {
  id: string;
  name: string;
  description: string | null;
  sort_order: number | null;
  menu_items: MenuItem[];
}

type paramsType = Promise<{ cafename: string }>;

//export default async function CafeMenuPage({ params }: { params: { cafename: string } }) {
export default async function CafeMenuPage({ params }: { params: paramsType }) {
  const awaitedParams = await params;
  const cafename = decodeURIComponent(awaitedParams.cafename);

  async function fetchData() {
    const supabase = await createClient();
    const cafeSelect = "id, name, slug, description, location, website, menu_design";
    const { data: slugCafe, error: slugCafeError } = await supabase
      .from("cafes")
      .select(cafeSelect)
      .eq("slug", cafename)
      .single<Cafe & { menu_design?: any }>();

    let cafe = slugCafe;

    if (slugCafeError || !slugCafe) {
      const { data: nameCafe, error: nameCafeError } = await supabase
        .from("cafes")
        .select(cafeSelect)
        .eq("name", cafename)
        .single<Cafe & { menu_design?: any }>();

      if (nameCafeError || !nameCafe) {
        return { notFound: true };
      }

      cafe = nameCafe;
    }

    if (!cafe) {
      return { notFound: true };
    }

    const { data: categoriesData, error: categoriesError } = await supabase
      .from("menu_categories")
      .select(
        "id, name, description, sort_order, menu_items(id, name, description, price, image_url, is_available, sort_order, allergens, dietary_tags)"
      )
      .eq("cafe_id", cafe.id)
      .order("sort_order", { ascending: true });

    if (categoriesError) {
      return { notFound: true };
    }

    const categories: CategoryWithItems[] = (categoriesData as any as CategoryWithItems[] | null) ?? [];
    return { cafe, categories };
  }

  const { cafe, categories, notFound: nf } = await fetchData();
  if (nf) return notFound();
  return <CafeMenuClient cafe={cafe} categories={categories} />;
}
