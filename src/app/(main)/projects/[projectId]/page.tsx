"use client";

import { useState, use } from "react";
import { useProject } from "@/hooks/api/use-projects";
import { useTasks } from "@/hooks/api/use-tasks";
import { TaskStatus, Task } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { KanbanBoard } from "@/components/projects/kanban-board";
import { TaskDetailDialog } from "@/components/tasks/task-detail-dialog";
import { ProjectSettingsDialog } from "@/components/projects/project-settings-dialog";

export default function ProjectPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = use(params);
  const { data: project, isLoading: isLoadingProject } = useProject(projectId);
  const { data: tasks, isLoading: isLoadingTasks } = useTasks({ projectId });
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isTaskDetailOpen, setIsTaskDetailOpen] = useState(false);

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsTaskDetailOpen(true);
  };

  if (isLoadingProject) {
    return (
      <div className="space-y-6 px-8">
        <Skeleton className="h-10 w-1/4" />
        <Skeleton className="h-6 w-1/2" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <Skeleton className="h-[500px]" />
          <Skeleton className="h-[500px]" />
          <Skeleton className="h-[500px]" />
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">Project not found</p>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col space-y-6 px-8 py-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
          <p className="text-muted-foreground">
            {project.description || "Project board"}
          </p>
        </div>
        <ProjectSettingsDialog project={project} />
      </div>

      <div className="flex-1 overflow-x-auto pb-4">
        <KanbanBoard 
          projectId={projectId} 
          tasks={tasks || []} 
          isLoading={isLoadingTasks} 
          onTaskClick={handleTaskClick} 
        />
      </div>

      {selectedTask && (
        <TaskDetailDialog
          task={selectedTask}
          open={isTaskDetailOpen}
          onOpenChange={setIsTaskDetailOpen}
        />
      )}
    </div>
  );
}
