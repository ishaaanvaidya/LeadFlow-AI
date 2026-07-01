"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await authClient.signOut();
      router.push("/sign-in");
      router.refresh();
    } catch (err) {
      console.error("Sign out failed", err);
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className="p-2 h-9 w-9 text-neutral-500 hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-neutral-50 cursor-pointer"
      onClick={handleLogout}
      isLoading={isLoading}
      title="Log out"
    >
      {!isLoading && <LogOut className="h-4 w-4" />}
    </Button>
  );
}
