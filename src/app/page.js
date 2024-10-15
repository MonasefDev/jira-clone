import { Button } from "@/src/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <div className="flex flex-col  gap-5 w-full items-center justify-center pt-4">
        <Link href="/sign-in">
          <Button className="w-[400px]">Sign In</Button>
        </Link>
        <Link href="/sign-up">
          <Button className="w-[400px]">Sign Up</Button>
        </Link>
      </div>
    </div>
  );
}
