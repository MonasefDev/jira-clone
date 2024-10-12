import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/src/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Jira Clone",
  description: "Jira clone using nextjs and tailwindcss",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={cn(inter.className, "min-h-screen antialiased")}>
        {children}
      </body>
    </html>
  );
}
