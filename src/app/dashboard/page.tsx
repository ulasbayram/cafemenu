'use client'
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from  'next/navigation';
import { User } from "@supabase/supabase-js";
import { QrCode, Plus, Coffee, Menu } from "lucide-react";
import CafeForm from "@/components/CafeForm";
import MenuManager from "@/components/MenuManager";
import { QRCode } from "@/components/QRCode";
import { DashboardDisplayName } from "./DisplayName";

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [cafes, setCafes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCafeForm, setShowCafeForm] = useState(false);
  const [selectedCafe, setSelectedCafe] = useState<any>(null);
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
    if (user?.id) {
      fetchCafes(user.id);
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
          <h1 className="text-2xl font-bold">QR Menu Dashboard</h1>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <DashboardDisplayName emailFallback={user?.email ?? ''} />
            <a className="text-sm underline text-muted-foreground" href="/dashboard/settings">Settings</a>
            <Button variant="outline" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Welcome to your cafe dashboard</h2>
          <p className="text-muted-foreground">
            Create and manage your digital menus with QR codes for easy customer access.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Cafes</CardTitle>
              <Coffee className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{cafes.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">QR Codes Generated</CardTitle>
              <QrCode className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{cafes.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Menu Items</CardTitle>
              <Menu className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {cafes.reduce((total, cafe) => {
                  // This would need a join query in real implementation
                  return total + 0; // Placeholder for now
                }, 0)}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold">Your Cafes</h3>
          <Button onClick={() => setShowCafeForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add New Cafe
          </Button>
        </div>

        {cafes.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Coffee className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No cafes yet</h3>
              <p className="text-muted-foreground text-center mb-4">
                Get started by creating your first cafe and its digital menu.
              </p>
              <Button onClick={() => setShowCafeForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Cafe
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {cafes.map((cafe) => (
              <Card key={cafe.id}>
                <CardHeader>
                  <CardTitle>{cafe.name}</CardTitle>
                  <CardDescription>{cafe.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="mb-3">
                        <QRCode 
                          value={`${typeof window !== 'undefined' ? window.location.origin : ''}/${encodeURIComponent(cafe.name)}`}
                          size={96}
                          className="rounded bg-white p-1 border"
                        />
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <span className="align-middle">{cafe.location}</span>
                      </div>
                    </div>
                    <div className="shrink-0">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleManageMenu(cafe)}
                      >
                        Manage Menu
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      <Dialog open={showCafeForm} onOpenChange={setShowCafeForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Cafe</DialogTitle>
          </DialogHeader>
          <CafeForm 
            onSuccess={handleCafeCreated}
            onCancel={() => setShowCafeForm(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;