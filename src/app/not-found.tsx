import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-neutral-50 px-4 text-center dark:bg-neutral-950">
      <div className="max-w-md space-y-6">
        <div className="space-y-2">
          <h1 className="text-6xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
            404
          </h1>
          <h2 className="text-xl font-semibold text-neutral-800 dark:text-neutral-250">
            Page Not Found
          </h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            The page you are looking for does not exist or has been moved.
          </p>
        </div>
        <div>
          <Link href="/">
            <Button>Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
