'use client'

import { ReactNode } from "react";
import Image from "next/image";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CurrencySelector, Price } from "../app/[cafename]/currency";
import { LanguageToggle } from "./LanguageToggle";
import { LangText } from "./LangText";
import { ThemeToggle } from "./ThemeToggle";
import CategoryNav from "../app/[cafename]/CategoryNav";

interface Cafe {
  id: string;
  name: string;
  description: string | null;
  location: string | null;
  website: string | null;
  menu_design?: any;
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

interface StyledMenuPageProps {
  cafe: Cafe;
  categories: CategoryWithItems[];
}

export default function StyledMenuPage({ cafe, categories }: StyledMenuPageProps) {
  const menuDesign = cafe.menu_design || {};

  // Generate CSS styles from custom design
  const getCustomStyles = () => {
    const styles: React.CSSProperties = {};
    
    // Only apply custom background if explicitly set
    if (menuDesign.background?.value) {
      if (menuDesign.background.type === 'color') {
        styles.backgroundColor = menuDesign.background.value;
      } else if (menuDesign.background.type === 'gradient') {
        styles.background = menuDesign.background.value;
        // Clear backgroundColor when using gradient
        styles.backgroundColor = 'transparent';
      } else if (menuDesign.background.type === 'image') {
        styles.backgroundImage = menuDesign.background.value;
        styles.backgroundSize = 'cover';
        styles.backgroundPosition = 'center';
        styles.backgroundRepeat = 'no-repeat';
        // Set a fallback background color
        styles.backgroundColor = '#f5f5f5';
      }
      
      // Only override theme styles when custom background is applied
      styles.backgroundAttachment = 'initial';
      styles.backgroundBlendMode = 'initial';
    }
    // If no custom background, return empty styles to let theme handle it
    
    return styles;
  };

  // Check if colors are dashboard defaults (should use theme instead of custom)
  const isDashboardDefault = (color: string | undefined, defaultColor: string) => {
    return color === defaultColor || color === '#1f2937' || color === '#6b7280' || color === '#2563eb' || color === '#ffffff' || color === '#e5e7eb';
  };

  const getTextStyles = () => {
    if (menuDesign?.colors?.text && !isDashboardDefault(menuDesign.colors.text, '#1f2937')) {
      return {
        color: menuDesign.colors.text
      };
    }
    // Return empty object to let CSS variables handle theme colors
    return {};
  };

  const getCardStyles = () => {
    const shouldUseCustomBackground = menuDesign?.colors?.cardBackground && !isDashboardDefault(menuDesign.colors.cardBackground, '#ffffff');
    const shouldUseCustomBorder = menuDesign?.colors?.cardBorder && !isDashboardDefault(menuDesign.colors.cardBorder, '#e5e7eb');
    
    if (shouldUseCustomBackground || shouldUseCustomBorder) {
      return {
        backgroundColor: shouldUseCustomBackground ? menuDesign.colors.cardBackground : undefined,
        borderColor: shouldUseCustomBorder ? menuDesign.colors.cardBorder : undefined
      };
    }
    // Return empty object to let CSS variables handle theme colors
    return {};
  };

  const getHeadingSize = () => {
    if (!menuDesign?.typography?.headingSize) return 'text-2xl';
    
    const sizeMap = {
      small: 'text-xl',
      medium: 'text-2xl', 
      large: 'text-3xl'
    };
    
    return sizeMap[menuDesign.typography.headingSize] || 'text-2xl';
  };

  const getBodySize = () => {
    if (!menuDesign?.typography?.bodySize) return 'text-sm';
    
    const sizeMap = {
      small: 'text-xs',
      medium: 'text-sm',
      large: 'text-base'
    };
    
    return sizeMap[menuDesign.typography.bodySize] || 'text-sm';
  };

  const getSpacingClass = () => {
    if (!menuDesign?.layout?.spacing) return 'space-y-8';
    
    const spacingMap = {
      compact: 'space-y-4',
      comfortable: 'space-y-8',
      relaxed: 'space-y-12'
    };
    
    return spacingMap[menuDesign.layout.spacing] || 'space-y-8';
  };

  return (
    <div className={`min-h-screen ${!menuDesign.background?.value ? 'bg-background' : ''}`} style={getCustomStyles()}>
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <header className="mb-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight" style={getTextStyles()}>{cafe.name}</h1>
              {cafe.description && (
                <p 
                  className={`mt-2 max-w-3xl ${!menuDesign?.colors?.textMuted || isDashboardDefault(menuDesign.colors.textMuted, '#6b7280') ? 'text-muted-foreground' : ''}`}
                  style={menuDesign?.colors?.textMuted && !isDashboardDefault(menuDesign.colors.textMuted, '#6b7280') ? { color: menuDesign.colors.textMuted } : {}}
                >
                  {cafe.description}
                </p>
              )}
              <div 
                className={`mt-4 flex gap-3 items-center text-sm ${!menuDesign?.colors?.textMuted || isDashboardDefault(menuDesign.colors.textMuted, '#6b7280') ? 'text-muted-foreground' : ''}`}
                style={menuDesign?.colors?.textMuted && !isDashboardDefault(menuDesign.colors.textMuted, '#6b7280') ? { color: menuDesign.colors.textMuted } : {}}
              >
                {cafe.location && <span>{cafe.location}</span>}
                {cafe.website && (
                  <a
                    href={cafe.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`underline decoration-dotted underline-offset-4 ${!menuDesign?.colors?.accent || isDashboardDefault(menuDesign.colors.accent, '#2563eb') ? 'text-primary hover:text-primary/80' : ''}`}
                    style={menuDesign?.colors?.accent && !isDashboardDefault(menuDesign.colors.accent, '#2563eb') ? { color: menuDesign.colors.accent } : {}}
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

        <CategoryNav categories={categories.map(c => {
          // Parse category name for navigation
          let displayName = c.name;
          try {
            const parsed = JSON.parse(c.name);
            // Get current language preference or fallback to English
            const currentLang = localStorage.getItem('app_language') || 'en';
            displayName = parsed[currentLang] || parsed.en || parsed.tr || c.name;
          } catch {
            // fallback to string value
          }
          return { id: c.id, name: displayName };
        })} />

        {categories.length === 0 ? (
          <Card style={getCardStyles()}>
            <CardContent 
              className={`py-10 text-center ${!menuDesign?.colors?.textMuted || isDashboardDefault(menuDesign.colors.textMuted, '#6b7280') ? 'text-muted-foreground' : ''}`}
              style={menuDesign?.colors?.textMuted && !isDashboardDefault(menuDesign.colors.textMuted, '#6b7280') ? { color: menuDesign.colors.textMuted } : {}}
            >
              Menu is not available yet.
            </CardContent>
          </Card>
        ) : (
          <div className={getSpacingClass()}>
            {categories.map((category) => (
              <section key={category.id} id={`cat-${category.id}`} className="scroll-mt-24">
                <div className="flex items-baseline justify-between mb-4">
                  <h2 className={`${getHeadingSize()} font-bold`} style={getTextStyles()}><LangText value={category.name} /></h2>
                  {category.description && (
                    <span 
                      className={`${getBodySize()} ${!menuDesign?.colors?.textMuted || isDashboardDefault(menuDesign.colors.textMuted, '#6b7280') ? 'text-muted-foreground' : ''}`}
                      style={menuDesign?.colors?.textMuted && !isDashboardDefault(menuDesign.colors.textMuted, '#6b7280') ? { color: menuDesign.colors.textMuted } : {}}
                    >
                      <LangText value={category.description} />
                    </span>
                  )}
                </div>
                {category.menu_items.length === 0 ? (
                  <Card style={getCardStyles()}>
                    <CardContent 
                      className={`py-8 text-center ${!menuDesign?.colors?.textMuted || isDashboardDefault(menuDesign.colors.textMuted, '#6b7280') ? 'text-muted-foreground' : ''}`}
                      style={menuDesign?.colors?.textMuted && !isDashboardDefault(menuDesign.colors.textMuted, '#6b7280') ? { color: menuDesign.colors.textMuted } : {}}
                    >
                      No items in this category yet.
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {category.menu_items.map((item) => (
                      <Card key={item.id} className="overflow-hidden" style={getCardStyles()}>
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
                            <span 
                              className={!menuDesign?.colors?.textMuted || isDashboardDefault(menuDesign.colors.textMuted, '#6b7280') ? 'text-muted-foreground' : ''}
                              style={menuDesign?.colors?.textMuted && !isDashboardDefault(menuDesign.colors.textMuted, '#6b7280') ? { color: menuDesign.colors.textMuted } : {}}
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
                                className={!menuDesign?.colors?.accent || isDashboardDefault(menuDesign.colors.accent, '#2563eb') ? 'text-primary' : ''}
                                style={menuDesign?.colors?.accent && !isDashboardDefault(menuDesign.colors.accent, '#2563eb') ? { color: menuDesign.colors.accent } : {}}
                              >
                                <Price valueUsd={item.price} />
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                        {item.description && (
                          <CardContent className="pt-0">
                            <p 
                              className={`${getBodySize()} ${!menuDesign?.colors?.textMuted || isDashboardDefault(menuDesign.colors.textMuted, '#6b7280') ? 'text-muted-foreground' : ''}`}
                              style={menuDesign?.colors?.textMuted && !isDashboardDefault(menuDesign.colors.textMuted, '#6b7280') ? { color: menuDesign.colors.textMuted } : {}}
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
}
