import Image from "next/image";
import { cn } from "@/lib/utils";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export const ProjectAvatar = ({
  image,
  name,
  className,
  fallbackClassName,
}) => {
  if (image) {
    return (
      <Avatar className={cn("bg-blue-700 size-5 rounded-md", className)}>
        <AvatarFallback className="font-medium bg-blue-700 text-white uppercase rounded-md">
          <div
            className={cn(
              "size-5 relative rounded-md overflow-hidden",
              className
            )}
          >
            <Image
              src={image ?? "/default-avatar.png"}
              alt={name}
              fill
              className="object-cover"
            />
          </div>
        </AvatarFallback>
      </Avatar>
    );
  }

  return (
    <Avatar className={cn("bg-blue-600 size-5 rounded-md", className)}>
      <AvatarFallback
        className={cn(
          "font-medium bg-blue-700 text-sm text-white uppercase rounded-md",
          fallbackClassName
        )}
      >
        {name?.charAt(0).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
};
