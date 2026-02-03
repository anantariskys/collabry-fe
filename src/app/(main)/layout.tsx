"use client";

import { Sidebar } from "@/components/dashboard/sidebar";
import { Logo } from "@/components/logo";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { PageTransition } from "@/components/ui/page-transition";
import { Menu } from "lucide-react";
import { useState } from "react";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 flex-shrink-0 h-full">
        <Sidebar className="h-full" />
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Mobile Header */}
        <header className="flex h-14 items-center border-b px-4 md:hidden flex-shrink-0">
          <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="mr-2">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-[280px]">
              <Sidebar className="border-none" />
            </SheetContent>
          </Sheet>
          <div className="flex-1 flex justify-center">
            <Logo size="sm" />
          </div>
          <div className="w-9" /> {/* Spacer for centering */}
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 lg:p-8 max-w-7xl mx-auto w-full">
             <PageTransition>{children}</PageTransition>
          </div>
        </main>
      </div>
    </div>
  );
}
