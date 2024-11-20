import { redirect } from "next/navigation";

import { getWorkSpaces } from "../../features/workspaces/queries";

export default async function Home() {
  const { data: workspaces } = await getWorkSpaces();

  if (workspaces?.length === 0) {
    redirect("/workspaces/create");
  } else {
    redirect(`/workspaces/${workspaces?.[0].$id}`);
  }
}
