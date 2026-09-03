"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Unhandled application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#0a0a0a] text-neutral-200 px-4">
      <div className="w-full max-w-md bg-[#1a1a1a] border border-red-900 rounded-2xl p-6 text-center">
        <h1 className="text-lg font-semibold text-neutral-100 mb-2">
          Something went wrong
        </h1>
        <p className="text-sm text-neutral-400 mb-4">
          An unexpected error occurred. You can try again, or head back to
          the homepage.
        </p>
        <div className="flex justify-center gap-3">
          <button
            onClick={reset}
            className="bg-neutral-100 text-black font-semibold px-4 py-2 rounded-lg hover:opacity-90"
          >
            Try again
          </button>
          <Link
            href="/"
            className="border border-neutral-700 text-neutral-200 font-semibold px-4 py-2 rounded-lg hover:bg-neutral-800"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
