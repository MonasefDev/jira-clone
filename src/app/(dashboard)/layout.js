import Sidebar from "@/src/components/sidebar";
import React from "react";

const DashboardLayout = ({ children }) => {
  return (
    <div className="min-h-screen">
      <div className="flex w-full h-full">
        <div className="fixed bg-slate-600 top-0 left-0 lg:w-[264px] hidden lg:block h-full overflow-auto">
          <Sidebar />
        </div>
        <div className="lg:pl-[264px]">
          <div className="mx-auto max-w-screen-2xl h-full">
            <main className="h-full py-8 px-6 flex flex-col">{children}</main>
          </div>
        </div>
      </div>
    </div>
  );
};

// Simple Navbar Component

export default DashboardLayout;
