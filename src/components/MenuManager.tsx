import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, ArrowLeft, Save, X } from "lucide-react";
import { LangText } from "./LangText";
import { Switch } from "@/components/ui/switch";
import { MenuPreview } from "./MenuPreview";
import { MenuDesign } from "./MenuDesign";
import { Trans } from "./Trans";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { LanguageToggle } from "./LanguageToggle";
import { ALLERGEN_OPTIONS, DIETARY_OPTIONS, getMenuTagLabel, normalizeTags } from "@/lib/menu-tags";

interface Cafe {
  id: string;
  name: string;
  description: string;
  location: string;
}

interface Category {
  id: string;
  name: string;
  description: string | null;
  sort_order: number | null;
}

interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number | null;
  category_id: string;
  is_available: boolean | null;
  sort_order: number | null;
  image_url: string | null;
  allergens?: string[] | null;
  dietary_tags?: string[] | null;
}

interface MenuManagerProps {
  cafe: Cafe;
  onBack: () => void;
}

const MenuManager = ({ cafe, onBack }: MenuManagerProps) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showItemForm, setShowItemForm] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [categoryUpdateLoading, setCategoryUpdateLoading] = useState(false);
  const [menuDesign, setMenuDesign] = useState<any>(null);
  const { toast } = useToast();

  const [categoryForm, setCategoryForm] = useState({
    name_en: "",
    name_tr: "",
    description_en: "",
    description_tr: "",
  });

  const [itemForm, setItemForm] = useState({
    name_en: "",
    name_tr: "",
    description_en: "",
    description_tr: "",
    price: "",
    category_id: "",
    is_available: true,
    image: null as File | null,
    allergens: [] as string[],
    dietary_tags: [] as string[],
  });

  const [editForm, setEditForm] = useState({
    name_en: "",
    name_tr: "",
    description_en: "",
    description_tr: "",
    price: "",
    category_id: "",
    is_available: true,
    image: null as File | null,
    currentImageUrl: "",
    allergens: [] as string[],
    dietary_tags: [] as string[],
  });

  useEffect(() => {
    fetchCategories();
    fetchMenuItems();
  }, [cafe.id]);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from("menu_categories")
        .select("*")
        .eq("cafe_id", cafe.id)
        .order("sort_order");

      if (error) throw error;
      setCategories(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const fetchMenuItems = async () => {
    try {
      const { data, error } = await supabase
        .from("menu_items")
        .select("*, menu_categories!inner(cafe_id)")
        .eq("menu_categories.cafe_id", cafe.id)
        .order("sort_order");

      if (error) throw error;
      const scopedItems = (data || []).map((row: any) => {
        const item = { ...row };
        delete item.menu_categories;
        return item;
      });
      setMenuItems(scopedItems);
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

  const createCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from("menu_categories")
        .insert([
          {
            name: JSON.stringify({ en: categoryForm.name_en || null, tr: categoryForm.name_tr || null }),
            description: JSON.stringify({ en: categoryForm.description_en || null, tr: categoryForm.description_tr || null }),
            cafe_id: cafe.id,
            sort_order: categories.length,
          },
        ]);

      if (error) throw error;

      toast({
        title: "Success", // Keep English for technical messages
        description: "Category created successfully!", // Can be translated if needed
      });

      setCategoryForm({ name_en: "", name_tr: "", description_en: "", description_tr: "" });
      setShowCategoryForm(false);
      setEditingCategory(null);
      fetchCategories();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const createMenuItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let image_url = null;

      // Upload image if provided
      if (itemForm.image) {
        const fileExt = itemForm.image.name.split('.').pop();
        const fileName = `${cafe.id}/${Date.now()}.${fileExt}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('menu-images')
          .upload(fileName, itemForm.image);

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('menu-images')
          .getPublicUrl(fileName);
        
        image_url = publicUrl;
      }

      const { error } = await supabase
        .from("menu_items")
        .insert([
          {
            name: JSON.stringify({ en: itemForm.name_en || null, tr: itemForm.name_tr || null }),
            description: JSON.stringify({ en: itemForm.description_en || null, tr: itemForm.description_tr || null }),
            price: itemForm.price === "" ? null : parseFloat(itemForm.price),
            category_id: itemForm.category_id,
            is_available: itemForm.is_available,
            image_url,
            allergens: itemForm.allergens,
            dietary_tags: itemForm.dietary_tags,
            sort_order: menuItems.filter(item => item.category_id === itemForm.category_id).length,
          },
        ]);

      if (error) throw error;

      toast({
        title: "Success", // Keep English for technical messages
        description: "Menu item created successfully!", // Can be translated if needed
      });

      setItemForm({
        name_en: "",
        name_tr: "",
        description_en: "",
        description_tr: "",
        price: "",
        category_id: "",
        is_available: true,
        image: null,
        allergens: [],
        dietary_tags: [],
      });
      setShowItemForm(false);
      fetchMenuItems();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getCategoryItems = (categoryId: string) => {
    return menuItems.filter(item => item.category_id === categoryId);
  };

  const startEditingItem = (item: MenuItem) => {
    setEditingItem(item);
    try {
      let parsedDescription: any = {}
      let parsedName: any = {}
      try { parsedDescription = item.description ? JSON.parse(item.description) : {} } catch {}
      try { parsedName = item.name ? JSON.parse(item.name) : {} } catch {}
    setEditForm({
      name_en: parsedName?.en ?? (typeof item.name === 'string' ? item.name : ""),
      name_tr: parsedName?.tr ?? "",
      description_en: parsedDescription?.en ?? (typeof item.description === 'string' ? item.description : ""),
      description_tr: parsedDescription?.tr ?? "",
      price: (item.price ?? 0).toString(),
      category_id: item.category_id,
      is_available: !!item.is_available,
      image: null,
      currentImageUrl: item.image_url || "",
      allergens: normalizeTags(item.allergens),
      dietary_tags: normalizeTags(item.dietary_tags),
    });
    } catch { /* ignore */ }
  };

  const cancelEditingItem = () => {
    setEditingItem(null);
    setEditForm({
      name_en: "",
      name_tr: "",
      description_en: "",
      description_tr: "",
      price: "",
      category_id: "",
      is_available: true,
      image: null,
      currentImageUrl: "",
      allergens: [],
      dietary_tags: [],
    });
  };

  const updateMenuItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    try {
      let image_url = editForm.currentImageUrl;

      // Upload new image if provided
      if (editForm.image) {
        // Delete old image if exists
        if (editForm.currentImageUrl) {
          const oldPath = editForm.currentImageUrl.split('/menu-images/')[1];
          if (oldPath) {
            await supabase.storage.from('menu-images').remove([oldPath]);
          }
        }

        const fileExt = editForm.image.name.split('.').pop();
        const fileName = `${cafe.id}/${Date.now()}.${fileExt}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('menu-images')
          .upload(fileName, editForm.image);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('menu-images')
          .getPublicUrl(fileName);
        
        image_url = publicUrl;
      }

      const { error } = await supabase
        .from("menu_items")
        .update({
          name: JSON.stringify({ en: editForm.name_en || null, tr: editForm.name_tr || null }),
          description: JSON.stringify({ en: editForm.description_en || null, tr: editForm.description_tr || null }),
          price: editForm.price === "" ? null : parseFloat(editForm.price),
          category_id: editForm.category_id,
          is_available: editForm.is_available,
          image_url,
          allergens: editForm.allergens,
          dietary_tags: editForm.dietary_tags,
        })
        .eq("id", editingItem.id);

      if (error) throw error;

      toast({
        title: "Success", // Keep English for technical messages
        description: "Menu item updated successfully!", // Can be translated if needed
      });

      cancelEditingItem();
      fetchMenuItems();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDesignChange = (design: any) => {
    setMenuDesign(design);
  };

  const toggleTag = (selected: string[], value: string) => (
    selected.includes(value)
      ? selected.filter((tag) => tag !== value)
      : [...selected, value]
  );

  const renderTagButtons = (
    options: readonly { value: string; label: string }[],
    selected: string[],
    onChange: (next: string[]) => void
  ) => (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const active = selected.includes(option.value);
        return (
          <Button
            key={option.value}
            type="button"
            size="sm"
            variant={active ? "default" : "outline"}
            onClick={() => onChange(toggleTag(selected, option.value))}
          >
            {option.label}
          </Button>
        );
      })}
    </div>
  );

  const startEditingCategory = (category: Category) => {
    try {
      let parsedName: any = {}
      let parsedDescription: any = {}
      try { parsedName = category.name ? JSON.parse(category.name) : {} } catch {}
      try { parsedDescription = category.description ? JSON.parse(category.description) : {} } catch {}
      
      setCategoryForm({
        name_en: parsedName?.en ?? (typeof category.name === 'string' ? category.name : ""),
        name_tr: parsedName?.tr ?? "",
        description_en: parsedDescription?.en ?? (typeof category.description === 'string' ? category.description : ""),
        description_tr: parsedDescription?.tr ?? "",
      });
      setEditingCategory(category);
      setShowCategoryForm(true);
    } catch { /* ignore */ }
  };

  const cancelEditingCategory = () => {
    setEditingCategory(null);
    setShowCategoryForm(false);
    setCategoryForm({ name_en: "", name_tr: "", description_en: "", description_tr: "" });
  };

  const updateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;
    
    setCategoryUpdateLoading(true);
    try {
      const { error } = await supabase
        .from("menu_categories")
        .update({
          name: JSON.stringify({ en: categoryForm.name_en || null, tr: categoryForm.name_tr || null }),
          description: JSON.stringify({ en: categoryForm.description_en || null, tr: categoryForm.description_tr || null }),
        })
        .eq("id", editingCategory.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Category updated successfully!",
      });

      cancelEditingCategory();
      fetchCategories();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setCategoryUpdateLoading(false);
    }
  };

  const confirmDeleteCategory = async () => {
    if (!categoryToDelete) return;

    try {
      // First delete all menu items in this category
      const { error: itemsError } = await supabase
        .from("menu_items")
        .delete()
        .eq("category_id", categoryToDelete.id);

      if (itemsError) throw itemsError;

      // Then delete the category
      const { error: categoryError } = await supabase
        .from("menu_categories")
        .delete()
        .eq("id", categoryToDelete.id);

      if (categoryError) throw categoryError;

      toast({
        title: "Success",
        description: "Category deleted successfully!",
      });

      setCategoryToDelete(null);
      fetchCategories();
      fetchMenuItems();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const deleteMenuItem = async (item: MenuItem) => {
    if (!confirm(`Are you sure you want to delete "${item.name}"?`)) return;

    try {
      // Delete image from storage if exists
      if (item.image_url) {
        const imagePath = item.image_url.split('/menu-images/')[1];
        if (imagePath) {
          await supabase.storage.from('menu-images').remove([imagePath]);
        }
      }

      const { error } = await supabase
        .from("menu_items")
        .delete()
        .eq("id", item.id);

      if (error) throw error;

      toast({
        title: "Success", // Keep English for technical messages
        description: "Menu item deleted successfully!", // Can be translated if needed
      });

      fetchMenuItems();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div><Trans k="loadingMenu" /></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            <Trans k="backToDashboard" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{cafe.name}</h1>
            <p className="text-muted-foreground"><Trans k="menuManagement" /></p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <LanguageToggle />
          <MenuPreview 
            cafe={cafe}
            categories={categories}
            menuItems={menuItems}
            customDesign={menuDesign}
          />
        </div>
      </div>

      <Tabs defaultValue="categories" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="categories"><Trans k="categories" /></TabsTrigger>
            <TabsTrigger value="items"><Trans k="menuItems" /></TabsTrigger>
            <TabsTrigger value="design"><Trans k="design" /></TabsTrigger>
          </TabsList>
          <div className="sm:hidden">
            <MenuPreview 
              cafe={cafe}
              categories={categories}
              menuItems={menuItems}
              customDesign={menuDesign}
            />
          </div>
        </div>

        <TabsContent value="categories" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold"><Trans k="menuCategories" /></h2>
            <Button onClick={() => {
              if (!showCategoryForm) {
                setCategoryForm({ name_en: "", name_tr: "", description_en: "", description_tr: "" });
                setEditingCategory(null);
              }
              setShowCategoryForm(true);
            }}>
              <Plus className="h-4 w-4 mr-2" />
              <Trans k="addCategory" />
            </Button>
          </div>

          {showCategoryForm && (
            <Card>
              <CardHeader>
                <CardTitle>
                  {editingCategory ? <Trans k="editCategory" /> : <Trans k="createNewCategory" />}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={editingCategory ? updateCategory : createCategory} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="categoryNameEn"><Trans k="categoryNameEnglish" /> *</Label>
                      <Input
                        id="categoryNameEn"
                        value={categoryForm.name_en}
                        onChange={(e) => setCategoryForm(prev => ({ ...prev, name_en: e.target.value }))}
                        placeholder="e.g., Appetizers"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="categoryNameTr"><Trans k="categoryNameTurkish" /></Label>
                      <Input
                        id="categoryNameTr"
                        value={categoryForm.name_tr}
                        onChange={(e) => setCategoryForm(prev => ({ ...prev, name_tr: e.target.value }))}
                        placeholder="ör. Mezeler"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="categoryDescEn"><Trans k="categoryDescriptionEnglish" /></Label>
                      <Textarea
                        id="categoryDescEn"
                        value={categoryForm.description_en}
                        onChange={(e) => setCategoryForm(prev => ({ ...prev, description_en: e.target.value }))}
                        placeholder="Brief description in English"
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="categoryDescTr"><Trans k="categoryDescriptionTurkish" /></Label>
                      <Textarea
                        id="categoryDescTr"
                        value={categoryForm.description_tr}
                        onChange={(e) => setCategoryForm(prev => ({ ...prev, description_tr: e.target.value }))}
                        placeholder="Türkçe kısa açıklama"
                        rows={3}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" disabled={categoryUpdateLoading}>
                      {categoryUpdateLoading ? (
                        <Trans k="updating" />
                      ) : editingCategory ? (
                        <Trans k="updateCategory" />
                      ) : (
                        <Trans k="createCategory" />
                      )}
                    </Button>
                    <Button type="button" variant="outline" onClick={editingCategory ? cancelEditingCategory : () => setShowCategoryForm(false)}>
                      <Trans k="cancel" />
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          <div className="grid gap-4">
            {categories.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <h3 className="text-lg font-semibold mb-2"><Trans k="noCategoriesYet" /></h3>
                  <p className="text-muted-foreground text-center mb-4">
                    <Trans k="createFirstCategory" />
                  </p>
                </CardContent>
              </Card>
            ) : (
              categories.map((category) => (
                <Card key={category.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle><LangText value={category.name} /></CardTitle>
                        <CardDescription><LangText value={category.description} /></CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">
                          {getCategoryItems(category.id).length} <Trans k="items" />
                        </Badge>
                        <div className="flex gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => startEditingCategory(category)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCategoryToDelete(category)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="items" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold"><Trans k="menuItems" /></h2>
            <Button 
              onClick={() => setShowItemForm(true)}
              disabled={categories.length === 0}
            >
              <Plus className="h-4 w-4 mr-2" />
              <Trans k="addItem" />
            </Button>
          </div>

          {categories.length === 0 && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <h3 className="text-lg font-semibold mb-2"><Trans k="noCategoriesAvailable" /></h3>
                <p className="text-muted-foreground text-center mb-4">
                  <Trans k="needCategoryFirst" />
                </p>
              </CardContent>
            </Card>
          )}

          {showItemForm && categories.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle><Trans k="createNewMenuItem" /></CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={createMenuItem} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="itemNameEn"><Trans k="itemNameEnglish" /> *</Label>
                        <Input
                          id="itemNameEn"
                          value={itemForm.name_en}
                          onChange={(e) => setItemForm(prev => ({ ...prev, name_en: e.target.value }))}
                          placeholder="e.g., Caesar Salad"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="itemNameTr"><Trans k="itemNameTurkish" /></Label>
                        <Input
                          id="itemNameTr"
                          value={itemForm.name_tr}
                          onChange={(e) => setItemForm(prev => ({ ...prev, name_tr: e.target.value }))}
                          placeholder="ör. Sezar Salata"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="itemDescriptionEn"><Trans k="descriptionEnglish" /></Label>
                        <Textarea
                          id="itemDescriptionEn"
                          value={itemForm.description_en}
                          onChange={(e) => setItemForm(prev => ({ ...prev, description_en: e.target.value }))}
                          placeholder="Fresh romaine lettuce with parmesan cheese and croutons..."
                          rows={3}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="itemDescriptionTr"><Trans k="descriptionTurkish" /></Label>
                        <Textarea
                          id="itemDescriptionTr"
                          value={itemForm.description_tr}
                          onChange={(e) => setItemForm(prev => ({ ...prev, description_tr: e.target.value }))}
                          placeholder="Parmesan ve krutonlu taze marul..."
                          rows={3}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="itemPrice"><Trans k="priceUSD" /> *</Label>
                        <Input
                          id="itemPrice"
                          type="number"
                          step="0.01"
                          value={itemForm.price}
                          onChange={(e) => setItemForm(prev => ({ ...prev, price: e.target.value }))}
                          placeholder="12.99"
                          required
                        />
                      </div>
                      <div className="flex items-center gap-3 pt-6">
                        <Switch id="itemAvailable" checked={itemForm.is_available} onCheckedChange={(v: boolean) => setItemForm(prev => ({ ...prev, is_available: v }))} />
                        <Label htmlFor="itemAvailable"><Trans k="available" /></Label>
                      </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="itemCategory"><Trans k="category" /> *</Label>
                    <select
                      id="itemCategory"
                      value={itemForm.category_id}
                      onChange={(e) => setItemForm(prev => ({ ...prev, category_id: e.target.value }))}
                      className="w-full p-2 border border-input rounded-md bg-background"
                      required
                    >
                      <option value=""><Trans k="selectCategory" /></option>
                      {categories.map((category) => {
                        // Parse category name for display in option
                        let displayName = category.name;
                        try {
                          const parsed = JSON.parse(category.name);
                          displayName = parsed.en || parsed.tr || category.name;
                        } catch {
                          // fallback to string value
                        }
                        return (
                          <option key={category.id} value={category.id}>
                            {displayName}
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Dietary Tags</Label>
                      {renderTagButtons(DIETARY_OPTIONS, itemForm.dietary_tags, (next) =>
                        setItemForm(prev => ({ ...prev, dietary_tags: next }))
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>Allergens</Label>
                      {renderTagButtons(ALLERGEN_OPTIONS, itemForm.allergens, (next) =>
                        setItemForm(prev => ({ ...prev, allergens: next }))
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="itemImage"><Trans k="image" /></Label>
                    <Input
                      id="itemImage"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        setItemForm(prev => ({ ...prev, image: file }));
                      }}
                      className="cursor-pointer"
                    />
                    <p className="text-xs text-muted-foreground">
                      <Trans k="uploadImageOptional" />
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit"><Trans k="createItem" /></Button>
                    <Button type="button" variant="outline" onClick={() => setShowItemForm(false)}>
                      <Trans k="cancel" />
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          <div className="space-y-6">
            {categories.map((category) => {
              const categoryItems = getCategoryItems(category.id);
              return (
                <div key={category.id}>
                  <h3 className="text-lg font-semibold mb-3"><LangText value={category.name} /></h3>
                  {categoryItems.length === 0 ? (
                    <Card>
                      <CardContent className="flex flex-col items-center justify-center py-8">
                        <p className="text-muted-foreground"><Trans k="noItemsInCategory" /></p>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="grid gap-3">
                      {categoryItems.map((item) => (
                        <Card key={item.id}>
                          {editingItem?.id === item.id ? (
                            <CardContent className="p-4">
                              <form onSubmit={updateMenuItem} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label htmlFor={`edit-name-en-${item.id}`}><Trans k="itemNameEnglish" /> *</Label>
                                    <Input
                                      id={`edit-name-en-${item.id}`}
                                      value={editForm.name_en}
                                      onChange={(e) => setEditForm(prev => ({ ...prev, name_en: e.target.value }))}
                                      required
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor={`edit-name-tr-${item.id}`}><Trans k="itemNameTurkish" /></Label>
                                    <Input
                                      id={`edit-name-tr-${item.id}`}
                                      value={editForm.name_tr}
                                      onChange={(e) => setEditForm(prev => ({ ...prev, name_tr: e.target.value }))}
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor={`edit-price-${item.id}`}><Trans k="priceUSD" /> *</Label>
                                    <Input
                                      id={`edit-price-${item.id}`}
                                      type="number"
                                      step="0.01"
                                      value={editForm.price}
                                      onChange={(e) => setEditForm(prev => ({ ...prev, price: e.target.value }))}
                                      required
                                    />
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor={`edit-category-${item.id}`}><Trans k="category" /> *</Label>
                                  <select
                                    id={`edit-category-${item.id}`}
                                    value={editForm.category_id}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, category_id: e.target.value }))}
                                    className="w-full p-2 border border-input rounded-md bg-background"
                                    required
                                  >
                                    {categories.map((category) => {
                                      // Parse category name for display in option
                                      let displayName = category.name;
                                      try {
                                        const parsed = JSON.parse(category.name);
                                        displayName = parsed.en || parsed.tr || category.name;
                                      } catch {
                                        // fallback to string value
                                      }
                                      return (
                                        <option key={category.id} value={category.id}>
                                          {displayName}
                                        </option>
                                      );
                                    })}
                                  </select>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label>Dietary Tags</Label>
                                    {renderTagButtons(DIETARY_OPTIONS, editForm.dietary_tags, (next) =>
                                      setEditForm(prev => ({ ...prev, dietary_tags: next }))
                                    )}
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Allergens</Label>
                                    {renderTagButtons(ALLERGEN_OPTIONS, editForm.allergens, (next) =>
                                      setEditForm(prev => ({ ...prev, allergens: next }))
                                    )}
                                  </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor={`edit-description-en-${item.id}`}><Trans k="descriptionEnglish" /></Label>
                                    <Textarea
                                      id={`edit-description-en-${item.id}`}
                                      value={editForm.description_en}
                                      onChange={(e) => setEditForm(prev => ({ ...prev, description_en: e.target.value }))}
                                      rows={2}
                                    />
                                    <Label htmlFor={`edit-description-tr-${item.id}`}><Trans k="descriptionTurkish" /></Label>
                                    <Textarea
                                      id={`edit-description-tr-${item.id}`}
                                      value={editForm.description_tr}
                                      onChange={(e) => setEditForm(prev => ({ ...prev, description_tr: e.target.value }))}
                                      rows={2}
                                    />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor={`edit-image-${item.id}`}><Trans k="changeImage" /></Label>
                                  {editForm.currentImageUrl && (
                                    <div className="mb-2">
                                      <img
                                        src={editForm.currentImageUrl}
                                        alt="Current image"
                                        className="w-20 h-20 object-cover rounded-md"
                                      />
                                      <p className="text-xs text-muted-foreground mt-1"><Trans k="currentImage" /></p>
                                    </div>
                                  )}
                                  <Input
                                    id={`edit-image-${item.id}`}
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0] || null;
                                      setEditForm(prev => ({ ...prev, image: file }));
                                    }}
                                    className="cursor-pointer"
                                  />
                                  <p className="text-xs text-muted-foreground">
                                    <Trans k="uploadNewImage" />
                                  </p>
                                </div>
                                <div className="flex items-center gap-3">
                                  <Switch
                                    id={`edit-available-${item.id}`}
                                    checked={editForm.is_available}
                                    onCheckedChange={(v: boolean) => setEditForm(prev => ({ ...prev, is_available: v }))}
                                  />
                                  <Label htmlFor={`edit-available-${item.id}`}><Trans k="available" /></Label>
                                </div>
                                <div className="flex gap-2">
                                  <Button type="submit" size="sm">
                                    <Save className="h-4 w-4 mr-2" />
                                    <Trans k="save" />
                                  </Button>
                                  <Button type="button" variant="outline" size="sm" onClick={cancelEditingItem}>
                                    <X className="h-4 w-4 mr-2" />
                                    <Trans k="cancel" />
                                  </Button>
                                </div>
                              </form>
                            </CardContent>
                          ) : (
                            <CardContent className="flex gap-4 p-4">
                              {item.image_url && (
                                <div className="flex-shrink-0">
                                  <img
                                    src={item.image_url}
                                    alt={item.name}
                                    className="w-20 h-20 object-cover rounded-md"
                                  />
                                </div>
                              )}
                              <div className="flex-1 flex justify-between items-start">
                                <div>
                                  <div className="flex items-center gap-2 mb-1">
                                    <h4 className="font-medium"><LangText value={item.name} /></h4>
                                    {!item.is_available && (
                                      <Badge variant="destructive"><Trans k="unavailable" /></Badge>
                                    )}
                                  </div>
                                  {item.description && (
                                    <p className="text-sm text-muted-foreground mb-2">
                                      <LangText value={item.description} />
                                    </p>
                                  )}
                                  {[...normalizeTags(item.dietary_tags), ...normalizeTags(item.allergens)].length > 0 && (
                                    <div className="flex flex-wrap gap-1.5">
                                      {[...normalizeTags(item.dietary_tags), ...normalizeTags(item.allergens)].map((tag) => (
                                        <Badge key={tag} variant="outline" className="text-[11px] font-normal">
                                          {getMenuTagLabel(tag)}
                                        </Badge>
                                      ))}
                                    </div>
                                  )}
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="text-right">
                                    <div className="text-lg font-semibold">{"\u20ba"} {(item.price ?? 0).toFixed(2)}</div>
                                  </div>
                                  <div className="flex gap-1">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => startEditingItem(item)}
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => deleteMenuItem(item)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          )}
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="design" className="space-y-4">
          <MenuDesign 
            cafeId={cafe.id}
            onDesignChange={handleDesignChange}
          />
        </TabsContent>
      </Tabs>

      {/* Category Delete Confirmation Dialog */}
      <AlertDialog open={!!categoryToDelete} onOpenChange={() => setCategoryToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle><Trans k="deleteCategory" /></AlertDialogTitle>
            <AlertDialogDescription>
              <Trans k="deleteCategoryConfirmation" />
              <br />
              <span className="font-medium">
                <LangText value={categoryToDelete?.name || ""} />
              </span>
              <br />
              <br />
              <Trans k="deleteCategoryWarning" />
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              <Trans k="cancel" />
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteCategory}>
              <Trans k="deleteCategory" />
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MenuManager;
