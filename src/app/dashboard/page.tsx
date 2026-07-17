'use client'
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from  'next/navigation';
import { User } from "@supabase/supabase-js";
import { QrCode, Plus, Coffee, Menu, Settings, Edit, Trash2, Bot, Eye, BarChart3, CalendarDays } from "lucide-react";
import Link from "next/link";
import CafeForm from "@/components/CafeForm";
import MenuManager from "@/components/MenuManager";
import MenuMigrationModal from "@/components/MenuMigrationModal";
import { QRCode } from "@/components/QRCode";
import { DashboardDisplayName } from "./DisplayName";
import { LanguageToggle } from "@/components/LanguageToggle";
import { Trans } from "@/components/Trans";
import { slugify } from "@/lib/slug";

type MenuView = {
  cafe_id: string;
  viewed_at: string;
  referrer: string | null;
  user_agent: string | null;
};

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [cafes, setCafes] = useState<any[]>([]);
  const [viewStats, setViewStats] = useState<{ total: number; byCafe: Record<string, number> }>({ total: 0, byCafe: {} });
  const [menuViews, setMenuViews] = useState<MenuView[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCafeForm, setShowCafeForm] = useState(false);
  const [editingCafe, setEditingCafe] = useState<any>(null);
  const [selectedCafe, setSelectedCafe] = useState<any>(null);
  const [cafeToDelete, setCafeToDelete] = useState<any>(null);
  const [analyticsCafe, setAnalyticsCafe] = useState<any>(null);
  const [showMigrationModal, setShowMigrationModal] = useState(false);
  const [migrationCafe, setMigrationCafe] = useState<any>(null);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        router.push("/auth");
      } else {
        setUser(session.user);
        // Refresh cafes list when auth state changes to signed in
        fetchCafes(session.user.id);
      }
    });

    checkUser();

    return () => subscription.unsubscribe();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.push("/auth");
      setLoading(false);
      return;
    }
    setUser(session.user);
    await fetchCafes(session.user.id);
    setLoading(false);
  };

  const fetchCafes = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("cafes")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setCafes(data || []);

      const cafeIds = (data || []).map((cafe) => cafe.id);
      if (cafeIds.length === 0) {
        setViewStats({ total: 0, byCafe: {} });
        setMenuViews([]);
        return;
      }

      const { data: views, error: viewsError } = await supabase
        .from("menu_views")
        .select("cafe_id, viewed_at, referrer, user_agent")
        .in("cafe_id", cafeIds)
        .order("viewed_at", { ascending: false });

      if (!viewsError) {
        const byCafe = (views || []).reduce<Record<string, number>>((acc, view) => {
          acc[view.cafe_id] = (acc[view.cafe_id] || 0) + 1;
          return acc;
        }, {});
        setViewStats({ total: views?.length || 0, byCafe });
        setMenuViews((views || []) as MenuView[]);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const handleCafeCreated = () => {
    setShowCafeForm(false);
    setEditingCafe(null);
    if (user?.id) {
      fetchCafes(user.id);
    }
  };

  const handleEditCafe = (cafe: any) => {
    setEditingCafe(cafe);
    setShowCafeForm(true);
  };

  const handleDeleteCafe = (cafe: any) => {
    setCafeToDelete(cafe);
  };

  const confirmDeleteCafe = async () => {
    if (!cafeToDelete) return;

    try {
      const { error } = await supabase
        .from("cafes")
        .delete()
        .eq("id", cafeToDelete.id);

      if (error) throw error;

      toast({
        title: "Success", // Keep English for technical messages
        description: "Cafe deleted successfully!", // Can be translated if needed
      });

      if (user?.id) {
        fetchCafes(user.id);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setCafeToDelete(null);
    }
  };

  const handleManageMenu = (cafe: any) => {
    setSelectedCafe(cafe);
  };

  const handleBackFromMenu = () => {
    setSelectedCafe(null);
  };

  const handleMigrateMenu = (cafe: any) => {
    setMigrationCafe(cafe);
    setShowMigrationModal(true);
  };

  const handleMigrationComplete = () => {
    // Refresh cafes data to show updated menu
    if (user?.id) {
      fetchCafes(user.id);
    }
    toast({
      title: "Migration Complete",
      description: "Your physical menu has been successfully converted to digital format!",
    });
  };

  const getCafeSlug = (cafe: any) => cafe.slug || slugify(cafe.name);

  const getCafeUrl = (cafe: any) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    return `${origin}/${getCafeSlug(cafe)}`;
  };

  const getCafeViews = (cafeId: string) => menuViews.filter((view) => view.cafe_id === cafeId);

  const getAnalyticsSummary = (cafeId: string) => {
    const views = getCafeViews(cafeId);
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(now.getDate() - 7);

    const today = views.filter((view) => new Date(view.viewed_at) >= startOfToday).length;
    const last7Days = views.filter((view) => new Date(view.viewed_at) >= sevenDaysAgo).length;
    const lastView = views[0]?.viewed_at ? new Date(views[0].viewed_at) : null;

    return { total: views.length, today, last7Days, lastView, recent: views.slice(0, 8) };
  };

  const formatDateTime = (value: Date | string) =>
    new Intl.DateTimeFormat("tr-TR", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(typeof value === "string" ? new Date(value) : value);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  if (selectedCafe) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <MenuManager cafe={selectedCafe} onBack={handleBackFromMenu} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4 flex justify-between items-center">
          <h1 className="text-xl sm:text-2xl font-bold truncate pr-2"><Trans k="dashboardTitle" /></h1>
          <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-4">
            <LanguageToggle />
            <ThemeToggle />
            <div className="hidden md:block">
              <DashboardDisplayName emailFallback={user?.email ?? ''} />
            </div>
            <Link href="/dashboard/settings" className="hidden sm:block">
              <Button variant="outline" size="sm" className="gap-1 lg:gap-2">
                <Settings className="h-4 w-4" />
                <span className="hidden lg:inline"><Trans k="settings" /></span>
              </Button>
            </Link>
            <Button variant="outline" size="sm" onClick={handleSignOut} className="text-sm">
              <span className="hidden sm:inline"><Trans k="signOut" /></span>
              <span className="sm:hidden">Exit</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2"><Trans k="welcomeToDashboard" /></h2>
          <p className="text-muted-foreground">
            <Trans k="dashboardSubtitle" />
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium"><Trans k="totalCafes" /></CardTitle>
              <Coffee className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{cafes.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium"><Trans k="qrCodesGenerated" /></CardTitle>
              <QrCode className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{cafes.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Menu Views</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{viewStats.total}</div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold"><Trans k="yourCafes" /></h3>
          <Button onClick={() => setShowCafeForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            <Trans k="addNewCafe" />
          </Button>
        </div>

        {cafes.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Coffee className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2"><Trans k="noCafesYet" /></h3>
              <p className="text-muted-foreground text-center mb-4">
                <Trans k="getStartedText" />
              </p>
              <Button onClick={() => setShowCafeForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                <Trans k="createFirstCafe" />
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {cafes.map((cafe) => (
              <Card key={cafe.id} className="flex flex-col">
                <CardHeader className="pb-3">
                  <CardTitle className="line-clamp-1">{cafe.name}</CardTitle>
                  <CardDescription className="line-clamp-2 min-h-[2.5rem]">
                    {cafe.description || <Trans k="noDescription" />}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="shrink-0">
                      <QRCode 
                        value={getCafeUrl(cafe)}
                        size={96}
                        className="rounded bg-white p-1 border"
                        downloadName={`${getCafeSlug(cafe)}-qr`}
                        label={`${cafe.name} menu`}
                        showActions
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-muted-foreground">
                        <div className="flex items-center gap-1 mb-1">
                          <span className="font-medium"><Trans k="location" /></span>
                        </div>
                        <span className="break-words">{cafe.location || <Trans k="notSpecified" />}</span>
                      </div>
                      <a
                        href={getCafeUrl(cafe)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 block truncate text-sm text-primary underline underline-offset-4"
                      >
                        /{getCafeSlug(cafe)}
                      </a>
                      <p className="mt-2 text-xs text-muted-foreground">
                        {viewStats.byCafe[cafe.id] || 0} views
                      </p>
                    </div>
                  </div>
                  <div className="mt-auto space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleManageMenu(cafe)}
                      >
                        <Menu className="h-4 w-4 mr-1" />
                        <Trans k="manageMenu" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setAnalyticsCafe(cafe)}
                      >
                        <BarChart3 className="h-4 w-4 mr-1" />
                        Veri
                      </Button>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleMigrateMenu(cafe)}
                        className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white border-none hover:from-blue-600 hover:to-purple-700"
                        title="Migrate Physical Menu with AI"
                      >
                        <Bot className="h-4 w-4 mr-1" />
                        AI
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEditCafe(cafe)}
                        className="flex-1"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDeleteCafe(cafe)}
                        className="flex-1 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      <Dialog open={showCafeForm} onOpenChange={(open) => {
        setShowCafeForm(open);
        if (!open) setEditingCafe(null);
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingCafe ? <Trans k="editCafe" /> : <Trans k="createNewCafe" />}</DialogTitle>
          </DialogHeader>
          <CafeForm 
            cafe={editingCafe}
            onSuccess={handleCafeCreated}
            onCancel={() => {
              setShowCafeForm(false);
              setEditingCafe(null);
            }}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={!!analyticsCafe} onOpenChange={(open) => {
        if (!open) setAnalyticsCafe(null);
      }}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              {analyticsCafe?.name} Analytics
            </DialogTitle>
          </DialogHeader>
          {analyticsCafe && (() => {
            const summary = getAnalyticsSummary(analyticsCafe.id);
            return (
              <div className="space-y-5">
                <div className="grid gap-3 sm:grid-cols-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Total</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{summary.total}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Today</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{summary.today}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Last 7 Days</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{summary.last7Days}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Last View</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm font-medium">
                        {summary.lastView ? formatDateTime(summary.lastView) : "-"}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="rounded-lg border p-4">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div>
                      <h3 className="font-semibold">Recent Views</h3>
                      <p className="text-sm text-muted-foreground">
                        {getCafeUrl(analyticsCafe)}
                      </p>
                    </div>
                    <CalendarDays className="h-5 w-5 text-muted-foreground" />
                  </div>
                  {summary.recent.length === 0 ? (
                    <div className="rounded-md bg-muted/40 p-4 text-sm text-muted-foreground">
                      Bu cafe icin henuz analytics kaydi yok.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {summary.recent.map((view, index) => (
                        <div
                          key={`${view.viewed_at}-${index}`}
                          className="flex items-center justify-between gap-4 rounded-md border px-3 py-2 text-sm"
                        >
                          <span>{formatDateTime(view.viewed_at)}</span>
                          <span className="max-w-[240px] truncate text-muted-foreground">
                            {view.referrer || "Direct / QR scan"}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })()}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!cafeToDelete} onOpenChange={() => setCafeToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle><Trans k="deleteCafe" /></AlertDialogTitle>
            <AlertDialogDescription>
              <Trans k="deleteConfirmation" /> &quot;{cafeToDelete?.name}&quot;? <Trans k="deleteWarning" />
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel><Trans k="cancel" /></AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDeleteCafe}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              <Trans k="deleteCafe" />
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Menu Migration Modal */}
      {migrationCafe && (
        <MenuMigrationModal
          isOpen={showMigrationModal}
          onClose={() => {
            setShowMigrationModal(false);
            setMigrationCafe(null);
          }}
          cafe={migrationCafe}
          onMigrationComplete={handleMigrationComplete}
        />
      )}
    </div>
  );
};

export default Dashboard;
