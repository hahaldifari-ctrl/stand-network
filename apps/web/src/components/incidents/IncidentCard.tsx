import Link from 'next/link';
import type { PublicIncident } from '@/lib/api';

type IncidentCardProps = {
  incident: PublicIncident;
};

function formatDate(value?: string | null) {
  if (!value) {
    return 'Date not recorded';
  }

  return new Intl.DateTimeFormat('en-NG', {
    dateStyle: 'medium',
  }).format(new Date(value));
}

function formatLabel(value?: string | null) {
  if (!value) {
    return 'Not recorded';
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

function getImpact(incident: PublicIncident) {
  if (
    incident.affectedPeopleCount !== null &&
    incident.affectedPeopleCount !== undefined
  ) {
    return `${incident.affectedPeopleCount} people affected`;
  }

  if (
    incident.peopleKilled !== null &&
    incident.peopleKilled !== undefined
  ) {
    return `${incident.peopleKilled} people killed`;
  }

  return null;
}

export default function IncidentCard({ incident }: IncidentCardProps) {
  const impact = getImpact(incident);

  return (
    <article className="flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md sm:p-7">
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
          Verified
        </span>

        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
          {formatLabel(incident.incidentType)}
        </span>
      </div>

      <h2 className="mt-5 text-xl font-semibold leading-7 tracking-tight text-slate-950">
        {incident.title}
      </h2>

      <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
        {incident.description}
      </p>

      <div className="mt-5 space-y-3 border-t border-slate-100 pt-5 text-sm">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 text-slate-400" aria-hidden="true">
            Location
          </span>
          <span className="font-medium text-slate-700">
            {getLocation(incident)}
          </span>
        </div>

        <div className="flex items-start gap-3">
          <span className="mt-0.5 text-slate-400" aria-hidden="true">
            Date
          </span>
          <span className="font-medium text-slate-700">
            {formatDate(incident.incidentDate)}
          </span>
        </div>
      </div>

      {impact ? (
        <div className="mt-4">
          <span className="inline-flex rounded-lg bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-800">
            {impact}
          </span>
        </div>
      ) : null}

      <div className="mt-auto pt-7">
        <Link
          href={`/incidents/${incident.id}`}
          className="inline-flex items-center gap-2 text-sm font-bold text-emerald-800 transition hover:text-emerald-600"
        >
          Read incident report
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
}