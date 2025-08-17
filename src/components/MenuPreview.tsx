'use client'

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Eye, Smartphone, Monitor } from "lucide-react";
import { LangText } from "./LangText";
import { LanguageToggle } from "./LanguageToggle";
import { ThemeToggle } from "./ThemeToggle";
import Image from "next/image";

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
}

interface MenuPreviewProps {
  cafe: Cafe;
  categories: Category[];
  menuItems: MenuItem[];
  customDesign?: any;
}

export function MenuPreview({ cafe, categories, menuItems, customDesign }: MenuPreviewProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'mobile' | 'desktop'>('desktop');
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>('light');

  // Detect current theme from document
  useEffect(() => {
    const updateTheme = () => {
      const isDark = document.documentElement.classList.contains('dark');
      setCurrentTheme(isDark ? 'dark' : 'light');
    };

    // Initial theme detection
    updateTheme();

    // Listen for theme changes
    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  // Close the preview when categories or items change to force refresh
  useEffect(() => {
    if (isOpen) {
      // Small delay to allow state updates to complete
      const timer = setTimeout(() => {
        // Force refresh by briefly closing and reopening
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [categories.length, menuItems.length, isOpen]);

  // Prepare categories with their items, similar to the public page
  const preparedCategories = categories
    .map((category) => ({
      ...category,
      menu_items: menuItems
        .filter(item => item.category_id === category.id)
        .sort((a, b) => {
          const ao = a.sort_order ?? Number.MAX_SAFE_INTEGER;
          const bo = b.sort_order ?? Number.MAX_SAFE_INTEGER;
          if (ao !== bo) return ao - bo;
          // Compare by parsed name for better sorting
          const getDisplayName = (name: string) => {
            try {
              const parsed = JSON.parse(name);
              return parsed.en || parsed.tr || name;
            } catch {
              return name;
            }
          };
          return getDisplayName(a.name).localeCompare(getDisplayName(b.name));
        }),
    }))
    .filter(category => category.menu_items.length > 0) // Only show categories with items
    .sort((a, b) => {
      const ao = a.sort_order ?? Number.MAX_SAFE_INTEGER;
      const bo = b.sort_order ?? Number.MAX_SAFE_INTEGER;
      if (ao !== bo) return ao - bo;
      // Compare by parsed name for better sorting
      const getDisplayName = (name: string) => {
        try {
          const parsed = JSON.parse(name);
          return parsed.en || parsed.tr || name;
        } catch {
          return name;
        }
      };
      return getDisplayName(a.name).localeCompare(getDisplayName(b.name));
    });

  const formatPrice = (price: number | null) => {
    if (price === null) return "N/A";
    return `$${price.toFixed(2)}`;
  };

  // Generate CSS styles from custom design
  const getCustomStyles = () => {
    const styles: React.CSSProperties = {};
    
    // Only apply custom background if explicitly set
    if (customDesign?.background?.value) {
      if (customDesign.background.type === 'color') {
        styles.backgroundColor = customDesign.background.value;
      } else if (customDesign.background.type === 'gradient') {
        styles.background = customDesign.background.value;
        // Clear backgroundColor when using gradient
        styles.backgroundColor = 'transparent';
      } else if (customDesign.background.type === 'image') {
        styles.backgroundImage = customDesign.background.value;
        styles.backgroundSize = 'cover';
        styles.backgroundPosition = 'center';
        styles.backgroundRepeat = 'no-repeat';
        // Set a fallback background color
        styles.backgroundColor = '#f5f5f5';
      }
    }
    // If no custom background, return empty styles to let theme handle it
    
    return styles;
  };

  // Check if colors are dashboard defaults (should use theme instead of custom)
  const isDashboardDefault = (color: string | undefined, defaultColor: string) => {
    return color === defaultColor || color === '#1f2937' || color === '#6b7280' || color === '#2563eb' || color === '#ffffff' || color === '#e5e7eb';
  };

  const getTextStyles = () => {
    if (customDesign?.colors?.text && !isDashboardDefault(customDesign.colors.text, '#1f2937')) {
      return {
        color: customDesign.colors.text
      };
    }
    // Return empty object to let CSS variables handle theme colors
    return {};
  };

  const getCardStyles = () => {
    const shouldUseCustomBackground = customDesign?.colors?.cardBackground && !isDashboardDefault(customDesign.colors.cardBackground, '#ffffff');
    const shouldUseCustomBorder = customDesign?.colors?.cardBorder && !isDashboardDefault(customDesign.colors.cardBorder, '#e5e7eb');
    
    if (shouldUseCustomBackground || shouldUseCustomBorder) {
      return {
        backgroundColor: shouldUseCustomBackground ? customDesign.colors.cardBackground : undefined,
        borderColor: shouldUseCustomBorder ? customDesign.colors.cardBorder : undefined
      };
    }
    // Return empty object to let CSS variables handle theme colors
    return {};
  };

  const getPriceStyles = () => {
    if (customDesign?.colors?.accent && !isDashboardDefault(customDesign.colors.accent, '#2563eb')) {
      return {
        color: customDesign.colors.accent
      };
    }
    // Return empty object to let CSS variables handle theme colors
    return {};
  };

  const getHeadingSize = () => {
    if (!customDesign?.typography?.headingSize) return 'text-2xl';
    
    const sizeMap = {
      small: 'text-xl',
      medium: 'text-2xl', 
      large: 'text-3xl'
    };
    
    return sizeMap[customDesign.typography.headingSize] || 'text-2xl';
  };

  const getBodySize = () => {
    if (!customDesign?.typography?.bodySize) return 'text-sm';
    
    const sizeMap = {
      small: 'text-xs',
      medium: 'text-sm',
      large: 'text-base'
    };
    
    return sizeMap[customDesign.typography.bodySize] || 'text-sm';
  };

  const getSpacingClass = () => {
    if (!customDesign?.layout?.spacing) return 'space-y-8';
    
    const spacingMap = {
      compact: 'space-y-4',
      comfortable: 'space-y-8',
      relaxed: 'space-y-12'
    };
    
    return spacingMap[customDesign.layout.spacing] || 'space-y-8';
  };

  const PreviewContent = () => (
    <div 
      className={`min-h-screen ${currentTheme} ${!customDesign?.background?.value ? 'bg-background' : ''} ${viewMode === 'mobile' ? 'max-w-sm mx-auto border-x' : ''}`}
      style={{
        ...getCustomStyles(),
        // Ensure we override any inherited background styles
        backgroundAttachment: 'initial',
        backgroundBlendMode: 'initial'
      }}
    >
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <header className="mb-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight" style={getTextStyles()}>{cafe.name}</h1>
              {cafe.description && (
                <p 
                  className={`mt-2 max-w-3xl ${!customDesign?.colors?.textMuted || isDashboardDefault(customDesign.colors.textMuted, '#6b7280') ? 'text-muted-foreground' : ''}`}
                  style={customDesign?.colors?.textMuted && !isDashboardDefault(customDesign.colors.textMuted, '#6b7280') ? { color: customDesign.colors.textMuted } : {}}
                >
                  {cafe.description}
                </p>
              )}
              <div 
                className={`mt-4 flex gap-3 items-center text-sm ${!customDesign?.colors?.textMuted || isDashboardDefault(customDesign.colors.textMuted, '#6b7280') ? 'text-muted-foreground' : ''}`}
                style={customDesign?.colors?.textMuted && !isDashboardDefault(customDesign.colors.textMuted, '#6b7280') ? { color: customDesign.colors.textMuted } : {}}
              >
                {cafe.location && <span>{cafe.location}</span>}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <LanguageToggle />
              <ThemeToggle />
            </div>
          </div>
        </header>

        {/* Category Navigation */}
        {preparedCategories.length > 1 && (
          <nav className="mb-6 overflow-x-auto">
            <div className="flex gap-2 pb-2">
              {preparedCategories.map((category) => (
                <Button
                  key={category.id}
                  variant="outline"
                  size="sm"
                  className="whitespace-nowrap"
                  onClick={() => {
                    const element = document.getElementById(`preview-cat-${category.id}`);
                    element?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  <LangText value={category.name} />
                </Button>
              ))}
            </div>
          </nav>
        )}

        {preparedCategories.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center text-muted-foreground">
              <div className="space-y-2">
                <p className="text-lg font-medium">Menu Preview</p>
                <p>Add categories and menu items to see your menu preview here.</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className={getSpacingClass()}>
            {preparedCategories.map((category) => (
              <section key={category.id} id={`preview-cat-${category.id}`} className="scroll-mt-24">
                <div className="flex items-baseline justify-between mb-4">
                  <h2 className={`${getHeadingSize()} font-bold`} style={getTextStyles()}><LangText value={category.name} /></h2>
                  {category.description && (
                    <span 
                      className={`${getBodySize()} ${!customDesign?.colors?.textMuted || isDashboardDefault(customDesign.colors.textMuted, '#6b7280') ? 'text-muted-foreground' : ''}`}
                      style={customDesign?.colors?.textMuted && !isDashboardDefault(customDesign.colors.textMuted, '#6b7280') ? { color: customDesign.colors.textMuted } : {}}
                    >
                      <LangText value={category.description} />
                    </span>
                  )}
                </div>
                {category.menu_items.length === 0 ? (
                  <Card>
                    <CardContent className="py-8 text-center text-muted-foreground">
                      No items in this category yet.
                    </CardContent>
                  </Card>
                ) : (
                  <div className={`grid gap-6 ${viewMode === 'mobile' ? 'grid-cols-1' : 'sm:grid-cols-2 lg:grid-cols-3'}`}>
                    {category.menu_items.map((item) => (
                      <Card key={item.id} className="overflow-hidden" style={getCardStyles()}>
                        {item.image_url ? (
                          <div className="relative w-full h-40">
                            <Image
                              src={item.image_url}
                              alt={item.name}
                              fill
                              sizes={viewMode === 'mobile' ? "100vw" : "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
                              className="object-cover"
                              unoptimized
                            />
                          </div>
                        ) : (
                          <div className="w-full h-40 bg-muted flex items-center justify-center">
                            <span 
                              className={!customDesign?.colors?.textMuted || isDashboardDefault(customDesign.colors.textMuted, '#6b7280') ? 'text-muted-foreground' : ''}
                              style={customDesign?.colors?.textMuted && !isDashboardDefault(customDesign.colors.textMuted, '#6b7280') ? { color: customDesign.colors.textMuted } : {}}
                            >
                              No image
                            </span>
                          </div>
                        )}
                        <CardHeader className="pb-2">
                          <div className="flex items-start justify-between gap-4">
                            <CardTitle className="text-lg leading-tight" style={getTextStyles()}>
                              <LangText value={item.name} />
                            </CardTitle>
                            <div className="flex items-center gap-2">
                              {item.is_available === false && (
                                <Badge variant="secondary">Unavailable</Badge>
                              )}
                              <div 
                                className={`text-lg font-semibold ${!customDesign?.colors?.accent || isDashboardDefault(customDesign.colors.accent, '#2563eb') ? 'text-primary' : ''}`}
                                style={getPriceStyles()}
                              >
                                {formatPrice(item.price)}
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                        {item.description && (
                          <CardContent className="pt-0">
                            <p 
                              className={`${getBodySize()} ${!customDesign?.colors?.textMuted || isDashboardDefault(customDesign.colors.textMuted, '#6b7280') ? 'text-muted-foreground' : ''}`}
                              style={customDesign?.colors?.textMuted && !isDashboardDefault(customDesign.colors.textMuted, '#6b7280') ? { color: customDesign.colors.textMuted } : {}}
                            >
                              <LangText value={item.description} />
                            </p>
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

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Eye className="h-4 w-4" />
          Preview Menu
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-7xl h-[90vh] p-0">
        <DialogHeader className="px-6 py-4 border-b pr-16">
          <div className="flex items-center justify-between">
            <DialogTitle>Menu Preview - {cafe.name}</DialogTitle>
            <div className="flex items-center mr-8">
              <div className="flex items-center gap-1 border rounded-md">
                <Button
                  variant={viewMode === 'desktop' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('desktop')}
                  className="h-8 px-3"
                >
                  <Monitor className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'mobile' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('mobile')}
                  className="h-8 px-3"
                >
                  <Smartphone className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </DialogHeader>
        
        <div className="flex-1 overflow-auto" style={{ backgroundColor: 'transparent' }}>
          <div className={`${viewMode === 'mobile' ? 'p-4' : 'p-6'}`}>
            <PreviewContent />
          </div>
        </div>
        
        <div className="px-6 py-3 border-t bg-muted/50 text-center">
          <p className="text-sm text-muted-foreground">
            This is how your menu will appear to customers • 
            <span className="ml-1">
              {viewMode === 'mobile' ? 'Mobile' : 'Desktop'} view
            </span>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
