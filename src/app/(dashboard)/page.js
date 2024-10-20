import { redirect } from "next/navigation";

import { CreateWorkspaceForm } from "@/src/features/workspaces/components/create-workspace-form";
import { getCurrentUser } from "../../lib/actions";

export default async function Home() {
  const user = await getCurrentUser();

  if (!user) return redirect("/sign-in");

  return (
    <div>
      <CreateWorkspaceForm />
    </div>
  );
}
