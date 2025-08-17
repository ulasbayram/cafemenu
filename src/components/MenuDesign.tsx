'use client'

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Palette, Save, RotateCcw, Brush, Type, Layout } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Trans } from "./Trans";

interface MenuDesignProps {
  cafeId: string;
  onDesignChange: (design: MenuDesign) => void;
}

interface MenuDesign {
  background: {
    type: 'color' | 'gradient' | 'image';
    value: string;
  };
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    textMuted: string;
    cardBackground: string;
    cardBorder: string;
  };
  typography: {
    fontFamily: string;
    headingSize: 'small' | 'medium' | 'large';
    bodySize: 'small' | 'medium' | 'large';
  };
  layout: {
    cardStyle: 'modern' | 'classic' | 'minimal';
    spacing: 'compact' | 'comfortable' | 'relaxed';
  };
}

const defaultDesign: MenuDesign = {
  background: {
    type: 'color',
    value: '' // Empty to use theme background
  },
  colors: {
    primary: '#1f2937', // Matches dashboard foreground
    secondary: '#6b7280', // Matches dashboard muted-foreground  
    accent: '#3b82f6', // Matches dashboard primary
    text: '#1f2937', // Matches dashboard foreground
    textMuted: '#6b7280', // Matches dashboard muted-foreground
    cardBackground: '#ffffff', // Matches dashboard card
    cardBorder: '#e5e7eb' // Matches dashboard border
  },
  typography: {
    fontFamily: 'Inter',
    headingSize: 'medium',
    bodySize: 'medium'
  },
  layout: {
    cardStyle: 'modern',
    spacing: 'comfortable'
  }
};

// Dashboard theme default design - matches the application's default theme colors
const dashboardDefaultDesign: MenuDesign = {
  background: {
    type: 'color',
    value: '' // Use theme background
  },
  colors: {
    primary: '#1f2937', // --foreground equivalent
    secondary: '#6b7280', // --muted-foreground equivalent
    accent: '#2563eb', // --primary equivalent  
    text: '#1f2937', // --foreground equivalent
    textMuted: '#6b7280', // --muted-foreground equivalent
    cardBackground: '#ffffff', // --card equivalent
    cardBorder: '#e5e7eb' // --border equivalent
  },
  typography: {
    fontFamily: 'Inter',
    headingSize: 'medium',
    bodySize: 'medium'
  },
  layout: {
    cardStyle: 'modern',
    spacing: 'comfortable'
  }
};

const colorPresets = [
  {
    name: 'Classic',
    colors: {
      primary: '#1f2937',
      secondary: '#6b7280',
      accent: '#3b82f6',
      text: '#1f2937',
      textMuted: '#6b7280',
      cardBackground: '#ffffff',
      cardBorder: '#e5e7eb'
    }
  },
  {
    name: 'Warm',
    colors: {
      primary: '#7c2d12',
      secondary: '#a3a3a3',
      accent: '#ea580c',
      text: '#7c2d12',
      textMuted: '#a3a3a3',
      cardBackground: '#fefdf8',
      cardBorder: '#fed7aa'
    }
  },
  {
    name: 'Nature',
    colors: {
      primary: '#14532d',
      secondary: '#6b7280',
      accent: '#16a34a',
      text: '#14532d',
      textMuted: '#6b7280',
      cardBackground: '#f0fdf4',
      cardBorder: '#bbf7d0'
    }
  },
  {
    name: 'Ocean',
    colors: {
      primary: '#0c4a6e',
      secondary: '#64748b',
      accent: '#0ea5e9',
      text: '#0c4a6e',
      textMuted: '#64748b',
      cardBackground: '#f0f9ff',
      cardBorder: '#bae6fd'
    }
  },
  {
    name: 'Sunset',
    colors: {
      primary: '#7c2d12',
      secondary: '#a3a3a3',
      accent: '#f59e0b',
      text: '#7c2d12',
      textMuted: '#a3a3a3',
      cardBackground: '#fffbeb',
      cardBorder: '#fed7aa'
    }
  },
  {
    name: 'Dark Mode',
    colors: {
      primary: '#f8fafc',
      secondary: '#cbd5e1',
      accent: '#60a5fa',
      text: '#f8fafc',
      textMuted: '#94a3b8',
      cardBackground: '#1e293b',
      cardBorder: '#334155'
    }
  },
  {
    name: 'Dark Purple',
    colors: {
      primary: '#e2e8f0',
      secondary: '#a78bfa',
      accent: '#8b5cf6',
      text: '#e2e8f0',
      textMuted: '#a78bfa',
      cardBackground: '#1e1b2e',
      cardBorder: '#3730a3'
    }
  },
  {
    name: 'Dark Green',
    colors: {
      primary: '#ecfdf5',
      secondary: '#86efac',
      accent: '#22c55e',
      text: '#ecfdf5',
      textMuted: '#86efac',
      cardBackground: '#14532d',
      cardBorder: '#166534'
    }
  }
];

