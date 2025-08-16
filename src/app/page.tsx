import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { QrCode, Coffee, Smartphone, Users } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageToggle } from "@/components/LanguageToggle";
import { Trans } from "@/components/Trans";
///import "./index.css";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <QrCode className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold"><Trans k="appTitle" /></span>
            </div>
          <div className="flex items-center gap-2">
            <LanguageToggle />
            <ThemeToggle />
            <Link href="/auth">
              <Button><Trans k="getStarted" /></Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
        <section className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-5xl font-bold mb-6"><Trans k="digitalMenusMadeSimple" /></h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"><Trans k="landingSubtitle" /></p>
        <div className="flex gap-4 justify-center">
            <Link href="/auth">
              <Button size="lg"><Trans k="startFreeTrial" /></Button>
            </Link>
            <Button variant="outline" size="lg"><Trans k="learnMore" /></Button>
        </div>
      </section>

      {/* Features Section */}
        <section className="container mx-auto px-4 py-20">
          <h2 className="text-3xl font-bold text-center mb-12"><Trans k="whyChoose" /></h2>
        <div className="grid gap-8 md:grid-cols-3">
          <Card>
            <CardHeader>
              <QrCode className="h-12 w-12 text-primary mb-4" />
              <CardTitle><Trans k="easyQRGeneration" /></CardTitle>
              <CardDescription><Trans k="easyQRGenerationDesc" /></CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Smartphone className="h-12 w-12 text-primary mb-4" />
              <CardTitle><Trans k="mobileOptimized" /></CardTitle>
              <CardDescription><Trans k="mobileOptimizedDesc" /></CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Users className="h-12 w-12 text-primary mb-4" />
              <CardTitle><Trans k="customerFriendly" /></CardTitle>
              <CardDescription><Trans k="customerFriendlyDesc" /></CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* How it Works */}
      <section className="bg-muted py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12"><Trans k="howItWorks" /></h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="bg-primary text-primary-foreground rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2"><Trans k="step1Title" /></h3>
              <p className="text-muted-foreground"><Trans k="step1Desc" /></p>
            </div>

            <div className="text-center">
              <div className="bg-primary text-primary-foreground rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2"><Trans k="step2Title" /></h3>
              <p className="text-muted-foreground"><Trans k="step2Desc" /></p>
            </div>

            <div className="text-center">
              <div className="bg-primary text-primary-foreground rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2"><Trans k="step3Title" /></h3>
              <p className="text-muted-foreground"><Trans k="step3Desc" /></p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
        <section className="container mx-auto px-4 py-20 text-center">
          <h2 className="text-3xl font-bold mb-6"><Trans k="readyToGoDigital" /></h2>
          <p className="text-xl text-muted-foreground mb-8"><Trans k="joinHundreds" /></p>
        <Link href="/auth">
          <Button size="lg">Get Started Today</Button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted">
        <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">
          <p>&copy; 2024 QR Menu. Making dining digital.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
