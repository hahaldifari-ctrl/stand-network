import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getIncident, type PublicIncidentDetail } from '@/lib/api';

type IncidentDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

function formatDate(value?: string | null) {
  if (!value) {
    return 'Date not recorded';
  }

  return new Intl.DateTimeFormat('en-NG', {
    dateStyle: 'long',
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

function locationLabel(incident: PublicIncidentDetail) {
  const parts = [incident.community, incident.lga, incident.state].filter(
    Boolean,
  );

  return parts.length > 0 ? parts.join(', ') : 'Location not recorded';
}

function impactItems(incident: PublicIncidentDetail) {
  const items: { label: string; value: string }[] = [];

  if (incident.peopleKilled !== null && incident.peopleKilled !== undefined) {
    items.push({
      label: 'Killed',
      value: String(incident.peopleKilled),
    });
  }

  if (
    incident.peopleInjured !== null &&
    incident.peopleInjured !== undefined
  ) {
    items.push({
      label: 'Injured',
      value: String(incident.peopleInjured),
    });
  }

  if (
    incident.peopleAbducted !== null &&
    incident.peopleAbducted !== undefined
  ) {
    items.push({
      label: 'Abducted',
      value: String(incident.peopleAbducted),
    });
  }

  if (
    incident.peopleDisplaced !== null &&
    incident.peopleDisplaced !== undefined
  ) {
    items.push({
      label: 'Displaced',
      value: String(incident.peopleDisplaced),
    });
  }

  if (
    incident.affectedPeopleCount !== null &&
    incident.affectedPeopleCount !== undefined
  ) {
    items.push({
      label: 'People affected',
      value: String(incident.affectedPeopleCount),
    });
  }

  return items;
}

export default async function IncidentDetailPage({
  params,
}: IncidentDetailPageProps) {
  const { id } = await params;

  let incident: PublicIncidentDetail;

  try {
    incident = await getIncident(id);
  } catch (error) {
    if (error instanceof Error && error.message === 'INCIDENT_NOT_FOUND') {
      notFound();
    }

    throw error;
  }

  const impacts = impactItems(incident);

  return (
    <main className="min-h-screen bg-white text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8">
          <Link
            href="/"
            className="text-sm font-bold tracking-[0.18em] text-slate-950"
          >
            STAND NETWORK
          </Link>

          <Link
            href="/incidents"
            className="text-sm font-semibold text-slate-600 transition hover:text-slate-950"
          >
            ← Back to verified incidents
          </Link>
        </div>
      </header>

      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8 lg:py-20">
          <div className="max-w-4xl">
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-emerald-800">
                Verified incident
              </span>

              <span className="rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-600">
                {formatLabel(incident.incidentType)}
              </span>
            </div>

            <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              {incident.title}
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">
              {incident.description}
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                  Location
                </p>
                <p className="mt-2 font-semibold text-slate-950">
                  {locationLabel(incident)}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                  Incident date
                </p>
                <p className="mt-2 font-semibold text-slate-950">
                  {formatDate(incident.incidentDate)}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                  Confidence
                </p>
                <p className="mt-2 font-semibold text-emerald-700">
                  {formatLabel(incident.confidenceLevel)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-14 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-8 lg:py-20">
        <div className="space-y-10">
          <section>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">
              Incident report
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
              What happened
            </h2>

            <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
              <p className="text-base leading-8 text-slate-700">
                {incident.description}
              </p>
            </div>
          </section>

          <section>
            <div className="rounded-3xl border border-emerald-100 bg-emerald-50 p-7">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">
                Verification status
              </p>

              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
                Publicly shared only after review
              </h2>

              <p className="mt-4 leading-7 text-slate-700">
                {incident.verificationSummary ??
                  'This incident has been reviewed and verified for public reporting by the STAND Network verification process.'}
              </p>
            </div>
          </section>

          <section>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-7">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                How this report was verified
              </p>

              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
                Verification is about responsible truth
              </h2>

              <div className="mt-5 space-y-4 text-sm leading-7 text-slate-600">
                <p>
                  STAND reviews incident reports before they are presented as
                  verified public records. The review process considers
                  supporting sources and available corroborating evidence.
                </p>

                <p>
                  The public record is intentionally limited to information
                  that can be responsibly shared. This helps protect affected
                  communities while maintaining a clear distinction between
                  documented information and unverified claims.
                </p>

                <p>
                  Verification does not mean that every detail of an incident
                  is independently observable or publicly reproducible. It
                  means the report has passed the STAND Network review standard
                  for inclusion as a verified incident.
                </p>
              </div>
            </div>
          </section>

          <section>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
              Incident context
            </p>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 p-5">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                  Incident type
                </p>
                <p className="mt-2 font-semibold text-slate-950">
                  {formatLabel(incident.incidentType)}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 p-5">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                  Motivation
                </p>
                <p className="mt-2 font-semibold text-slate-950">
                  {formatLabel(incident.motivation)}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 p-5">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                  Religious context
                </p>
                <p className="mt-2 font-semibold text-slate-950">
                  {formatLabel(incident.religiousContext)}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 p-5">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                  Status
                </p>
                <p className="mt-2 font-semibold text-emerald-700">
                  {formatLabel(incident.status)}
                </p>
              </div>
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
              Recorded impact
            </p>

            {impacts.length > 0 ? (
              <div className="mt-5 space-y-3">
                {impacts.map((impact) => (
                  <div
                    key={impact.label}
                    className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-4"
                  >
                    <span className="text-sm font-medium text-slate-600">
                      {impact.label}
                    </span>

                    <span className="text-lg font-bold text-slate-950">
                      {impact.value}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-5 text-sm leading-6 text-slate-600">
                No quantified impact figures are currently included in the
                public record.
              </p>
            )}

            {incident.propertyDamage ? (
              <div className="mt-5 border-t border-slate-200 pt-5">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                  Property damage
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  {incident.propertyDamage}
                </p>
              </div>
            ) : null}
          </section>

          <section className="rounded-3xl bg-slate-950 p-7 text-white">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-300">
              Stand with them
            </p>

            <h2 className="mt-3 text-2xl font-semibold tracking-tight">
              Truth should lead to compassion.
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-300">
              Learn what is happening, pray for affected communities, and find
              responsible ways to stand with people facing persecution and
              violence.
            </p>

            <Link
              href="/"
              className="mt-6 inline-flex items-center font-semibold text-white transition hover:text-emerald-300"
            >
              Find your way to stand →
            </Link>
          </section>
        </aside>
      </section>

      <footer className="border-t border-slate-200 bg-slate-50">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <p>STAND Network public incident record</p>

          <p>
            Last updated {formatDate(incident.updatedAt)}
          </p>
        </div>
      </footer>
    </main>
  );
}