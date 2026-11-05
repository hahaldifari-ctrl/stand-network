
import Link from 'next/link';
import type { PublicIncident } from '@/lib/api';

type IncidentCardProps = {
  incident: PublicIncident;
};

function formatDate(value?: string | null) {
  if (!value) {
    return 'Date not recorded';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Date not recorded';
  }

  return new Intl.DateTimeFormat('en-NG', {
    dateStyle: 'medium',
  }).format(date);
}

function formatLabel(value?: string | null) {
  if (!value) {
    return 'Type not recorded';
  }

  return value
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function getLocation(incident: PublicIncident) {
  return [incident.community, incident.lga, incident.state]
    .filter(Boolean)
    .join(', ') || 'Location not recorded';
}

export default function IncidentCard({ incident }: IncidentCardProps) {
  return (
    <article className="group flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg sm:p-7">
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-bold text-emerald-800">
          <span
            className="h-1.5 w-1.5 rounded-full bg-emerald-600"
            aria-hidden="true"
          />
          Verified
        </span>

        <span className="inline-flex items-center rounded-full border border-emerald-200 bg-white px-3 py-1.5 text-xs font-semibold text-emerald-800">
          Approved for public sharing
        </span>
      </div>

      <div className="mt-5">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
          {formatLabel(incident.incidentType)}
        </p>

        <h2 className="mt-3 text-xl font-semibold leading-7 tracking-tight text-slate-950">
          {incident.title}
        </h2>
      </div>

      <p className="mt-3 line-clamp-3 text-sm leading-7 text-slate-600">
        {incident.description}
      </p>

      <dl className="mt-6 space-y-4 border-t border-slate-100 pt-5 text-sm">
        <div className="flex items-start gap-3">
          <dt className="w-20 shrink-0 font-medium text-slate-500">
            Location
          </dt>
          <dd className="font-medium leading-6 text-slate-700">
            {getLocation(incident)}
          </dd>
        </div>

        <div className="flex items-start gap-3">
          <dt className="w-20 shrink-0 font-medium text-slate-500">
            Date
          </dt>
          <dd className="font-medium leading-6 text-slate-700">
            {formatDate(incident.incidentDate)}
          </dd>
        </div>
      </dl>

      <div className="mt-auto border-t border-slate-100 pt-6">
        <Link
          href={`/incidents/${incident.id}`}
          aria-label={`Read incident report: ${incident.title}`}
          className="inline-flex items-center gap-2 rounded-sm text-sm font-bold text-emerald-800 transition hover:text-emerald-600 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-700"
        >
          Read incident report
          <span
            aria-hidden="true"
            className="transition-transform group-hover:translate-x-1"
          >
            →
          </span>
        </Link>
      </div>
    </article>
  );
}
