"use client";
import React from "react";
import Image from "next/image";

import { Button } from "../../components/ui/button";
import { usePathname } from "next/navigation";
import Link from "next/link";

const AuthLayout = ({ children }) => {
  const pathName = usePathname();
  const isSingIn = pathName === "/sign-in";
  return (
    <main className="bg-neutral-100 min-h-screen">
      <div className="mx-auto max-w-screen-2xl p-4">
        <nav className="flex justify-between items-center">
          <Link href="/">
            <Image src="/logo.svg" alt="logo" height={40} width={100} />
          </Link>
          <Button variant="secondary">
            {isSingIn ? (
              <Link href="/sign-up">Sign Up</Link>
            ) : (
              <Link href="/sign-in">Sign In</Link>
            )}
          </Button>
        </nav>
        <div className="pt-4 flex flex-col items-center justify-center md:pt-14">
          {children}
        </div>
      </div>
    </main>
  );
};

{
}
export default AuthLayout;
