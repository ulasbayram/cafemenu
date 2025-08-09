import { createClient } from "@/integrations/supabase/server";
import { notFound } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PostgrestSingleResponse } from "@supabase/supabase-js";

interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string | null;
  available: boolean;
}
interface CafeIdentity {
  id: string | null;
  name: string | null;
}

export default async function CafeMenuPage({
  params,
}: {
  params: { cafename: string };
}) {/* NEEDS WORK SUCH AS CAFE NOT FOUND OR 
    CAFE NAME INCLUDING SPECIAL CHARACTERS
    OR DUPLICATE CAFE NAMES */
  const { cafename } = await params;
  const supabase = await createClient();
  let d = { id: null, name: null };
  const cafe:any = await supabase
    .from("cafes")
    .select("id, name")
    .eq("name", cafename)
    .single()
  console.log(cafe)

  if (cafe.error != null || !cafe.data) {
    return notFound();
  }
  /*
  const { data: menu, error: menuError } = await supabase
    .from("menu_items")
    .select("*")
    .eq("cafe_id", cafe.data.id)
    .order("category", { ascending: true })
    .order("name", { ascending: true });

  if (menuError !== null) return notFound();
  console.log(menuError)
  // Group menu items by category
  const grouped = menu?.reduce<Record<string, MenuItem[]>>((acc, item) => {
    const cat = item.category || "Uncategorized";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {}) || {};
  */

  
  return (
    <h1>{cafe.data.name}</h1>
  );
}