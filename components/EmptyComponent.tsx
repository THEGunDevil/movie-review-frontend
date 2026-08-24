import { SearchX } from "lucide-react"; // You can change the default icon

interface EmptyComponentProps {
  message: string;
  icon?: React.ReactNode;
  className?: string;
}

export function EmptyComponent({ message, icon, className }: EmptyComponentProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center py-16 text-center ${className ?? ""}`}
    >
      {icon || <SearchX className="h-12 w-12 text-slate-600 mb-4" />}
      <p className="text-sm text-slate-500">{message}</p>
    </div>
  );
}