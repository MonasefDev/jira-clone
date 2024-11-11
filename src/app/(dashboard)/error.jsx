"use client";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";
import React from "react";

const ErrorPage = ({ error }) => {
  console.log(error);
  return (
    <div className="h-screen flex flex-col gap-y-2 items-center justify-center">
      <AlertTriangle className="size-6 text-red-700" />
      <p className="text-sm text-muted-foreground">
        {error?.message ? error.message : "Something went wrong!"}
      </p>
      <Button variant="secondary" size="sm" asChild>
        <Link href="/">Go Home</Link>
      </Button>
    </div>
  );
};

export default ErrorPage;
