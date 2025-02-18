"use client";

import { PencilIcon } from "lucide-react";
import Link from "next/link";

import { Analytics } from "@/components/analytics";
import { PageError } from "@/components/page-error";
import { PageLoader } from "@/components/page-loader";
import { Button } from "@/components/ui/button";

import { useGetProjects } from "@/features/projects/api/use-get-projects";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { useProjectId } from "@/features/projects/hooks/use-project-id";
import { TaskViewSwitcher } from "@/features/tasks/components/task-view-switcher";
import { useGetProjectAnalytics } from "@/features/projects/api/use-get-projects-analytics";

export const ProjectIdClient = () => {
  const projectId = useProjectId();
  const workspaceId = projectId; 
  const { data: project, isLoading: isLoadingProject } = useGetProjects({ workspaceId });
  const { data: analytics, isLoading: isLoadingAnalytics } =
    useGetProjectAnalytics({ projectId });

  const isLoading = isLoadingProject || isLoadingAnalytics;

  if (isLoading) {
    return <PageLoader />;
  }

  if (!project) {
    return <PageError message="Project not found." />;
  }

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-2">
          <ProjectAvatar
            name={project.documents[0].name}
            image={project.documents[0].imageUrl}
            className="size-8"
          />
          <p className="text-lg font-semibold">{project.documents[0].name}</p>
        </div>
        <div>
          <Button variant="secondary" size="sm" asChild>
            <Link
              href={`/workspaces/${project.documents[0].workspaceId}/projects/${project.documents[0].$id}/settings`}
            >
              <PencilIcon className="size-4 mr-2" />
              Edit Project
            </Link>
          </Button>
        </div>
      </div>
      {analytics && <Analytics data={analytics} />}
      <TaskViewSwitcher hideProjectFilter={true} />
    </div>
  );
};