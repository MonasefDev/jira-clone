"use client";
import { ErrorPage } from "@/components/ErrorPage";
import { LoaderPage } from "@/components/LoaderPage";
import { useGetProject } from "@/features/projects/api/use-get-project";
import { EditProjectForm } from "@/features/projects/components/EditProjectForm";
import { useParams } from "next/navigation";

const ProjectIdSettingsPage = () => {
  const { projectId } = useParams();
  const { data: initialValues, isPending: isLoadingProject } = useGetProject({
    projectId,
  });

  if (isLoadingProject) {
    return <LoaderPage />;
  }

  if (!initialValues) {
    return <ErrorPage message="Project not found" />;
  }

  return (
    <div className="w-full lg:max-w-2xl">
      <EditProjectForm initialValues={initialValues} />
    </div>
  );
};

export default ProjectIdSettingsPage;
