"use client";
import { ResponsiveModal } from "../../../components/responsive-modal";
import { useCreateProjectModal } from "../hooks/use-create-project-modal";
import { CreateProjectForm } from "./CreateProjectForm";

export const CreateProjectModal = () => {
  const { isOpen, close, setIsOpen } = useCreateProjectModal();
  return (
    <ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
      <CreateProjectForm onCancel={close} />
    </ResponsiveModal>
  );
};
