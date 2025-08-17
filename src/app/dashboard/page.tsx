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
import { QrCode, Plus, Coffee, Menu, Settings, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import CafeForm from "@/components/CafeForm";
import MenuManager from "@/components/MenuManager";
import { QRCode } from "@/components/QRCode";
import { DashboardDisplayName } from "./DisplayName";
import { LanguageToggle } from "@/components/LanguageToggle";
import { Trans } from "@/components/Trans";

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [cafes, setCafes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCafeForm, setShowCafeForm] = useState(false);
  const [editingCafe, setEditingCafe] = useState<any>(null);
  const [selectedCafe, setSelectedCafe] = useState<any>(null);
  const [cafeToDelete, setCafeToDelete] = useState<any>(null);
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
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold"><Trans k="dashboardTitle" /></h1>
          <div className="flex items-center gap-4">
            <LanguageToggle />
            <ThemeToggle />
            <DashboardDisplayName emailFallback={user?.email ?? ''} />
            <Link href="/dashboard/settings">
              <Button variant="outline" size="sm" className="gap-2">
                <Settings className="h-4 w-4" />
                <Trans k="settings" />
              </Button>
            </Link>
            <Button variant="outline" onClick={handleSignOut}>
              <Trans k="signOut" />
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
                        value={`${typeof window !== 'undefined' ? window.location.origin : ''}/${encodeURIComponent(cafe.name)}`}
                        size={96}
                        className="rounded bg-white p-1 border"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-muted-foreground">
                        <div className="flex items-center gap-1 mb-1">
                          <span className="font-medium"><Trans k="location" /></span>
                        </div>
                        <span className="break-words">{cafe.location || <Trans k="notSpecified" />}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-auto">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleManageMenu(cafe)}
                      className="flex-1"
                    >
                      <Menu className="h-4 w-4 mr-1" />
                      <Trans k="manageMenu" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEditCafe(cafe)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDeleteCafe(cafe)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
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

      <AlertDialog open={!!cafeToDelete} onOpenChange={() => setCafeToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle><Trans k="deleteCafe" /></AlertDialogTitle>
            <AlertDialogDescription>
              <Trans k="deleteConfirmation" /> "{cafeToDelete?.name}"? <Trans k="deleteWarning" />
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
    </div>
  );
};

export default Dashboard;