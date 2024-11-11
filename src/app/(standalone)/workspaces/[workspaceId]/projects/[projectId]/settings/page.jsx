import { redirect } from "next/navigation";

import { getCurrentUser } from "@/features/auth/queries";
import { getProject } from "@/features/projects/queries";
import { EditProjectForm } from "@/features/projects/components/EditProjectForm";

const ProjectIdSettingsPage = async ({ params }) => {
  const user = await getCurrentUser();

  const initialValues = await getProject({
    projectId: params.projectId,
  });

  if (!user) redirect("/sign-in");

  if (!initialValues) throw new Error("Project not found");
  return (
    <div className="w-full lg:max-w-2xl">
      <EditProjectForm initialValues={initialValues} />
    </div>
  );
};

export default ProjectIdSettingsPage;
