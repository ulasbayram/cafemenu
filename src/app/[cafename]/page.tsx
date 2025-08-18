import { createClient } from "@/integrations/supabase/server";
import { notFound } from "next/navigation";
import CafeMenuClient from "./CafeMenuClient";

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



export default async function CafeMenuPage({ params }: { params: { cafename: string } }) {
  const cafename = decodeURIComponent(params.cafename);

  async function fetchData() {
    const supabase = await createClient();
    const { data: cafe, error: cafeError } = await supabase
      .from("cafes")
      .select("id, name, description, location, website, menu_design")
      .eq("name", cafename)
      .single<Cafe & { menu_design?: any }>();

    if (cafeError || !cafe) {
      return { notFound: true };
    }

    const { data: categoriesData, error: categoriesError } = await supabase
      .from("menu_categories")
      .select(
        "id, name, description, sort_order, menu_items(id, name, description, price, image_url, is_available, sort_order)"
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