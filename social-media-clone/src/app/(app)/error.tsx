"use client";

import { useEffect } from "react";

import ServerError from "~/components/shared/ServerError";

type AppErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function AppError({ error, reset }: AppErrorProps) {
  useEffect(() => {
    console.error("Application route failed", {
      digest: error.digest,
    });
  }, [error]);

  return <ServerError onRetry={reset} />;
}
