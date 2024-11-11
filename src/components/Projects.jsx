"use client";

import { useParams, usePathname } from "next/navigation";
import { RiAddCircleFill } from "react-icons/ri";
import Link from "next/link";

import { useGetProjects } from "@/features/projects/api/use-get-projects";
import { ProjectAvatar } from "@/features/projects/components/ProjectAvatar";
import { cn } from "@/lib/utils";
import { useCreateProjectModal } from "@/features/projects/hooks/use-create-project-modal";
import { Loader } from "lucide-react";

const Projects = () => {
  const { workspaceId } = useParams();
  const { data: projects, isLoading } = useGetProjects({
    workspaceId,
  });
  const pathname = usePathname();
  const { open } = useCreateProjectModal();

  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-neutral-500 uppercase">
          Projects
        </p>
        <RiAddCircleFill
          onClick={open}
          className="size-5 text-neutral-500 cursor-pointer hover:opacity-75 transition"
        />
      </div>
      {isLoading ? (
        <div className="w-full py-4 flex justify-center items-center relative">
          <Loader className="animate-spin size-6 text-muted-foreground" />
        </div>
      ) : (
        projects?.map((project) => {
          const href = `/workspaces/${workspaceId}/projects/${project.$id}`;
          const isActive = pathname === href;

          return (
            <Link href={href} key={project.$id}>
              <div
                className={cn(
                  "flex items-center gap-2.5 p-2.5 rounded-md font-medium hover:opacity-75 transition cursor-pointer text-neutral-500",
                  isActive &&
                    "bg-white shadow-sm hover:opacity-100 text-primary"
                )}
              >
                <ProjectAvatar image={project.imageUrl} name={project.name} />
                <span className="truncate text-sm transition">
                  {project.name}
                </span>
              </div>
            </Link>
          );
        })
      )}
    </div>
  );
};

export default Projects;
