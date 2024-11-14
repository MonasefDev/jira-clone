"use client";
import { useRef } from "react";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";

import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../components/ui/form";
import { Input } from "../../../components/ui/input";

import { ArrowLeftIcon, CopyIcon, ImageIcon } from "lucide-react";
import Image from "next/image";
import { redirect, useRouter } from "next/navigation";
import { DottedSeparator } from "../../../components/dotted-separator";
import { cn } from "../../../lib/utils";
import { useUpdateWorkspace } from "../api/use-update-workspace";
import { useResetInviteCode } from "../api/use-reset-invite-code";
import { updateWorkspaceSchema } from "../schemas";
import { useConfirm } from "../../../hooks/useConfirm";
import { useDeleteWorkspace } from "../api/use-delete-workspace";
import toast from "react-hot-toast";

export const EditWorkspaceForm = ({ onCancel, initialValues }) => {
  const { mutate: updateWorkspace, isPending: isUpdating } =
    useUpdateWorkspace();
  const { mutate: deleteWorkspace, isPending: isDeleting } =
    useDeleteWorkspace();
  const { mutate: resetInviteCode, isPending: isResettingInviteCode } =
    useResetInviteCode();

  const router = useRouter();
  const inputRef = useRef(null);

  const form = useForm({
    resolver: zodResolver(updateWorkspaceSchema),
    defaultValues: {
      ...initialValues,
      image: initialValues?.imageUrl ?? "",
    },
  });

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      form.setValue("image", file);
    }
  };

  const onSubmit = (data) => {
    const finalData = {
      ...data,
      image: data.image instanceof File ? data.image : initialValues.imageUrl,
    };
    updateWorkspace(
      {
        form: finalData,
        param: { workspaceId: initialValues.$id },
      },
      {
        onSuccess: () => {
          form.reset();
          router.push(`/workspaces/${initialValues.$id}`);
        },
      }
    );
  };

  const handleResetinviteCode = async () => {
    const ok = await confirmReset();
    if (!ok) return;
    resetInviteCode({
      param: { workspaceId: initialValues.$id },
    });
  };

  const handleDelete = async () => {
    const ok = await confirmDelete();
    if (!ok) return;
    deleteWorkspace(
      {
        param: { workspaceId: initialValues.$id },
      },
      {
        onSuccess: () => {
          router.push("/");
        },
      }
    );
  };

  const fullInviteLink =
    typeof window !== "undefined"
      ? `${window.location.origin}/workspaces/${initialValues.$id}/join/${initialValues.inviteCode}`
      : "";

  const handleCopyInviteLink = () => {
    navigator.clipboard.writeText(fullInviteLink).then(() => {
      toast.success("Invite link copied to clipboard");
    });
  };

  const [DeleteDialog, confirmDelete] = useConfirm(
    "Delete Workspace",
    "Are you sure you want to delete this workspace?",
    "destructive"
  );

  const [ResetDialog, confirmReset] = useConfirm(
    "Reset invite code",
    "Are you sure you want to reset the invite code?",
    "destructive"
  );

  return (
    <div className="flex flex-col gap-y-4">
      <DeleteDialog />
      <ResetDialog />
      <Card className="w-full h-full border-none shadow-none">
        <CardHeader className="flex flex-row items-center gap-x-4 p-7 space-y-0">
          <Button
            size="sm"
            variant="secondary"
            onClick={
              onCancel
                ? onCancel
                : () => router.push(`/workspaces/${initialValues.$id}`)
            }
          >
            <ArrowLeftIcon className="size-4 mr-2" />
            <span>Back</span>
          </Button>
          <CardTitle className="text-2xl">{initialValues.name}</CardTitle>
        </CardHeader>
        <div className="px-7">
          <DottedSeparator />
        </div>
        <CardContent className="p-7">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Workspace name</FormLabel>
                      <FormControl>
                        <Input placeholder="Workspace name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <div className="flex flex-col gap-y-2">
                      <div className="flex items-center gap-x-5">
                        {field.value ? (
                          <div className="size-[72px] relative rounded-md overflow-hidden">
                            <Image
                              alt="Workspace image"
                              fill
                              className="object-cover "
                              src={
                                field.value instanceof File
                                  ? URL.createObjectURL(field.value)
                                  : field.value
                              }
                            />
                          </div>
                        ) : (
                          <Avatar className="size-[72px]">
                            <AvatarFallback>
                              <ImageIcon className="size-[36px] text-neutral-500" />
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div className="flex flex-col">
                          <p className="text-sm font-semibold">
                            Workspace Icon
                          </p>
                          <p className="text-xs text-muted-foreground">
                            PNG, JPG, SVG or JPEG, max 1MB
                          </p>
                          <input
                            hidden
                            type="file"
                            ref={inputRef}
                            accept=".png, .jpg, .jpeg, .svg"
                            onChange={handleImageChange}
                            disabled={isUpdating}
                          />
                          {field.value ? (
                            <Button
                              type="button"
                              disabled={isUpdating}
                              size="xs"
                              variant="destructive"
                              className="w-fit mt-2"
                              onClick={() => {
                                field.onChange(null);
                                if (inputRef.current) {
                                  inputRef.current.value = "";
                                }
                              }}
                            >
                              Remove Image
                            </Button>
                          ) : (
                            <Button
                              type="button"
                              disabled={isUpdating}
                              size="xs"
                              variant="teritary"
                              className="w-fit mt-2"
                              onClick={() => inputRef.current?.click()}
                            >
                              Upload Image
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                />
              </div>
              <DottedSeparator className="py-7" />
              <div className="flex justify-between items-center">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={onCancel}
                  size="lg"
                  disabled={isUpdating}
                  className={cn(!onCancel && "invisible")}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="lg"
                  variant="primary"
                  disabled={isUpdating}
                >
                  Update Workspace
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card className="w-full h-full border-none shadow-none">
        <CardContent className="p-7">
          <div className="flex flex-col">
            <h3 className="font-bold">Invite Members</h3>
            <p className="text-sm text-muted-foreground">
              Use the invite link to add members to your workspace..
            </p>
            <div className="mt-4">
              <div className="flex items-center gap-x-2">
                <Input disabled value={fullInviteLink} />
                <Button
                  onClick={handleCopyInviteLink}
                  variant="secondary"
                  className="size-12"
                >
                  <CopyIcon className="size-5" />
                </Button>
              </div>
            </div>

            <DottedSeparator className="py-7" />

            <Button
              className="mt-6 w-fit ml-auto"
              size="sm"
              variant="destructive"
              type="button"
              disabled={isUpdating || isResettingInviteCode}
              onClick={handleResetinviteCode}
            >
              Reset invite Link
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="w-full h-full border-none shadow-none">
        <CardContent className="p-7">
          <div className="flex flex-col">
            <h3 className="font-bold">Danger Zone</h3>
            <p className="text-sm text-muted-foreground">
              Deleting a workspace is a irreversible and will remove all
              associated data.
            </p>

            <DottedSeparator className="py-7" />

            <Button
              className="mt-6 w-fit ml-auto"
              size="sm"
              variant="destructive"
              type="button"
              disabled={isUpdating || isDeleting}
              onClick={handleDelete}
            >
              Delete Workspace
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
