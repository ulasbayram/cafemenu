import { createClient } from "@/integrations/supabase/server";
import { notFound } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string | null;
  available: boolean;
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
  const {data, error}:any = await supabase
    .from("cafes")
    .select("id, name")
    .eq("name", cafename)
    .single()
    .then((res):any => {const cafe = res.data; console.log(cafe)})
  const cafe = { id: "data.id", name: "data.name" };

  const { data: menu, error: menuError } = await supabase
    .from("menu_items")
    .select("*")
    .eq("cafe_id", cafe.id)
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

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">{cafe.name} Menu</h1>
      {Object.entries(grouped).map(([category, items]:[category:any, items:any]) => (
        <section key={category} className="mb-8">
          <h2 className="text-xl font-semibold mb-4">{category}</h2>
          <div className="grid gap-4">
            {items.map((item:any) => (
              <Card key={item.id} className="flex flex-col">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-lg">{item.name}</CardTitle>
                  <span className="font-mono text-base font-semibold">
                    ₺{item.price.toFixed(2)}
                  </span>
                </CardHeader>
                <CardContent>
                  {item.description && (
                    <p className="text-muted-foreground mb-2">{item.description}</p>
                  )}
                  {!item.available && (
                    <Badge variant="destructive" className="mt-2">
                      Not Available
                    </Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      ))}
      {Object.keys(grouped).length === 0 && (
        <p className="text-center text-muted-foreground">No menu items found.</p>
      )}
    </div>
  );
}