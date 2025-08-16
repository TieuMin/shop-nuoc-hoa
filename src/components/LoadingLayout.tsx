import { Loader2 } from "lucide-react";

interface Prop {
  isLoading: boolean;
}

export const LoadingLayout = ({ isLoading }: Prop) => {
  if (!isLoading) return null;
  return (
    <div className="fixed left-0 right-0 top-0 z-[100] h-full bg-slate-800/40">
      <div className="flex h-[calc(100vh-3rem)] w-full items-center justify-center gap-2 text-white text-lg font-bold">
        <Loader2 className="animate-spin" />
        Loading...
      </div>
    </div>
  );
};
