import { Clapperboard } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";

export default function CriticCard() {
  return (
    <Card className="rounded-lg border-0 bg-[#171412] text-white ring-1 ring-[#171412]">
      <CardHeader className="rounded-none">
        <CardTitle className="flex items-center gap-2">
          <Clapperboard className="size-5 text-[#ff5a4d]" />
          Critic desk
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <p className="leading-7 text-white/72">
          Voice-driven reviews with a preference for tactile production design,
          emotional precision, and endings that earn their silence.
        </p>
        <Separator className="bg-white/12" />
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-2xl font-semibold">4.1k</p>
            <p className="text-white/58">monthly readers</p>
          </div>
          <div>
            <p className="text-2xl font-semibold">36h</p>
            <p className="text-white/58">avg. draft time</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}