import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";

export default function Home() {
  return (
    <div>
      <div className="flex  gap-1 w-full items-center justify-center pt-4">
        <Button disabled>Default</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="muted">Muted</Button>
        <Button variant="tertirary">Tertiary</Button>
      </div>
      <Input />
    </div>
  );
}
