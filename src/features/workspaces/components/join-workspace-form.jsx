"use client";

import { DottedSeparator } from "../../../components/dotted-separator";
import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import Link from "next/link";
import { useJoinWorkspace } from "../api/use-join-workspace";
// import { useInviteCode } from "../hooks/use-invite-code";
import { useParams, usePathname, useRouter } from "next/navigation";

export const JoinWorkspaceForm = ({ intialValues }) => {
  const router = useRouter();
  const { workspaceId, inviteCode } = useParams();
  // const inviteCode = useInviteCode();
  const { mutate: joinWorkspace, isPending } = useJoinWorkspace();

  const onSubmit = () => {
    joinWorkspace(
      {
        param: { workspaceId },
        json: { inviteCode },
      },
      {
        onSuccess: (data) => {
          router.push(`/workspaces/${data?.$id}`);
        },
      }
    );
  };

  return (
    <Card>
      <CardHeader className="p-7">
        <CardTitle className="text-xl font-bold">Join Workspace</CardTitle>
        <CardDescription>
          You&apos;ve been invited to join <strong>{intialValues?.name}</strong>{" "}
          workspace.
        </CardDescription>
      </CardHeader>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7">
        <p className="text-sm text-muted-foreground">
          Click the button below to join the workspace.
        </p>
        <div className="flex flex-col lg:flex-row gap-y-2 lg:gap-x-2 pt-2 items-center justify-between">
          <Button
            variant="secondary"
            type="button"
            asChild
            size="lg"
            className="w-full lg:w-fit"
            disabled={isPending}
          >
            <Link href="/">Cancel</Link>
          </Button>
          <Button
            type="button"
            size="lg"
            className="w-full lg:w-fit"
            onClick={onSubmit}
            disabled={isPending}
          >
            Join Workspace
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
