"use client";

import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  return (
    <SonnerToaster
      position="bottom-right"
      toastOptions={{
        classNames: {
          toast: "group font-sans text-foreground bg-background border shadow-lg rounded-lg",
          title: "font-medium text-sm",
          description: "text-sm text-muted-foreground",
          actionButton: "bg-primary text-primary-foreground",
          cancelButton: "bg-muted text-muted-foreground",
          error: "!bg-destructive !text-destructive-foreground",
          success: "!bg-green-500/20 !text-green-800",
          info: "!bg-blue-500/20 !text-blue-800",
          warning: "!bg-amber-500/20 !text-amber-800",
        },
      }}
    />
  );
}

// Re-export toast function from sonner for easy access
export { toast } from "sonner";