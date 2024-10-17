import { redirect } from "next/navigation";

import { UserButton } from "../../features/auth/components/user-button";
import { getCurrentUser } from "../../lib/actions";

export default async function Home() {
  const user = await getCurrentUser();

  if (!user) return redirect("/sign-in");

  return (
    <div>
      <UserButton />
    </div>
  );
}