const backgroundPresets = [
  // Default theme
  { name: 'Default', value: '', theme: 'default' },
  
  // Light themes
  { name: 'White', value: '#ffffff', theme: 'light' },
  { name: 'Light Gray', value: '#f9fafb', theme: 'light' },
  { name: 'Cream', value: '#fefdf8', theme: 'light' },
  { name: 'Light Blue', value: '#f0f9ff', theme: 'light' },
  { name: 'Light Green', value: '#f0fdf4', theme: 'light' },
  
  // Dark themes
  { name: 'Dark', value: '#1a1a1a', theme: 'dark' },
  { name: 'Charcoal', value: '#2d3748', theme: 'dark' },
  { name: 'Navy', value: '#1a202c', theme: 'dark' },
  { name: 'Forest', value: '#1a2e1a', theme: 'dark' },
  { name: 'Wine', value: '#2d1b1b', theme: 'dark' },
  
  // Gradient themes
  { name: 'Gradient Blue', value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', theme: 'gradient' },
  { name: 'Gradient Sunset', value: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', theme: 'gradient' },
  { name: 'Gradient Nature', value: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', theme: 'gradient' },
  { name: 'Gradient Dark', value: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)', theme: 'gradient' },
  { name: 'Gradient Purple', value: 'linear-gradient(135deg, #8360c3 0%, #2ebf91 100%)', theme: 'gradient' },
  { name: 'Gradient Night', value: 'linear-gradient(135deg, #0c0c0c 0%, #2d3748 100%)', theme: 'gradient' }
];

export function MenuDesign({ cafeId, onDesignChange }: MenuDesignProps) {
  const [design, setDesign] = useState<MenuDesign>(defaultDesign);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const { toast } = useToast();

  // Helper function to get translated preset names
  const getPresetTranslationKey = (name: string): string => {
    const nameToKey: { [key: string]: string } = {
      'Classic': 'classic',
      'Warm': 'warm',
      'Nature': 'nature',
      'Ocean': 'ocean',
      'Sunset': 'sunset',
      'Dark Mode': 'darkMode',
      'Dark Purple': 'darkPurple',
      'Dark Green': 'darkGreen',
      'White': 'white',
      'Light Gray': 'lightGray',
      'Cream': 'cream',
      'Light Blue': 'lightBlue',
      'Light Green': 'lightGreen',
      'Dark': 'dark',
      'Charcoal': 'charcoal',
      'Navy': 'navy',
      'Forest': 'forest',
      'Wine': 'wine',
      'Gradient Blue': 'gradientBlue',
      'Gradient Sunset': 'gradientSunset',
      'Gradient Nature': 'gradientNature',
      'Gradient Dark': 'gradientDark',
      'Gradient Purple': 'gradientPurple',
      'Gradient Night': 'gradientNight',
      'Default': 'defaultTheme'
    };
    return nameToKey[name] || name.toLowerCase();
  };

  useEffect(() => {
    fetchCurrentDesign();
  }, [cafeId]);

  const fetchCurrentDesign = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('cafes')
        .select('menu_design')
        .eq('id', cafeId)
        .single();

      if (error) throw error;

      if (data?.menu_design) {
        const savedDesign = { ...defaultDesign, ...data.menu_design };
        setDesign(savedDesign);
        onDesignChange(savedDesign);
      }
    } catch (error: any) {
      toast({
        title: "Error", // Keep English for technical messages
        description: "Failed to load design settings", // Can be translated if needed
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateDesign = (updates: Partial<MenuDesign>) => {
    const newDesign = { ...design, ...updates };
    setDesign(newDesign);
    onDesignChange(newDesign);
  };

  const updateColors = (colors: Partial<MenuDesign['colors']>) => {
    updateDesign({ colors: { ...design.colors, ...colors } });
  };

  const saveDesign = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('cafes')
        .update({ menu_design: design })
        .eq('id', cafeId);

      if (error) throw error;

      toast({
        title: "Success", // Keep English for technical messages
        description: "Design settings saved successfully!", // Can be translated if needed
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const resetToDefault = () => {
    setDesign(defaultDesign);
    onDesignChange(defaultDesign);
  };

  const returnToDefaultDesign = async () => {
    setSaving(true);
    try {
      // Set the menu_design to dashboard default design
      const { error } = await supabase
        .from('cafes')
        .update({ menu_design: dashboardDefaultDesign })
        .eq('id', cafeId);

      if (error) throw error;

      // Reset local state to dashboard default
      setDesign(dashboardDefaultDesign);
      onDesignChange(dashboardDefaultDesign);

      toast({
        title: "Success", // Keep English for technical messages
        description: "Design reset to dashboard default successfully!", // Can be translated if needed
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
      setShowResetDialog(false);
    }
  };

  const applyColorPreset = (preset: typeof colorPresets[0]) => {
    updateColors(preset.colors);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div><Trans k="loadingDesignSettings" /></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold"><Trans k="menuDesign" /></h2>
          <p className="text-muted-foreground"><Trans k="customizeMenuAppearance" /></p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={resetToDefault}>
            <RotateCcw className="h-4 w-4 mr-2" />
            <Trans k="reset" />
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setShowResetDialog(true)}
            disabled={saving}
            className="text-orange-600 hover:text-orange-700 border-orange-200 hover:border-orange-300"
          >
            <Trans k="useDashboardTheme" />
          </Button>
          <Button onClick={saveDesign} disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? <Trans k="saving" /> : <Trans k="saveDesign" />}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="colors" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="colors" className="gap-2">
            <Palette className="h-4 w-4" />
            <Trans k="colors" />
          </TabsTrigger>
          <TabsTrigger value="background" className="gap-2">
            <Brush className="h-4 w-4" />
            <Trans k="background" />
          </TabsTrigger>
          <TabsTrigger value="layout" className="gap-2">
            <Layout className="h-4 w-4" />
            <Trans k="layout" />
          </TabsTrigger>
        </TabsList>

        <TabsContent value="colors" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle><Trans k="colorPresets" /></CardTitle>
              <CardDescription><Trans k="quickStartColorCombinations" /></CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium mb-2 block"><Trans k="lightThemes" /></Label>
                  <div className="grid grid-cols-5 gap-3">
                    {colorPresets.filter(preset => !preset.name.toLowerCase().includes('dark')).map((preset) => (
                      <Button
                        key={preset.name}
                        variant="outline"
                        className="h-auto p-3 flex flex-col gap-2"
                        onClick={() => applyColorPreset(preset)}
                      >
                        <div className="flex gap-1">
                          <div 
                            className="w-4 h-4 rounded-full" 
                            style={{ backgroundColor: preset.colors.primary }}
                          />
                          <div 
                            className="w-4 h-4 rounded-full" 
                            style={{ backgroundColor: preset.colors.accent }}
                          />
                          <div 
                            className="w-4 h-4 rounded-full border" 
                            style={{ backgroundColor: preset.colors.cardBackground }}
                          />
                        </div>
                        <span className="text-xs"><Trans k={getPresetTranslationKey(preset.name) as any} /></span>
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm font-medium mb-2 block"><Trans k="darkThemes" /></Label>
                  <div className="grid grid-cols-3 gap-3">
                    {colorPresets.filter(preset => preset.name.toLowerCase().includes('dark')).map((preset) => (
                      <Button
                        key={preset.name}
                        variant="outline"
                        className="h-auto p-3 flex flex-col gap-2"
                        onClick={() => applyColorPreset(preset)}
                      >
                        <div className="flex gap-1">
                          <div 
                            className="w-4 h-4 rounded-full" 
                            style={{ backgroundColor: preset.colors.primary }}
                          />
                          <div 
                            className="w-4 h-4 rounded-full" 
                            style={{ backgroundColor: preset.colors.accent }}
                          />
                          <div 
                            className="w-4 h-4 rounded-full border border-gray-300" 
                            style={{ backgroundColor: preset.colors.cardBackground }}
                          />
                        </div>
                        <span className="text-xs"><Trans k={getPresetTranslationKey(preset.name) as any} /></span>
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle><Trans k="customColors" /></CardTitle>
              <CardDescription><Trans k="fineTuneIndividualColors" /></CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="primary-color"><Trans k="primaryColor" /></Label>
                  <div className="flex gap-2">
                    <Input
                      id="primary-color"
                      type="color"
                      value={design.colors.primary}
                      onChange={(e) => updateColors({ primary: e.target.value })}
                      className="w-16 h-10 p-1 rounded"
                    />
                    <Input
                      value={design.colors.primary}
                      onChange={(e) => updateColors({ primary: e.target.value })}
                      placeholder="#1f2937"
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accent-color"><Trans k="accentColor" /></Label>
                  <div className="flex gap-2">
                    <Input
                      id="accent-color"
                      type="color"
                      value={design.colors.accent}
                      onChange={(e) => updateColors({ accent: e.target.value })}
                      className="w-16 h-10 p-1 rounded"
                    />
                    <Input
                      value={design.colors.accent}
                      onChange={(e) => updateColors({ accent: e.target.value })}
                      placeholder="#3b82f6"
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="text-color"><Trans k="textColor" /></Label>
                  <div className="flex gap-2">
                    <Input
                      id="text-color"
                      type="color"
                      value={design.colors.text}
                      onChange={(e) => updateColors({ text: e.target.value })}
                      className="w-16 h-10 p-1 rounded"
                    />
                    <Input
                      value={design.colors.text}
                      onChange={(e) => updateColors({ text: e.target.value })}
                      placeholder="#1f2937"
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="card-bg-color"><Trans k="cardBackground" /></Label>
                  <div className="flex gap-2">
                    <Input
                      id="card-bg-color"
                      type="color"
                      value={design.colors.cardBackground}
                      onChange={(e) => updateColors({ cardBackground: e.target.value })}
                      className="w-16 h-10 p-1 rounded"
                    />
                    <Input
                      value={design.colors.cardBackground}
                      onChange={(e) => updateColors({ cardBackground: e.target.value })}
                      placeholder="#ffffff"
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="background" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle><Trans k="backgroundStyle" /></CardTitle>
              <CardDescription><Trans k="chooseMenuBackground" /></CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label><Trans k="backgroundType" /></Label>
                <Select 
                  value={design.background.type} 
                  onValueChange={(value: 'color' | 'gradient' | 'image') => 
                    updateDesign({ 
                      background: { ...design.background, type: value }
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="color"><Trans k="solidColor" /></SelectItem>
                    <SelectItem value="gradient"><Trans k="gradient" /></SelectItem>
                    <SelectItem value="image"><Trans k="imageURL" /></SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {design.background.type === 'color' && (
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium"><Trans k="defaultLightBackgrounds" /></Label>
                    <div className="grid grid-cols-6 gap-2 mt-2">
                      {/* Default Option */}
                      <Button
                        variant={design.background.value === '' ? 'default' : 'outline'}
                        className="h-16 p-2 flex flex-col gap-1 bg-gradient-to-br from-blue-50 via-white to-slate-50 text-gray-700 border-2 border-dashed border-gray-300"
                        onClick={() => updateDesign({ 
                          background: { type: 'color', value: '' }
                        })}
                      >
                        <span className="text-xs font-medium"><Trans k="defaultTheme" /></span>
                        <span className="text-[10px] text-gray-500"><Trans k="theme" /></span>
                      </Button>
                      
                      {backgroundPresets.filter(p => p.theme === 'light').map((preset) => (
                        <Button
                          key={preset.name}
                          variant="outline"
                          className="h-16 p-2 flex flex-col gap-1 text-gray-800"
                          style={{ backgroundColor: preset.value }}
                          onClick={() => updateDesign({ 
                            background: { type: 'color', value: preset.value }
                          })}
                        >
                          <span className="text-xs font-medium">{preset.name}</span>
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium"><Trans k="darkBackgrounds" /></Label>
                    <div className="grid grid-cols-5 gap-2 mt-2">
                      {backgroundPresets.filter(p => p.theme === 'dark').map((preset) => (
                        <Button
                          key={preset.name}
                          variant="outline"
                          className="h-16 p-2 flex flex-col gap-1 text-white border-gray-600"
                          style={{ backgroundColor: preset.value }}
                          onClick={() => updateDesign({ 
                            background: { type: 'color', value: preset.value }
                          })}
                        >
                          <span className="text-xs font-medium">{preset.name}</span>
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={design.background.value}
                      onChange={(e) => updateDesign({ 
                        background: { ...design.background, value: e.target.value }
                      })}
                      className="w-16 h-10 p-1 rounded"
                    />
                    <Input
                      value={design.background.value}
                      onChange={(e) => updateDesign({ 
                        background: { ...design.background, value: e.target.value }
                      })}
                      placeholder="#ffffff"
                      className="flex-1"
                    />
                  </div>
                </div>
              )}

              {design.background.type === 'gradient' && (
                <div className="space-y-3">
                  <Label><Trans k="gradientPresets" /></Label>
                  <div className="grid grid-cols-3 gap-2">
                    {/* Default Option */}
                    <Button
                      variant={design.background.value === '' ? 'default' : 'outline'}
                      className="h-16 p-2 flex flex-col gap-1 bg-gradient-to-br from-blue-50 via-white to-slate-50 text-gray-700 border-2 border-dashed border-gray-300"
                      onClick={() => updateDesign({ 
                        background: { type: 'gradient', value: '' }
                      })}
                    >
                      <span className="text-xs font-medium">Default</span>
                      <span className="text-[10px] text-gray-500">Theme</span>
                    </Button>
                    
                    {backgroundPresets.filter(p => p.theme === 'gradient').map((preset) => (
                      <Button
                        key={preset.name}
                        variant="outline"
                        className="h-16 p-2 flex flex-col gap-1"
                        style={{ background: preset.value }}
                        onClick={() => updateDesign({ 
                          background: { type: 'gradient', value: preset.value }
                        })}
                      >
                        <span className="text-xs font-medium text-white drop-shadow-md">{preset.name}</span>
                      </Button>
                    ))}
                  </div>
                  <div>
                    <Label><Trans k="customGradientCSS" /></Label>
                    <Input
                      value={design.background.value}
                      onChange={(e) => updateDesign({ 
                        background: { ...design.background, value: e.target.value }
                      })}
                      placeholder="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                    />
                  </div>
                </div>
              )}

              {design.background.type === 'image' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label><Trans k="imageBackground" /></Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateDesign({ 
                        background: { type: 'image', value: '' }
                      })}
                      className="text-xs"
                    >
                      <Trans k="useDefaultTheme" />
                    </Button>
                  </div>
                  <Input
                    value={design.background.value.replace('url(', '').replace(')', '')}
                    onChange={(e) => updateDesign({ 
                      background: { ...design.background, value: e.target.value ? `url(${e.target.value})` : '' }
                    })}
                    placeholder="https://example.com/background.jpg"
                  />
                                      <p className="text-xs text-muted-foreground">
                      <Trans k="imageBackgroundHelp" />
                    </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="layout" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle><Trans k="typography" /></CardTitle>
              <CardDescription><Trans k="adjustTextSizeFont" /></CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label><Trans k="headingSize" /></Label>
                  <Select 
                    value={design.typography.headingSize} 
                    onValueChange={(value: 'small' | 'medium' | 'large') => 
                      updateDesign({ 
                        typography: { ...design.typography, headingSize: value }
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small"><Trans k="small" /></SelectItem>
                      <SelectItem value="medium"><Trans k="medium" /></SelectItem>
                      <SelectItem value="large"><Trans k="large" /></SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label><Trans k="bodyTextSize" /></Label>
                  <Select 
                    value={design.typography.bodySize} 
                    onValueChange={(value: 'small' | 'medium' | 'large') => 
                      updateDesign({ 
                        typography: { ...design.typography, bodySize: value }
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small"><Trans k="small" /></SelectItem>
                      <SelectItem value="medium"><Trans k="medium" /></SelectItem>
                      <SelectItem value="large"><Trans k="large" /></SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle><Trans k="cardStyleSpacing" /></CardTitle>
              <CardDescription><Trans k="controlLayoutSpacing" /></CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label><Trans k="cardStyle" /></Label>
                  <Select 
                    value={design.layout.cardStyle} 
                    onValueChange={(value: 'modern' | 'classic' | 'minimal') => 
                      updateDesign({ 
                        layout: { ...design.layout, cardStyle: value }
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="modern"><Trans k="modern" /></SelectItem>
                      <SelectItem value="classic"><Trans k="classic" /></SelectItem>
                      <SelectItem value="minimal"><Trans k="minimal" /></SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label><Trans k="spacing" /></Label>
                  <Select 
                    value={design.layout.spacing} 
                    onValueChange={(value: 'compact' | 'comfortable' | 'relaxed') => 
                      updateDesign({ 
                        layout: { ...design.layout, spacing: value }
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="compact"><Trans k="compact" /></SelectItem>
                      <SelectItem value="comfortable"><Trans k="comfortable" /></SelectItem>
                      <SelectItem value="relaxed"><Trans k="relaxed" /></SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <AlertDialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle><Trans k="returnToDefaultDesign" /></AlertDialogTitle>
            <AlertDialogDescription>
              <Trans k="confirmDefaultDesign" />
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel><Trans k="cancel" /></AlertDialogCancel>
            <AlertDialogAction 
              onClick={returnToDefaultDesign}
              className="bg-orange-600 text-white hover:bg-orange-700"
            >
              <Trans k="useDashboardTheme" />
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
