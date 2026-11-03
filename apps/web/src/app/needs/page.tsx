"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { getNeeds, type Need } from "../../lib/api";

type Filter = "ALL" | "VERIFIED";

function urgencyLabel(urgency: string) {
  switch (urgency.toUpperCase()) {
    case "CRITICAL":
      return "Critical";
    case "HIGH":
      return "High";
    case "MEDIUM":
      return "Medium";
    case "LOW":
      return "Low";
    default:
      return urgency || "Not specified";
  }
}

function urgencyClasses(urgency: string) {
  switch (urgency.toUpperCase()) {
    case "CRITICAL":
      return "border-red-200 bg-red-50 text-red-800";
    case "HIGH":
      return "border-orange-200 bg-orange-50 text-orange-800";
    case "MEDIUM":
      return "border-amber-200 bg-amber-50 text-amber-800";
    case "LOW":
      return "border-emerald-200 bg-emerald-50 text-emerald-800";
    default:
      return "border-stone-200 bg-stone-100 text-stone-700";
  }
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function isDemoNeed(need: Need) {
  const text = `${need.title} ${need.description} ${need.organization.name}`;
  return /\btest\b|\bdemo\b|\bplaceholder\b/i.test(text);
}

function NeedCard({ need }: { need: Need }) {
  const demo = isDemoNeed(need);

  return (
    <article className="flex h-full flex-col rounded-3xl border border-stone-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg sm:p-7">
      <div className="flex flex-wrap items-center gap-2">
        <span
          className={`rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wide ${urgencyClasses(
            need.urgency,
          )}`}
        >
          {urgencyLabel(need.urgency)} urgency
        </span>

        {need.verified ? (
          <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
            Verified
          </span>
        ) : (
          <span className="rounded-full border border-stone-200 bg-stone-50 px-3 py-1 text-xs font-semibold text-stone-600">
            Awaiting verification
          </span>
        )}

        {demo && (
          <span className="rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-800">
            Test/demo record
          </span>
        )}
      </div>

      <h2 className="mt-5 text-xl font-semibold leading-snug tracking-tight text-stone-900">
        {need.title}
      </h2>

      <p className="mt-3 text-sm leading-7 text-stone-600">
        {need.description}
      </p>

      <div className="mt-5 space-y-2 text-sm text-stone-600">
        <p>
          <span className="font-semibold text-stone-800">Location:</span>{" "}
          {need.location || "Not specified"}
        </p>

        {need.community && (
          <p>
            <span className="font-semibold text-stone-800">Community:</span>{" "}
            {need.community}
          </p>
        )}

        <p>
          <span className="font-semibold text-stone-800">Organization:</span>{" "}
          {need.organization.name}
        </p>

        <p>
          <span className="font-semibold text-stone-800">Listed:</span>{" "}
          {formatDate(need.createdAt)}
        </p>
      </div>

      <div className="mt-auto pt-7">
        <Link
          href={`/needs/${encodeURIComponent(need.id)}`}
          className="inline-flex w-full items-center justify-center rounded-full bg-stone-900 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-stone-700"
        >
          View need and ways to help
          <span className="ml-2" aria-hidden="true">
            →
          </span>
        </Link>
      </div>
    </article>
  );
}

export default function NeedsPage() {
  const [needs, setNeeds] = useState<Need[]>([]);
  const [filter, setFilter] = useState<Filter>("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadNeeds = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const result = await getNeeds();
      setNeeds(Array.isArray(result) ? result : []);
    } catch {
      setError(
        "We could not load the needs directory. Please check that the STAND API is running and try again.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadNeeds();
  }, [loadNeeds]);

  const visibleNeeds =
    filter === "VERIFIED"
      ? needs.filter((need) => need.verified)
      : needs;

  return (
    <main className="min-h-screen bg-stone-50">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-5 lg:px-8">
          <Link
            href="/"
            className="text-xl font-bold tracking-tight text-stone-900"
            aria-label="STAND Network home"
          >
            STAND<span className="text-amber-700">.</span>
          </Link>

          <Link
            href="/incidents"
            className="text-sm font-semibold text-stone-600 transition hover:text-stone-900"
          >
            View incidents →
          </Link>
        </div>
      </header>

      <section className="border-b border-stone-200 bg-[#f7f4ee]">
        <div className="mx-auto max-w-7xl px-6 py-14 sm:py-20 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-800">
            See a need. Respond with compassion.
          </p>

          <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-tight tracking-tight text-stone-950 sm:text-5xl lg:text-6xl">
            Stand with communities that need support.
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-stone-600 sm:text-lg">
            Discover community needs shared through STAND Network. Learn
            about each request, check its verification status, and explore
            ways to offer prayer or practical support.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#needs-directory"
              className="inline-flex items-center justify-center rounded-full bg-stone-900 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-stone-700"
            >
              Explore needs
            </a>

            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full border border-stone-300 bg-white px-6 py-3.5 text-sm font-semibold text-stone-800 transition hover:bg-stone-100"
            >
              Back to home
            </Link>
          </div>
        </div>
      </section>

      <section
        id="needs-directory"
        className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16"
      >
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-800">
              Community support
            </p>

            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl">
              Needs directory
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-6 text-stone-600">
              Review each request carefully. Verification status is shown
              separately from urgency.
            </p>
          </div>

          <div className="flex flex-wrap gap-2" aria-label="Filter needs">
            <button
              type="button"
              onClick={() => setFilter("ALL")}
              aria-pressed={filter === "ALL"}
              className={`rounded-full border px-4 py-2.5 text-sm font-semibold transition ${
                filter === "ALL"
                  ? "border-stone-900 bg-stone-900 text-white"
                  : "border-stone-300 bg-white text-stone-700 hover:bg-stone-100"
              }`}
            >
              All needs
            </button>

            <button
              type="button"
              onClick={() => setFilter("VERIFIED")}
              aria-pressed={filter === "VERIFIED"}
              className={`rounded-full border px-4 py-2.5 text-sm font-semibold transition ${
                filter === "VERIFIED"
                  ? "border-emerald-800 bg-emerald-800 text-white"
                  : "border-stone-300 bg-white text-stone-700 hover:bg-stone-100"
              }`}
            >
              Verified only
            </button>
          </div>
        </div>

        {!loading && !error && (
          <p className="mt-6 text-sm text-stone-500" aria-live="polite">
            Showing {visibleNeeds.length}{" "}
            {visibleNeeds.length === 1 ? "need" : "needs"}
            {filter === "VERIFIED" ? " marked as verified" : ""}.
          </p>
        )}

        {loading && (
          <div className="mt-8 rounded-3xl border border-stone-200 bg-white px-6 py-16 text-center">
            <p className="font-semibold text-stone-900">
              Loading community needs…
            </p>
            <p className="mt-2 text-sm text-stone-500">
              Please wait while we retrieve the latest records.
            </p>
          </div>
        )}

        {!loading && error && (
          <div
            role="alert"
            className="mt-8 rounded-3xl border border-red-200 bg-red-50 p-6 sm:p-8"
          >
            <h3 className="text-lg font-semibold text-red-900">
              The directory is temporarily unavailable
            </h3>
            <p className="mt-3 text-sm leading-6 text-red-800">{error}</p>
            <button
              type="button"
              onClick={() => void loadNeeds()}
              className="mt-5 rounded-full bg-stone-900 px-5 py-3 text-sm font-semibold text-white hover:bg-stone-700"
            >
              Try again
            </button>
          </div>
        )}

        {!loading && !error && visibleNeeds.length === 0 && (
          <div className="mt-8 rounded-3xl border border-stone-200 bg-white px-6 py-16 text-center">
            <h3 className="text-xl font-semibold text-stone-900">
              {filter === "VERIFIED"
                ? "No verified needs to display yet"
                : "No needs to display yet"}
            </h3>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-stone-600">
              {filter === "VERIFIED"
                ? "There are currently no records marked as verified. You can check all listed needs or return later."
                : "There are currently no needs available in the directory. Please check again later."}
            </p>
            {filter === "VERIFIED" && (
              <button
                type="button"
                onClick={() => setFilter("ALL")}
                className="mt-5 rounded-full border border-stone-300 px-5 py-3 text-sm font-semibold text-stone-800 hover:bg-stone-100"
              >
                View all needs
              </button>
            )}
          </div>
        )}

        {!loading && !error && visibleNeeds.length > 0 && (
          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {visibleNeeds.map((need) => (
              <NeedCard key={need.id} need={need} />
            ))}
          </div>
        )}

        <div className="mt-14 rounded-3xl border border-stone-200 bg-white p-7 sm:p-9">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-800">
            A note on verification
          </p>
          <h2 className="mt-3 text-xl font-semibold text-stone-900">
            Trust matters
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-stone-600">
            A need being listed does not, by itself, mean that it has been
            verified. Check the status displayed on each card before deciding
            how to respond. Records labelled as test/demo are development
            entries and should not be treated as confirmed real-world requests.
          </p>
        </div>
      </section>

      <footer className="border-t border-stone-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-8 text-sm text-stone-500 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <p>
            <span className="font-semibold text-stone-800">STAND Network</span>
            {" "}— You are not standing alone.
          </p>
          <Link
            href="/"
            className="font-semibold text-stone-700 hover:text-amber-800"
          >
            Return home →
          </Link>
        </div>
      </footer>
    </main>
  );
}
