import { redirect } from "next/navigation";

import { getCurrentUser } from "../../../../../../features/auth/queries";
import { getWorkSpaceInfo } from "../../../../../../features/workspaces/queries";
import { JoinWorkspaceForm } from "../../../../../../features/workspaces/components/join-workspace-form";

const WorkspaceIdJoinPage = async ({ params }) => {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

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
