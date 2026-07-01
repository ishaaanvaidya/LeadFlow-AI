import React from "react";
import { Spinner } from "@/components/ui/spinner";

export default function Loading() {
  return (
    <div className="flex flex-1 items-center justify-center bg-neutral-50 dark:bg-neutral-950">
      <div className="flex flex-col items-center gap-2">
        <Spinner className="h-8 w-8 text-neutral-900 dark:text-neutral-100" />
        <p className="text-sm text-neutral-500 dark:text-neutral-400 animate-pulse">
          Loading LeadFlow AI...
        </p>
      </div>
    </div>
  );
}
