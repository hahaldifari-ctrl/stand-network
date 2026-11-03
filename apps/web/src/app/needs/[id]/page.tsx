"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import {
  getNeed,
  pray,
  respondToNeed,
  type Need,
  type ResponseType,
} from "../../../lib/api";

function urgencyLabel(urgency: string) {
  switch (urgency) {
    case "CRITICAL":
      return "Critical need";
    case "HIGH":
      return "High need";
    case "MEDIUM":
      return "Medium need";
    case "LOW":
      return "Low need";
    default:
      return urgency;
  }
}

function urgencyClasses(urgency: string) {
  switch (urgency) {
    case "CRITICAL":
      return "bg-red-100 text-red-800";
    case "HIGH":
      return "bg-orange-100 text-orange-800";
    case "MEDIUM":
      return "bg-yellow-100 text-yellow-800";
    case "LOW":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-NG", {
    dateStyle: "long",
  }).format(new Date(date));
}

function NeedNotFound() {
  return (
    <main className="min-h-screen bg-stone-50 px-6 py-20">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">
          STAND Network
        </p>

        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-stone-900">
          Need not found
        </h1>

        <p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-stone-600">
          This need may no longer be active, may not have been verified yet,
          or the link may be incorrect.
        </p>

        <Link
          href="/"
          className="mt-8 inline-flex rounded-full bg-stone-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-stone-700"
        >
          Return to STAND Network
        </Link>
      </div>
    </main>
  );
}

