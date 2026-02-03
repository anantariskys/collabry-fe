"use client";

import { use } from "react";
import Link from "next/link";
import { FolderKanban, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProjects } from "@/hooks/api/use-projects";
import { useWorkspace } from "@/hooks/api/use-workspaces";
import { CreateProjectDialog } from "@/components/projects/create-project-dialog";
import { WorkspaceMembers } from "@/components/workspaces/workspace-members";

import { ActivityLogList } from "@/components/activity/activity-log-list";
import { WorkspaceSettings } from "@/components/workspaces/workspace-settings";
import { useMe } from "@/hooks/api/use-users";

export default function WorkspacePage({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const { workspaceId } = use(params);
  const { data: workspace, isLoading: isLoadingWorkspace } =
    useWorkspace(workspaceId);
  const { data: projects, isLoading: isLoadingProjects } =
    useProjects(workspaceId);
  const { data: user } = useMe();

  if (isLoadingWorkspace) {
    return (
      <div className="space-y-6 px-8">
        <Skeleton className="h-10 w-1/4" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!workspace) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">Workspace not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 px-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{workspace.name}</h1>
          <p className="text-muted-foreground">Manage your projects and team.</p>
        </div>
        <CreateProjectDialog workspaceId={workspaceId} />
      </div>

      <Tabs defaultValue="projects" className="space-y-4">
        <TabsList>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="projects" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {isLoadingProjects ? (
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
            ) : projects?.length === 0 ? (
              <div className="col-span-full flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center animate-in fade-in-50">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                  <FolderKanban className="h-5 w-5 text-muted-foreground" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">No projects found</h3>
                <p className="mb-4 mt-2 text-sm text-muted-foreground">
                  Create a project to start tracking tasks.
                </p>
                <CreateProjectDialog workspaceId={workspaceId} />
              </div>
            ) : (
              projects?.map((project) => (
                <Card key={project.id} className="transition-all hover:shadow-md">
                  <CardHeader>
                    <CardTitle>{project.name}</CardTitle>
                    <CardDescription>
                      {project.description || "No description provided."}
                    </CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <Button variant="secondary" className="w-full" asChild>
                      <Link href={`/projects/${project.id}`}>Open Project</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
        <TabsContent value="members">
          <WorkspaceMembers workspaceId={workspaceId} />
        </TabsContent>
        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Activity Log</CardTitle>
              <CardDescription>
                Recent activity in this workspace.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ActivityLogList workspaceId={workspaceId} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="settings">
          {user ? (
            <WorkspaceSettings workspace={workspace} currentUserId={user.id} />
          ) : (
            <div className="flex h-[200px] items-center justify-center">
              <Skeleton className="h-10 w-10 animate-spin rounded-full" />
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
