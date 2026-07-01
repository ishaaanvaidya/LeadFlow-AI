"use client";

import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("Next.js Boundary Error:", error);
  }, [error]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-neutral-50 px-4 text-center dark:bg-neutral-950">
      <div className="max-w-md space-y-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
            Something went wrong
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            An unexpected error occurred. We have logged the error details.
          </p>
        </div>
        <div className="flex justify-center gap-4">
          <Button onClick={reset}>Try again</Button>
          <Button variant="outline" onClick={() => (window.location.href = "/")}>
            Go Home
          </Button>
        </div>
      </div>
    </div>
  );
}
