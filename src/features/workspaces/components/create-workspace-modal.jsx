"use client";
import { ResponsiveModal } from "@/src/components/responsive-modal";
import { CreateWorkspaceForm } from "./create-workspace-form";
import { useCreateWorkspaceModal } from "../hooks/use-create-workspace-modal";

export const CreateWorkspaceModal = () => {
  const { isOpen, close, setIsOpen } = useCreateWorkspaceModal();
  return (
    <ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
      <CreateWorkspaceForm onCancel={close} />
    </ResponsiveModal>
  );
};