import { parseAsBoolean, useQueryState } from "nuqs";

export const useDeleteProjectModal = () => {
  const [isOpen, setIsOpen] = useQueryState(
    "delete-project",
    parseAsBoolean.withDefault(false).withOptions({ clearOnDefault: true })
  );

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  return {
    isOpen,
    open,
    close,
    setIsOpen,
  };
};
