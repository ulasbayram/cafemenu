import { createClient } from "@/integrations/supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CurrencySelector, Price } from "./currency";
import { LanguageToggle } from "@/components/LanguageToggle";
import { LangText } from "@/components/LangText";
import CategoryNav from "./CategoryNav";

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
    .select("id, name, description, location, website")
    .eq("name", cafename)
    .single<Cafe>();

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

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <header className="mb-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight">{cafe.name}</h1>
              {cafe.description && (
                <p className="text-muted-foreground mt-2 max-w-3xl">{cafe.description}</p>
              )}
              <div className="mt-4 flex gap-3 items-center text-sm text-muted-foreground">
                {cafe.location && <span>{cafe.location}</span>}
                {cafe.website && (
                  <a
                    href={cafe.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline decoration-dotted underline-offset-4"
                  >
                    Visit website
                  </a>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <CurrencySelector />
              <LanguageToggle />
              <ThemeToggle />
            </div>
          </div>
        </header>

        <CategoryNav categories={preparedCategories.map(c => ({ id: c.id, name: c.name }))} />

        {preparedCategories.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center text-muted-foreground">
              Menu is not available yet.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {preparedCategories.map((category) => (
              <section key={category.id} id={`cat-${category.id}`} className="scroll-mt-24">
                <div className="flex items-baseline justify-between mb-4">
                  <h2 className="text-2xl font-bold">{category.name}</h2>
                  {category.description && (
                    <span className="text-sm text-muted-foreground">{category.description}</span>
                  )}
                </div>
                {category.menu_items.length === 0 ? (
                  <Card>
                    <CardContent className="py-8 text-center text-muted-foreground">
                      No items in this category yet.
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {category.menu_items.map((item) => (
                      <Card key={item.id} className="overflow-hidden">
                        {item.image_url ? (
                          <div className="relative w-full h-40">
                            <Image
                              src={item.image_url}
                              alt={item.name}
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              className="object-cover"
                              unoptimized
                            />
                          </div>
                        ) : (
                          <div className="w-full h-40 bg-muted flex items-center justify-center">
                            <span className="text-muted-foreground">No image</span>
                          </div>
                        )}
                        <CardHeader className="pb-2">
                          <div className="flex items-start justify-between gap-4">
                            <CardTitle className="text-lg leading-tight">
                              {item.name}
                            </CardTitle>
                            <div className="flex items-center gap-2">
                              {item.is_available === false && (
                                <Badge variant="secondary">Unavailable</Badge>
                              )}
                              <Price valueUsd={item.price} />
                            </div>
                          </div>
                        </CardHeader>
                        {item.description && (
                          <CardContent className="pt-0">
                            <p className="text-sm text-muted-foreground"><LangText value={item.description} /></p>
                          </CardContent>
                        )}
                      </Card>
                    ))}
                  </div>
                )}
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}