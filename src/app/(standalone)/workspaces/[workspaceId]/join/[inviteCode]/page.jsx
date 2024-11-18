import { redirect } from "next/navigation";

import { JoinWorkspaceForm } from "../../../../../../features/workspaces/components/join-workspace-form";
import { getWorkSpaceInfo } from "../../../../../../features/workspaces/queries";

const WorkspaceIdJoinPage = async ({ params }) => {
  const { data: initialValues } = await getWorkSpaceInfo({
    workspaceId: params.workspaceId,
  });
  if (!initialValues) redirect("/");

  return (
    <div className="w-full lg:max-w-xl">
      workspaces
      <JoinWorkspaceForm intialValues={initialValues} />
    </div>
  );
};

export default WorkspaceIdJoinPage;
