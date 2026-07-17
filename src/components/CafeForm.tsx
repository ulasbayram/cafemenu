import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Trans } from "./Trans";
import { slugify } from "@/lib/slug";

interface CafeFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  cafe?: any; // For editing existing cafe
}

const CafeForm = ({ onSuccess, onCancel, cafe }: CafeFormProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: cafe?.name || "",
    slug: cafe?.slug || slugify(cafe?.name || ""),
    description: cafe?.description || "",
    location: cafe?.location || "",
    website: cafe?.website || "",
    email: cafe?.email || "",
    phone: cafe?.phone || "",
  });
  const [slugTouched, setSlugTouched] = useState(Boolean(cafe?.slug));
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Error", // Keep English for technical messages
          description: "You must be logged in to create a cafe", // Can be translated if needed
          variant: "destructive",
        });
        return;
      }

      if (cafe) {
        // Update existing cafe
        const { error } = await supabase
          .from("cafes")
          .update({ ...formData, slug: slugify(formData.slug || formData.name) })
          .eq("id", cafe.id);

        if (error) throw error;

        toast({
          title: "Success", // Keep English for technical messages
          description: "Cafe updated successfully!", // Can be translated if needed
        });
      } else {
        // Create new cafe
        const { error } = await supabase
          .from("cafes")
          .insert([
            {
              ...formData,
              slug: slugify(formData.slug || formData.name),
              user_id: user.id,
            },
          ]);

        if (error) throw error;

        toast({
          title: "Success", // Keep English for technical messages
          description: "Cafe created successfully!", // Can be translated if needed
        });
      }
      onSuccess();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => {
      const next = { ...prev, [field]: value };
      if (field === "name" && !slugTouched) {
        next.slug = slugify(value);
      }
      return next;
    });
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{cafe ? <Trans k="editCafe" /> : <Trans k="createNewCafe" />}</CardTitle>
        <CardDescription>
          {cafe ? <Trans k="editCafeDescription" /> : <Trans k="createCafeDescription" />}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name"><Trans k="cafeName" /> *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="My Amazing Cafe"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Menu URL Slug *</Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) => {
                setSlugTouched(true);
                handleChange("slug", slugify(e.target.value));
              }}
              placeholder="my-amazing-cafe"
              required
            />
            <p className="text-xs text-muted-foreground">
              Public menu path: /{formData.slug || "my-amazing-cafe"}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description"><Trans k="description" /></Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="A cozy place serving the best coffee in town..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location"><Trans k="location" /></Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => handleChange("location", e.target.value)}
              placeholder="123 Main St, City, State"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="website"><Trans k="website" /></Label>
            <Input
              id="website"
              type="url"
              value={formData.website}
              onChange={(e) => handleChange("website", e.target.value)}
              placeholder="https://mycafe.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email"><Trans k="email" /></Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="contact@mycafe.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone"><Trans k="phone" /></Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              placeholder="+1 (555) 123-4567"
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={loading || !formData.name} className="flex-1">
              {loading ? (cafe ? <Trans k="updating" /> : <Trans k="creating" />) : (cafe ? <Trans k="updateCafe" /> : <Trans k="createCafe" />)}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              <Trans k="cancel" />
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CafeForm;
