import { redirect } from "next/navigation";
import { getCurrentUser } from "../../../../../features/auth/queries";
import { EditWorkspaceForm } from "../../../../../features/workspaces/components/edit-workspace-form";
import { useGetWorkspaces } from "../../../../../features/workspaces/api/use-get-workspaces";
import { getWorkSpaceById } from "../../../../../features/workspaces/queries";

const WorkspaceIdSettingPage = async ({ params }) => {
  const { workspaceId } = params;
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  const { data: workspace } = await getWorkSpaceById({ workspaceId });

  if (!workspace) redirect(`workspaces/${workspaceId}`);

  return (
    <div className="w-full lg:max-w-3xl">
      <EditWorkspaceForm initialValues={workspace} />
    </div>
  );
};

export default WorkspaceIdSettingPage;
