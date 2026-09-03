import Link from "next/link";

export default function AuditNotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#1a1a1a] text-neutral-200 px-4">
      <div className="w-full max-w-md bg-[#111111] border border-neutral-700 rounded-2xl p-6 text-center">
        <h1 className="text-lg font-semibold text-neutral-100 mb-2">
          Audit not found
        </h1>
        <p className="text-sm text-neutral-400 mb-4">
          This share link doesn&apos;t match any audit — it may have been
          mistyped, or the audit no longer exists.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center bg-neutral-100 text-black font-semibold px-4 py-2 rounded-lg hover:opacity-90"
        >
          Run your own audit
        </Link>
      </div>
    </div>
  );
}
