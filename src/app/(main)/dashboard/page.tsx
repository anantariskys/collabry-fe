"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useWorkspaces } from "@/hooks/api/use-workspaces";
import { CreateWorkspaceDialog } from "@/components/workspaces/create-workspace-dialog";

export default function DashboardPage() {
  const { data: session } = useSession();
  const { data: workspaces, isLoading, isError } = useWorkspaces();

  return (
    <div className="space-y-6 px-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {session?.user?.name || "User"}!
          </p>
        </div>
        <CreateWorkspaceDialog />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="pb-4">
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-4 w-3/4 mt-2" />
              </CardHeader>
              <CardFooter>
                <Skeleton className="h-9 w-24" />
              </CardFooter>
            </Card>
          ))
        ) : isError ? (
          <div className="col-span-full text-center text-red-500">
            Failed to load workspaces.
          </div>
        ) : workspaces?.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center animate-in fade-in-50">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-muted">
              <Plus className="h-5 w-5 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">No workspaces found</h3>
            <p className="mb-4 mt-2 text-sm text-muted-foreground">
              You haven't created any workspaces yet. Start by creating one.
            </p>
            <CreateWorkspaceDialog />
          </div>
        ) : (
          workspaces?.map((workspace) => (
            <Card key={workspace.id} className="transition-all hover:border-foreground/50 group">
              <CardHeader>
                <CardTitle className="group-hover:text-primary transition-colors">{workspace.name}</CardTitle>
                <CardDescription>
                  Created on {new Date(workspace.createdAt).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors" asChild>
                  <Link href={`/workspaces/${workspace.id}`}>View Workspace</Link>
                </Button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
