import { redirect } from "next/navigation";

import { getCurrentUser } from "../../features/auth/actions";
import { getWorkSpaces } from "@/src/features/workspaces/actions";

export default async function Home() {
  const user = await getCurrentUser();
  const { data: workspaces } = await getWorkSpaces();

  // console.log(workspaces);

  if (!user) redirect("/sign-in");

  if (workspaces?.length === 0) {
    redirect("/workspaces/create");
  } else {
    redirect(`/workspaces/${workspaces[0].$id}`);
  }
}
