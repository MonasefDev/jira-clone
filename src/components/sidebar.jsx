import Image from "next/image";
import Link from "next/link";
import React from "react";
import { DottedSeparator } from "./dotted-separator";
import { Navigation } from "./navigation";
import { WorkspaceSwitcher } from "./workspace-switcher";
import Projects from "./Projects";

const Sidebar = () => {
  return (
    <aside className="h-full bg-neutral-100 p-4 w-full">
      <div className="w-full flex items-center justify-center">
        <Link href="/">
          <Image src="/logo.svg" alt="logo" width={120} height={40} />
        </Link>
      </div>
      <DottedSeparator className="my-4" />
      <WorkspaceSwitcher />
      <DottedSeparator className="my-4" />
      <Navigation />
      <DottedSeparator className="my-4" />
      <Projects />
    </aside>
  );
};

export default Sidebar;
