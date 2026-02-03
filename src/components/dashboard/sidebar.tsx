"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  Settings,
  Plus,
  Briefcase,
  ChevronRight,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useWorkspaces } from "@/hooks/api/use-workspaces";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { CreateWorkspaceDialog } from "@/components/workspaces/create-workspace-dialog";

import { UserNav } from "@/components/dashboard/user-nav";
import { Logo } from "@/components/logo";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const { data: workspaces, isLoading } = useWorkspaces();

  return (
    <div className={cn("pb-12 h-full flex flex-col border-r bg-background", className)}>
      <div className="h-14 flex items-center px-6 border-b">
        <Logo />
      </div>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            Overview
          </h2>
          <div className="space-y-1">
            <Button
              variant={pathname === "/dashboard" ? "secondary" : "ghost"}
              className="w-full justify-start font-medium"
              asChild
            >
              <Link href="/dashboard">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </Link>
            </Button>
            <Button
              variant={pathname === "/settings" ? "secondary" : "ghost"}
              className="w-full justify-start font-medium"
              asChild
            >
              <Link href="/settings">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <Separator className="mx-4 w-auto opacity-50" />


      <div className="mt-auto px-4 py-4">
        <UserNav />
      </div>
    </div>
  );
}
