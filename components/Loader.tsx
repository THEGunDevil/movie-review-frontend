import { Loader2 } from "lucide-react";
function Loader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950">
      <Loader2 className="h-12 w-12 animate-spin text-red-500" />
    </div>
  );
}

export default Loader;
