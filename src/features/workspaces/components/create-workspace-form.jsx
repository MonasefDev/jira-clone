"use client";
import { useForm } from "react-hook-form";
import { useRef } from "react";

import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";

import { cn } from "@/src/lib/utils";
import { createWorkspaceSchema } from "../schemas";
import { DottedSeparator } from "@/src/components/dotted-separator";
import { useCreateWorkspace } from "../api/use-create-workspace";
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
import { ImageIcon } from "lucide-react";
import Image from "next/image";

export const CreateWorkspaceForm = ({ onCancel }) => {
  const { mutate: createWorkspace, isPending } = useCreateWorkspace();
  const inputRef = useRef(null);

  const form = useForm({
    resolver: zodResolver(createWorkspaceSchema),
    defaultValues: {
      name: "",
      image: "",
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
      image: data.image instanceof File ? data.image : undefined,
    };
    createWorkspace(
      {
        form: finalData,
      },
      {
        onSuccess: () => {
          form.reset();
          // TODO: Redirect to new workspace dashboard
        },
      }
    );
  };

  return (
    <Card className="w-full h-full border-none shadow-none">
      <CardHeader className="flex items-center justify-center p-7">
        <CardTitle className="text-2xl">Create a new Workspace</CardTitle>
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
                        <Avatar className="size-[72px] rounded-full flex items-center justify-center bg-neutral-200">
                          <AvatarFallback>
                            <ImageIcon className="size-[36px] text-neutral-500" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div className="flex flex-col">
                        <p className="text-sm">Workspace Icon</p>
                        <p className="text-xs text-muted-foreground">
                          PNG, JPG, SVG or JPEG, max 1MB
                        </p>
                        <input
                          hidden
                          type="file"
                          ref={inputRef}
                          accept=".png, .jpg, .jpeg, .svg"
                          onChange={handleImageChange}
                          disabled={isPending}
                        />
                        {field.value ? (
                          <Button
                            type="button"
                            disabled={isPending}
                            size="xs"
                            variant="teritary"
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
                            disabled={isPending}
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
                disabled={isPending}
                // className={cn(!onCancel && "invisible")}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="lg"
                variant="primary"
                disabled={isPending}
              >
                Create Workspace
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
