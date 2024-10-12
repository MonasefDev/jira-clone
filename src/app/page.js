import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <div className="flex flex-col  gap-5 w-full items-center justify-center pt-4">
        <Button className="w-[400px]">
          <Link href="/sign-in">Sign In</Link>
        </Button>
        <Button className="w-[400px]">
          <Link href="/sign-up">Sign Up</Link>
        </Button>
      </div>
    </div>
  );
}
