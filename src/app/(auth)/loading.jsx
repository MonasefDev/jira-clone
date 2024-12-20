import { Loader } from "lucide-react";
import React from "react";

const LoadingPage = () => {
  return (
    <div className="h-screen flex flex-col gap-y-2 items-center justify-center">
      <Loader className="animate-spin size-6 text-muted-foreground" />
    </div>
  );
};

export default LoadingPage;
