import React from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";

export const ErrorPage = ({ message = "Something went wrong" }) => {
  return (
    <div className="h-screen flex flex-col gap-y-2 items-center justify-center">
      <AlertTriangle className="size-6 text-red-700" />
      <p className="text-sm text-muted-foreground">{message}</p>
      <Button variant="secondary" size="sm" asChild>
        <Link href="/">Go Home</Link>
      </Button>
    </div>
  );
};
