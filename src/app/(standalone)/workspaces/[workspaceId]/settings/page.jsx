import { redirect } from "next/navigation";
import { EditWorkspaceForm } from "../../../../../features/workspaces/components/edit-workspace-form";
import { getWorkSpaceById } from "../../../../../features/workspaces/queries";

const WorkspaceIdSettingPage = async ({ params }) => {
  const { workspaceId } = params;

  const { data: workspace } = await getWorkSpaceById({ workspaceId });

  if (!workspace) redirect(`workspaces/${workspaceId}`);

  return (
    <div className="w-full lg:max-w-3xl">
      <EditWorkspaceForm initialValues={workspace} />
    </div>
  );
};

export default WorkspaceIdSettingPage;
