import { CalendarDays } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import Link from "next/link";

export default function EssayCard({essays}:{essays:string[]}) {
  return (
    <Card className="rounded-lg border-0 bg-white ring-1 ring-[#dfe4ec]">
      <CardHeader className="rounded-none">
        <CardTitle className="flex items-center gap-2">
          <CalendarDays className="size-5 text-[#c23a32]" />
          Essay queue
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {essays.map((essay) => (
          <Link
            key={essay}
            href="#contact"
            className="block border-l-2 border-[#f4bd42] pl-3 text-sm font-medium leading-6 text-[#3d3834] hover:text-[#c23a32]"
          >
            {essay}
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}