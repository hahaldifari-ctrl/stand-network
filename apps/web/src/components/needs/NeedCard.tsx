import Link from "next/link";
import type { Need } from "../../lib/api";
import { NeedStats } from "./NeedStats";
import { NeedUrgency } from "./NeedUrgency";

interface NeedCardProps {
  need: Need;
}

export function NeedCard({ need }: NeedCardProps) {
  const formattedDate = new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(need.createdAt));

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[24px] border border-stone-200/80 bg-white shadow-stand-card transition duration-300 hover:-translate-y-1 hover:shadow-stand-floating">
      <div className="relative h-2 bg-stand-cream-deep">
        <div
          className={`h-full ${
            need.urgency === "CRITICAL"
              ? "bg-stand-red"
              : need.urgency === "HIGH"
                ? "bg-stand-gold"
                : need.urgency === "MEDIUM"
                  ? "bg-stand-blue"
                  : "bg-stand-green"
          }`}
        />
      </div>

      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <NeedUrgency
          urgency={need.urgency}
          verified={need.verified}
        />

        <div className="mt-5">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-stand-earth-light">
            {need.location}
          </p>

          <h3 className="mt-2 text-xl font-bold leading-tight tracking-tight text-stand-ink">
            {need.title}
          </h3>

          <p className="mt-3 line-clamp-3 text-sm leading-6 text-stand-earth">
            {need.description}
          </p>
        </div>

        <div className="mt-5 space-y-2 border-t border-stone-100 pt-5 text-sm">
          {need.community && (
            <p className="text-stand-earth">
              <span className="font-semibold text-stand-ink">
                Community:
              </span>{" "}
              {need.community}
            </p>
          )}

          <p className="text-stand-earth">
            <span className="font-semibold text-stand-ink">
              Organization:
            </span>{" "}
            {need.organization.name}
          </p>
        </div>

        <div className="mt-auto pt-6">
          <div className="flex items-center justify-between gap-4">
            <NeedStats
              prayers={need._count.prayers}
              responses={need._count.responses}
            />

            <span className="text-xs text-stand-earth-light">
              {formattedDate}
            </span>
          </div>

          <Link
            href={`/needs/${need.id}`}
            className="stand-interactive mt-5 flex min-h-12 w-full items-center justify-center rounded-full bg-stand-ink px-5 py-3 text-sm font-semibold text-white hover:bg-stand-ink-soft"
          >
            Stand with this community
            <span
              aria-hidden="true"
              className="ml-2 transition-transform duration-200 group-hover:translate-x-1"
            >
              →
            </span>
          </Link>
        </div>
      </div>
    </article>
  );
}