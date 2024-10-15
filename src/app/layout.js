import { cn } from "@/src/lib/utils";
import { Inter } from "next/font/google";
import { QueryProvider } from "../components/tanstack-provider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Jira Clone",
  description: "Jira clone using nextjs and tailwindcss",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={cn(inter.className, "min-h-screen antialiased")}>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