function ActionPanel({
  need,
  onNeedUpdate,
}: {
  need: Need;
  onNeedUpdate: (need: Need) => void;
}) {
  const [user, setUser] = useState<{
    id: string;
    email: string;
    name?: string | null;
    role: string;
  } | null>(null);

  const [showPrayerForm, setShowPrayerForm] = useState(false);
  const [showResponseForm, setShowResponseForm] = useState(false);

  const [prayerMessage, setPrayerMessage] = useState("");
  const [responseType, setResponseType] =
    useState<ResponseType>("VOLUNTEER");
  const [responseMessage, setResponseMessage] = useState("");

  const [prayerLoading, setPrayerLoading] = useState(false);
  const [responseLoading, setResponseLoading] = useState(false);

  const [prayerSuccess, setPrayerSuccess] = useState(false);
  const [responseSuccess, setResponseSuccess] = useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("stand_user");

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("stand_user");
      }
    }
  }, []);

  function requireAuthentication(action: "pray" | "respond") {
    if (!user) {
      const returnUrl = `/needs/${need.id}`;

      window.location.href = `/login?returnUrl=${encodeURIComponent(
        returnUrl,
      )}`;

      return false;
    }

    if (action === "pray") {
      setShowPrayerForm(true);
      setShowResponseForm(false);
    } else {
      setShowResponseForm(true);
      setShowPrayerForm(false);
    }

    setError("");

    return true;
  }

  async function handlePrayer(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setPrayerLoading(true);

    try {
      await pray(need.id, prayerMessage);

      setPrayerSuccess(true);
      setPrayerMessage("");

      const updatedNeed = await getNeed(need.id);
      onNeedUpdate(updatedNeed);
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === "AUTHENTICATION_REQUIRED"
      ) {
        window.location.href = `/login?returnUrl=${encodeURIComponent(
          `/needs/${need.id}`,
        )}`;

        return;
      }

      setError("We could not record your prayer. Please try again.");
    } finally {
      setPrayerLoading(false);
    }
  }

  async function handleResponse(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setResponseLoading(true);

    try {
      await respondToNeed(
        need.id,
        responseType,
        responseMessage,
      );

      setResponseSuccess(true);
      setResponseMessage("");

      const updatedNeed = await getNeed(need.id);
      onNeedUpdate(updatedNeed);
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === "AUTHENTICATION_REQUIRED"
      ) {
        window.location.href = `/login?returnUrl=${encodeURIComponent(
          `/needs/${need.id}`,
        )}`;

        return;
      }

      setError("We could not submit your response. Please try again.");
    } finally {
      setResponseLoading(false);
    }
  }

  return (
    <aside>
      <div className="sticky top-8 rounded-3xl border border-stone-200 bg-white p-7 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-700">
          Standing together
        </p>

        <h2 className="mt-4 text-2xl font-semibold tracking-tight text-stone-900">
          You can stand with them
        </h2>

        <p className="mt-4 leading-7 text-stone-600">
          Every verified need represents a real community that needs prayer,
          encouragement, and practical support.
        </p>

        {error && (
          <div
            role="alert"
            className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-800"
          >
            {error}
          </div>
        )}

        {!showPrayerForm && !prayerSuccess && (
          <button
            type="button"
            onClick={() => requireAuthentication("pray")}
            className="mt-7 w-full rounded-full bg-stone-900 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-stone-700"
          >
            Pray with them
          </button>
        )}

        {prayerSuccess && (
          <div className="mt-7 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
            <p className="font-semibold text-emerald-900">
              ✓ Prayer recorded
            </p>

            <p className="mt-2 text-sm leading-6 text-emerald-800">
              Thank you for standing with this community in prayer.
            </p>
          </div>
        )}

        {showPrayerForm && !prayerSuccess && (
          <form
            onSubmit={handlePrayer}
            className="mt-7 rounded-2xl border border-stone-200 bg-stone-50 p-5"
          >
            <h3 className="font-semibold text-stone-900">
              Pray for this community
            </h3>

            <p className="mt-2 text-sm leading-6 text-stone-600">
              You may add a short prayer message, or simply submit your prayer.
            </p>

            <textarea
              value={prayerMessage}
              onChange={(event) => setPrayerMessage(event.target.value)}
              rows={4}
              maxLength={1000}
              placeholder="Write a prayer (optional)"
              className="mt-4 w-full resize-none rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-amber-600 focus:ring-2 focus:ring-amber-100"
            />

            <div className="mt-4 flex gap-3">
              <button
                type="submit"
                disabled={prayerLoading}
                className="flex-1 rounded-full bg-stone-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-stone-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {prayerLoading ? "Recording..." : "Submit prayer"}
              </button>

              <button
                type="button"
                onClick={() => setShowPrayerForm(false)}
                disabled={prayerLoading}
                className="rounded-full border border-stone-300 px-4 py-3 text-sm font-semibold text-stone-700"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {!showResponseForm && !responseSuccess && (
          <button
            type="button"
            onClick={() => requireAuthentication("respond")}
            className="mt-3 w-full rounded-full border border-stone-300 px-5 py-3.5 text-sm font-semibold text-stone-800 transition hover:border-stone-500 hover:bg-stone-50"
          >
            Respond to this need
          </button>
        )}

        {responseSuccess && (
          <div className="mt-7 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
            <p className="font-semibold text-emerald-900">
              ✓ Response submitted
            </p>

            <p className="mt-2 text-sm leading-6 text-emerald-800">
              Thank you for offering practical support. The STAND Network team
              can follow up with you about this response.
            </p>
          </div>
        )}

        {showResponseForm && !responseSuccess && (
          <form
            onSubmit={handleResponse}
            className="mt-7 rounded-2xl border border-stone-200 bg-stone-50 p-5"
          >
            <h3 className="font-semibold text-stone-900">
              How would you like to stand?
            </h3>

            <label
              htmlFor="response-type"
              className="mt-4 block text-sm font-semibold text-stone-800"
            >
              Support type
            </label>

            <select
              id="response-type"
              value={responseType}
              onChange={(event) =>
                setResponseType(event.target.value as ResponseType)
              }
              className="mt-2 w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-900 outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-100"
            >
              <option value="VOLUNTEER">Volunteer</option>
              <option value="MATERIAL">Material support</option>
              <option value="FINANCIAL">Financial support</option>
              <option value="PARTNERSHIP">Partnership</option>
              <option value="PRAYER">Prayer support</option>
            </select>

            <label
              htmlFor="response-message"
              className="mt-4 block text-sm font-semibold text-stone-800"
            >
              Message
            </label>

            <textarea
              id="response-message"
              value={responseMessage}
              onChange={(event) => setResponseMessage(event.target.value)}
              rows={4}
              maxLength={2000}
              placeholder="Tell us how you would like to help (optional)"
              className="mt-2 w-full resize-none rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-amber-600 focus:ring-2 focus:ring-amber-100"
            />

            <div className="mt-4 flex gap-3">
              <button
                type="submit"
                disabled={responseLoading}
                className="flex-1 rounded-full bg-stone-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-stone-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {responseLoading ? "Submitting..." : "Submit response"}
              </button>

              <button
                type="button"
                onClick={() => setShowResponseForm(false)}
                disabled={responseLoading}
                className="rounded-full border border-stone-300 px-4 py-3 text-sm font-semibold text-stone-700"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <div className="mt-8 border-t border-stone-200 pt-7">
          <p className="text-sm font-medium text-stone-500">
            Organization
          </p>

          <h3 className="mt-2 text-lg font-semibold text-stone-900">
            {need.organization.name}
          </h3>

          {need.organization.description && (
            <p className="mt-3 text-sm leading-6 text-stone-600">
              {need.organization.description}
            </p>
          )}

          {need.organization.location && (
            <p className="mt-4 text-sm text-stone-600">
              ⌖ {need.organization.location}
            </p>
          )}

          {need.organization.website && (
            <a
              href={need.organization.website}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block text-sm font-semibold text-amber-700 hover:text-amber-800"
            >
              Visit organization website →
            </a>
          )}
        </div>
      </div>
    </aside>
  );
}

function NeedDetails({ initialNeed }: { initialNeed: Need }) {
  const [need, setNeed] = useState(initialNeed);

  return (
    <main className="min-h-screen bg-stone-50">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8">
          <Link
            href="/"
            className="text-xl font-bold tracking-tight text-stone-900"
          >
            STAND<span className="text-amber-700">.</span>
          </Link>

          <Link
            href="/"
            className="text-sm font-semibold text-stone-600 transition hover:text-stone-900"
          >
            ← Back to needs
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
          <article>
            <div className="flex flex-wrap items-center gap-3">
              <span
                className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${urgencyClasses(
                  need.urgency,
                )}`}
              >
                {urgencyLabel(need.urgency)}
              </span>

              {need.verified && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                  ✓ Verified
                </span>
              )}
            </div>

            <h1 className="mt-6 max-w-4xl text-4xl font-semibold tracking-tight text-stone-950 sm:text-5xl">
              {need.title}
            </h1>

            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-stone-600">
              <span>⌖ {need.location}</span>

              {need.community && <span>◉ {need.community}</span>}

              <span>Posted {formatDate(need.createdAt)}</span>
            </div>

            <div className="mt-10 rounded-3xl border border-stone-200 bg-white p-7 shadow-sm sm:p-9">
              <h2 className="text-xl font-semibold text-stone-900">
                About this need
              </h2>

              <div className="mt-5 whitespace-pre-line text-base leading-8 text-stone-700">
                {need.description}
              </div>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-stone-200 bg-white p-6">
                <p className="text-sm font-medium text-stone-500">
                  Prayers offered
                </p>

                <p className="mt-2 text-3xl font-semibold text-stone-900">
                  {need._count.prayers}
                </p>

                <p className="mt-2 text-sm text-stone-600">
                  People are standing with this community in prayer.
                </p>
              </div>

              <div className="rounded-2xl border border-stone-200 bg-white p-6">
                <p className="text-sm font-medium text-stone-500">
                  Responses
                </p>

                <p className="mt-2 text-3xl font-semibold text-stone-900">
                  {need._count.responses}
                </p>

                <p className="mt-2 text-sm text-stone-600">
                  People have offered practical support.
                </p>
              </div>
            </div>
          </article>

          <ActionPanel
            need={need}
            onNeedUpdate={setNeed}
          />
        </div>
      </div>
    </main>
  );
}

export default function NeedPage() {
  const [need, setNeed] = useState<Need | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const pathParts = window.location.pathname.split("/");
    const id = pathParts[pathParts.length - 1];

    if (!id) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    getNeed(id)
      .then((result) => {
        setNeed(result);
      })
      .catch(() => {
        setNotFound(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-stone-50 px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">
            STAND Network
          </p>

          <p className="mt-6 text-stone-600">
            Loading need...
          </p>
        </div>
      </main>
    );
  }

  if (notFound || !need) {
    return <NeedNotFound />;
  }

  return <NeedDetails initialNeed={need} />;
}